import express from "express";

import AuthMiddleware from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import uploadPdf from "../middleware/upload.js";
import { analyzeLimiter } from "../middleware/rateLimit.js";

import {
  idParamSchema,
  versionParamSchema,
  analysisBodySchema,
  rewriteBodySchema,
  diffQuerySchema,
  createResume,
  getAllResumes,
  getResumeById,
  getResumeVersion,
  deleteResume,
  analyzeResumeVersion,
  getVersionAnalysis,
  getAllAnalyses,
  applyRewrites,
  getDiffBetweenVersions,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.use(AuthMiddleware);

// Resume CRUD & Versions
router.route("/")
  .post(uploadPdf("file"), createResume)
  .get(getAllResumes);

router.route("/:id")
  .get(validate(idParamSchema, "params"), getResumeById)
  .delete(validate(idParamSchema, "params"), deleteResume);

router.get(
  "/:id/version/:versionId",
  validate(versionParamSchema, "params"),
  getResumeVersion
);

// Analyses & AI Processing
router.post(
  "/:id/analyze",
  analyzeLimiter,
  validate(idParamSchema, "params"),
  validate(analysisBodySchema, "body"),
  analyzeResumeVersion
);

router.get(
  "/:id/versions/:versionId/analysis",
  validate(versionParamSchema, "params"),
  getVersionAnalysis
);

router.get(
  "/:id/analyses",
  validate(idParamSchema, "params"),
  getAllAnalyses
);

// Rewrites & Diffing
router.post(
  "/:id/rewrite",
  validate(idParamSchema, "params"),
  validate(rewriteBodySchema, "body"),
  applyRewrites
);

router.get(
  "/:id/diff",
  validate(idParamSchema, "params"),
  validate(diffQuerySchema, "query"),
  getDiffBetweenVersions
);

export default router;