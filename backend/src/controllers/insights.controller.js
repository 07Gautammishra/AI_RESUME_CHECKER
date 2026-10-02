import asyncHandler from "../utils/asyncHandler.js";
import Resume from "../models/Resume.js";
import Analysis from "../models/Analysis.js";

function top(items, getKey, n = 8) {
  const counts = new Map();
  const extra = new Map();

  for (let item of items) {
    const key = getKey(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
    if (!extra.has(key)) extra.set(key, item);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({
      key,
      count,
      sample: extra.get(key),
    }));
}

/**
 * @desc    Get detailed analysis insights, trends, and aggregate issues
 * @route   GET /api/insights
 * @access  Private
 */
export const getInsightsData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch user resumes & analyses
  const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }).lean();
  const resumesMap = new Map(resumes.map((r) => [r._id.toString(), r]));
  const analyses = await Analysis.find({ userId }).sort({ createdAt: 1 }).lean();

  // 2. Handle empty state
  if (!analyses.length) {
    return res.json({
      empty: true,
      totalAnalyses: 0,
      resumes: resumes.map((r) => ({
        _id: r._id,
        title: r.title,
        latestVersionNumber: r.latestVersionNumber,
      })),
    });
  }

  // 3. Overall performance stats
  const totalScore = analyses.reduce((s, a) => s + (a.atsScore || 0), 0);
  const avgScore = Math.round(totalScore / analyses.length);
  const bestEntry = analyses.reduce((b, a) => (a.atsScore > b.atsScore ? a : b));
  const bestResume = resumesMap.get(bestEntry.resumeId?.toString());

  // 4. Score trends
  const scoreTrend = analyses.map((a) => ({
    at: a.createdAt,
    score: a.atsScore,
    resumeId: a.resumeId,
    resumeTitle: resumesMap.get(a.resumeId?.toString())?.title || "Resume",
  }));

  // 5. Aggregate top issues
  const allIssues = analyses.flatMap((a) => a.issues || []);
  const topIssues = top(
    allIssues,
    (i) => i.title?.trim().toLowerCase(),
    6
  ).map((r) => ({
    title: r.sample?.title || r.key,
    count: r.count,
    severity: r.sample?.severity || "medium",
  }));

  // 6. Aggregate keywords
  const allMissing = analyses.flatMap((a) => a.keywordsMissing || []);
  const allPresent = analyses.flatMap((a) => a.keywordsPresent || []);

  const topMissing = top(
    allMissing,
    (k) => k?.toString().toLowerCase(),
    12
  ).map((k) => ({
    keyword: k.sample,
    count: k.count,
  }));

  const topPresent = top(
    allPresent,
    (k) => k?.toString().toLowerCase(),
    12
  ).map((k) => ({
    keyword: k.sample,
    count: k.count,
  }));

  // 7. Per-resume performance summary
  const resumePerformance = resumes
    .map((r) => {
      const ras = analyses.filter(
        (a) => a.resumeId?.toString() === r._id.toString()
      );
      if (!ras.length) return null;

      const latest = ras[ras.length - 1];
      const first = ras[0];

      return {
        resumeId: r._id,
        title: r.title,
        analysesCount: ras.length,
        latestScore: latest.atsScore,
        improvement: latest.atsScore - first.atsScore,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.latestScore - a.latestScore);

  // 8. Return response
  res.status(200).json({
    empty: false,
    totalAnalyses: analyses.length,
    averageScore: avgScore,
    bestScore: {
      value: bestEntry.atsScore,
      resumeId: bestEntry.resumeId,
      resumeTitle: bestResume?.title || "Resume",
      at: bestEntry.createdAt,
    },
    scoreTrend,
    topIssues,
    topMissingKeywords: topMissing,
    topPresentKeywords: topPresent,
    resumePerformance,
  });
});