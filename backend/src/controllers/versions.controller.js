import asyncHandler from "../utils/asyncHandler.js";
import Resume from "../models/Resume.js";
import ResumeVersion from "../models/ResumeVersion.js";
import Analysis from "../models/Analysis.js";

export const getVersionsData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch user resumes
  const resumes = await Resume.find({ userId }).lean();
  const resumeIds = resumes.map((r) => r._id);
  const resumesMap = new Map(resumes.map((r) => [r._id.toString(), r]));

  // 2. Fetch versions related to user's resumes
  const versions = await ResumeVersion.find({ resumeId: { $in: resumeIds } })
    .select(
      "_id resumeId label versionNumber sourceType createdAt latestAnalysisId parentVersionId"
    )
    .sort({ createdAt: -1 })
    .lean();

  // 3. Fetch linked analyses for ATS scores
  const analysisIds = versions
    .map((v) => v.latestAnalysisId)
    .filter(Boolean);

  const analyses = analysisIds.length
    ? await Analysis.find({ _id: { $in: analysisIds } })
        .select("_id atsScore versionId")
        .lean()
    : [];

  // Map scores by version ID string
  const scoreByVersion = new Map(
    analyses.map((a) => [a.versionId.toString(), a.atsScore])
  );

  // 4. Transform versions payload
  const items = versions.map((v) => {
    const resume = resumesMap.get(v.resumeId.toString());
    return {
      id: v._id,
      label: v.label,
      versionNumber: v.versionNumber,
      sourceType: v.sourceType,
      createdAt: v.createdAt,
      score: scoreByVersion.get(v._id.toString()) ?? null,
      resumeId: v.resumeId,
      resumeTitle: resume?.title || "Resume",
      parentVersionId: v.parentVersionId,
    };
  });

  // 5. Aggregate version counts
  const total = {
    all: items.length,
    uploads: items.filter((i) => i.sourceType === "upload").length,
    rewrites: items.filter((i) => i.sourceType === "rewrite").length,
  };

  // 6. Return response
  res.status(200).json({ versions: items, total });
});