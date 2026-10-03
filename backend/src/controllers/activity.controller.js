import asyncHandler from "../utils/asyncHandler.js";
import Resume from "../models/Resume.js";
import ResumeVersion from "../models/ResumeVersion.js";
import Analysis from "../models/Analysis.js";

export const getActivityData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch user resumes
  const resumes = await Resume.find({ userId }).lean();
  const resumeIds = resumes.map((r) => r._id);
  const resumeMap = new Map(resumes.map((r) => [r._id.toString(), r]));

  // 2. Fetch versions and analyses in parallel
  const [versions, analyses] = await Promise.all([
    ResumeVersion.find({ resumeId: { $in: resumeIds } })
      .select("_id resumeId label versionNumber sourceType createdAt")
      .lean(),
    Analysis.find({ userId })
      .select("_id resumeId versionId atsScore createdAt")
      .lean(),
  ]);

  const events = [];

  // 3. Map Upload Events
  for (const r of resumes) {
    events.push({
      id: `r-${r._id}`,
      type: "upload",
      title: `${r.title} uploaded`,
      subtitle: `Parsed and version v1 created`,
      label: `V1`,
      at: r.createdAt,
      resumeId: r._id,
      resumeTitle: r.title,
    });
  }

  // 4. Map Rewrite Events
  for (const v of versions) {
    if (v.sourceType !== "rewrite") continue;
    const r = resumeMap.get(v.resumeId.toString());
    events.push({
      id: `v-${v._id}`,
      type: "rewrite",
      title: `${v.label} created for ${r?.title || "resume"}`,
      subtitle: `Rewrites applied`,
      label: `${v.label} created`,
      at: v.createdAt,
      resumeId: v.resumeId,
      resumeTitle: r?.title || "Resume",
    });
  }

  // 5. Map Analysis Events
  for (const a of analyses) {
    const r = resumeMap.get(a.resumeId?.toString());
    events.push({
      id: `a-${a._id}`,
      type: "analyze",
      title: `Analysis complete on ${r?.title || "resume"}`,
      subtitle: `ATS score is ${a.atsScore} / 100`,
      label: `${a.atsScore}`,
      at: a.createdAt,
      resumeId: a.resumeId,
      resumeTitle: r?.title || "Resume",
    });
  }

  // 6. Sort by most recent
  events.sort((a, b) => new Date(b.at) - new Date(a.at));

  // 7. Aggregate Totals
  const totals = {
    all: events.length,
    upload: events.filter((e) => e.type === "upload").length,
    rewrite: events.filter((e) => e.type === "rewrite").length,
    analyze: events.filter((e) => e.type === "analyze").length,
  };

  // 8. Return response
  res.status(200).json({ events, totals });
});