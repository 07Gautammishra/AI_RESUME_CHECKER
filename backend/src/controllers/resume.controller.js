import { z } from "zod";
import mongoose from "mongoose";

import Resume from "../models/Resume.js";
import ResumeVersion from "../models/ResumeVersion.js";
import Analysis from "../models/Analysis.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

import { extractTextFromPdf } from "../services/pdfService.js";
import { parseResume } from "../services/structuredParser.js";
import { analyzeResume } from "../services/geminiService.js";
import { diffText, summarize } from "../services/diffService.js";


export const objectIdSchema = z
  .string()
  .refine((v) => mongoose.isValidObjectId(v), { message: "Invalid ID format" });

export const idParamSchema = z.object({ id: objectIdSchema });

export const versionParamSchema = z.object({
  id: objectIdSchema,
  versionId: objectIdSchema,
});

export const analysisBodySchema = z.object({
  versionId: objectIdSchema.optional(),
  targetRole: z.string().trim().max(120).optional(),
});

export const rewriteBodySchema = z.object({
  analysisId: objectIdSchema,
  rewriteIds: z.array(objectIdSchema).optional(),
  label: z.string().trim().max(50).optional(),
});

export const diffQuerySchema = z.object({
  from: objectIdSchema,
  to: objectIdSchema,
  mode: z.enum(["words", "lines"]).optional(),
});

// Helper: Loads a resume owned by the requesting user
const loadOwnResume = async (req) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid resume ID format");
  }

  const resume = await Resume.findOne({
    _id: id,
    userId: req.user?._id,
  });

  if (!resume) {
    throw ApiError.notFound("Resume not found");
  }

  return resume;
};

// Helper: Loads a specific version for a given resume
const loadVersion = async (resumeId, versionId) => {
  const version = await ResumeVersion.findOne({ _id: versionId, resumeId });
  if (!version) throw ApiError.notFound("Resume version not found");
  return version;
};

// Helper: Applies rewrite patches to raw text
function applyRewritesToText(rawText, rewrites) {
  let result = rawText;
  for (let r of rewrites) {
    if (!r.original || !r.rewritten) continue;
    const idx = result.indexOf(r.original);
    if (idx >= 0) {
      result =
        result.slice(0, idx) + r.rewritten + result.slice(idx + r.original.length);
    } else {
      result += `\n${r.rewritten}`;
    }
  }
  return result;
}

// Helper: Patches experience bullet points directly in structured JSON
function patchBulletsInSection(sections, rewrites) {
  if (!sections) return null;
  const cloned = JSON.parse(JSON.stringify(sections));
  for (const r of rewrites) {
    if (!r?.original || !r?.rewritten) continue;
    for (const exp of cloned.experience || []) {
      exp.bullets = exp.bullets.map((b) => (b === r.original ? r.rewritten : b));
    }
  }
  return cloned;
}

// Helper: Checks if parsed sections are virtually empty
function looksEmpty(sections) {
  if (!sections) return true;
  const b = sections.basics || {};
  const hasIdentity = b.name || b.email || b.title;
  const hasBody =
    sections.summary ||
    sections.experience?.length ||
    sections.education?.length ||
    sections.skills?.length;
  return !hasBody && !hasIdentity;
}

// ==========================================
// CONTROLLER ACTIONS
// ==========================================

/**
 * @desc    Upload PDF and create initial resume & version V1
 * @route   POST /api/resumes
 */
export const createResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest("PDF file is required");
  }

  const { text, meta } = await extractTextFromPdf(req.file.buffer);
  const parsedSections = await parseResume(text);

  const title =
    (req.body.title || "").trim() ||
    req.file.originalname.replace(/\.pdf$/i, "") ||
    "Untitled_Resume";

  const resume = await Resume.create({
    userId: req.user._id,
    title,
    latestVersionNumber: 1,
  });

  const version = await ResumeVersion.create({
    resumeId: resume._id,
    versionNumber: 1,
    label: "V1",
    rawText: text,
    parsedSections,
    sourceType: "upload",
    parentVersionId: null,
  });

  resume.currentVersion = version._id;
  await resume.save();

  res.status(201).json({ resume, version, meta });
});

/**
 * @desc    Get all resumes for logged-in user
 * @route   GET /api/resumes
 */
export const getAllResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .sort({ updatedAt: -1 })
    .lean();
  res.json({ resumes });
});

/**
 * @desc    Get single resume with version history list
 * @route   GET /api/resumes/:id
 */
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);
  const versions = await ResumeVersion.find({ resumeId: resume._id })
    .sort({ versionNumber: 1 })
    .select("-rawText")
    .lean();

  res.json({ resume, versions });
});

/**
 * @desc    Get a single version of a resume
 * @route   GET /api/resumes/:id/version/:versionId
 */
export const getResumeVersion = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);
  const version = await loadVersion(resume._id, req.params.versionId);

  res.json({ version });
});

/**
 * @desc    Delete a resume and all associated data
 * @route   DELETE /api/resumes/:id
 */
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);

  await Promise.all([
    ResumeVersion.deleteMany({ resumeId: resume._id }),
    Analysis.deleteMany({ resumeId: resume._id }),
    resume.deleteOne(),
  ]);

  res.json({
    ok: true,
    message: "Resume and all associated data deleted successfully",
  });
});

/**
 * @desc    Analyze a resume version using AI
 * @route   POST /api/resumes/:id/analyze
 */
export const analyzeResumeVersion = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);
  const versionId = req.body.versionId || resume.currentVersion;

  if (!versionId) throw ApiError.badRequest("No version available to analyze");

  const version = await loadVersion(resume._id, versionId);

  const { analysis, model, promptTokens, responseTokens } = await analyzeResume({
    rawText: version.rawText,
    targetRole: req.body.targetRole,
  });

  const saved = await Analysis.create({
    userId: req.user._id,
    resumeId: resume._id,
    versionId: version._id,
    atsScore: analysis.atsScore,
    scoreBreakdown: analysis.scoreBreakdown,
    issues: analysis.issues,
    strengths: analysis.strengths,
    bulletRewrites: analysis.bulletRewrites,
    keywordsPresent: analysis.keywordsPresent,
    keywordsMissing: analysis.keywordsMissing,
    summary: analysis.summary,
    model,
    promptTokens,
    responseTokens,
  });

  version.latestAnalysisId = saved._id;
  await version.save();

  res.status(201).json({ analysis: saved });
});

/**
 * @desc    Get analysis for a specific version
 * @route   GET /api/resumes/:id/versions/:versionId/analysis
 */
export const getVersionAnalysis = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);
  const version = await loadVersion(resume._id, req.params.versionId);

  const analysis = await Analysis.findOne({
    resumeId: resume._id,
    versionId: version._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ analysis: analysis || null });
});

/**
 * @desc    Get all analyses for a resume
 * @route   GET /api/resumes/:id/analyses
 */
export const getAllAnalyses = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);
  const analysis = await Analysis.find({ resumeId: resume._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ analysis });
});

/**
 * @desc    Apply AI bullet rewrites and create a new resume version
 * @route   POST /api/resumes/:id/rewrite
 */
export const applyRewrites = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);

  const analysis = await Analysis.findOne({
    _id: req.body.analysisId,
    resumeId: resume._id,
  });

  if (!analysis) throw ApiError.notFound("Analysis not found");

  const baseVersion = await loadVersion(resume._id, analysis.versionId);

  const selected = req.body.rewriteIds?.length
    ? analysis.bulletRewrites.filter((r) =>
        req.body.rewriteIds.includes(r._id.toString())
      )
    : analysis.bulletRewrites;

  if (!selected.length) {
    throw ApiError.badRequest("No rewrites selected to apply");
  }

  const newRaw = applyRewritesToText(baseVersion.rawText, selected);
  const patchedFromBase = patchBulletsInSection(
    baseVersion.parsedSections,
    selected
  );

  const reparsed = await parseResume(newRaw);
  const finalParsed = looksEmpty(reparsed) ? patchedFromBase : reparsed;

  // Find highest version number directly from MongoDB
  const latestVersionDoc = await ResumeVersion.findOne({ resumeId: resume._id })
    .sort({ versionNumber: -1 })
    .select("versionNumber")
    .lean();

  const currentHighest =
    latestVersionDoc?.versionNumber || resume.latestVersionNumber || 0;
  const nextNumber = currentHighest + 1;

  const nextVersion = await ResumeVersion.create({
    resumeId: resume._id,
    versionNumber: nextNumber,
    label: req.body.label?.trim() || `V${nextNumber}`,
    rawText: newRaw,
    parsedSections: finalParsed,
    sourceType: "rewrite",
    parentVersionId: baseVersion._id,
  });

  resume.latestVersionNumber = nextNumber;
  resume.currentVersion = nextVersion._id;
  await resume.save();

  res.status(201).json({
    version: nextVersion,
    appliedCount: selected.length,
  });
});

/**
 * @desc    Diff two versions of a resume
 * @route   GET /api/resumes/:id/diff
 */
export const getDiffBetweenVersions = asyncHandler(async (req, res) => {
  const resume = await loadOwnResume(req);

  const [fromV, toV] = await Promise.all([
    loadVersion(resume._id, req.query.from),
    loadVersion(resume._id, req.query.to),
  ]);

  const parts = diffText(fromV.rawText, toV.rawText, req.query.mode);

  res.json({
    from: {
      id: fromV._id,
      label: fromV.label,
      versionNumber: fromV.versionNumber,
    },
    to: {
      id: toV._id,
      label: toV.label,
      versionNumber: toV.versionNumber,
    },
    parts,
    stats: summarize(parts),
  });
});