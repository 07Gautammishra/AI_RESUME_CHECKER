import { GoogleGenAI, Type } from "@google/genai";
import { ENV } from "../config/ENV.js";
import ApiError from "../utils/ApiError.js";
import { z } from "zod";

const ai = ENV.geminiApi ? new GoogleGenAI({ apiKey: ENV.geminiApi }) : null;

const responseSchema = {
  type: Type.OBJECT,
  required: [
    "atsScore",
    "scoreBreakdown",
    "issues",
    "strengths",
    "bulletRewrites",
    "keywordsPresent",
    "keywordsMissing",
    "summary"
  ],
  properties: {
    atsScore: {
      type: Type.NUMBER,
      description: "Overall ATS score from 0 to 100",
    },
    scoreBreakdown: {
      type: Type.OBJECT,
      required: ["keywords", "formatting", "impact", "clarity"],
      properties: {
        keywords: { type: Type.NUMBER, description: "Score from 0 to 25" },
        formatting: { type: Type.NUMBER, description: "Score from 0 to 25" },
        impact: { type: Type.NUMBER, description: "Score from 0 to 25" },
        clarity: { type: Type.NUMBER, description: "Score from 0 to 25" },
      },
    },
    issues: {
      type: Type.ARRAY,
      description: "Exactly 5 prioritized issues",
      items: {
        type: Type.OBJECT,
        required: ["title", "severity", "explanation", "fix"],
        properties: {
          title: { type: Type.STRING },
          severity: { 
            type: Type.STRING, 
            enum: ["low", "midium", "high"], 
          },
          explanation: { type: Type.STRING },
          fix: { type: Type.STRING },
        },
      },
    },
    strengths: {
      type: Type.ARRAY,
      description: "Exactly 5 strengths",
      items: {
        type: Type.OBJECT,
        required: ["title"],
        properties: {
          title: { type: Type.STRING },
          evidence: { type: Type.STRING },
        },
      },
    },
    bulletRewrites: {
      type: Type.ARRAY,
      description: "5-10 weak bullets rewritten to be stronger and ATS-friendly",
      items: {
        type: Type.OBJECT,
        required: ["section", "rationale", "original", "rewritten"],
        properties: {
          section: { type: Type.STRING },
          original: { type: Type.STRING },
          rewritten: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
      },
    },
    keywordsPresent: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of relevant keywords found in the resume",
    },
    keywordsMissing: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of important missing keywords",
    },
    summary: {
      type: Type.STRING,
      description: "Overall evaluation summary of the resume",
    },
  },
};

export const analysisValidator = z.object({
  atsScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywords: z.number().min(0).max(25),
    formatting: z.number().min(0).max(25),
    impact: z.number().min(0).max(25),
    clarity: z.number().min(0).max(25),
  }),
  issues: z.array(
    z.object({
      title: z.string(),
      severity: z.enum(["low", "midium", "high"]),
      explanation: z.string().default(""),
      fix: z.string().default(""),
    })
  ).default([]),
  strengths: z.array(
    z.object({
      title: z.string(),
      evidence: z.string().optional(),
    })
  ).default([]),
  bulletRewrites: z.array(
    z.object({
      section: z.string().default("General"),
      original: z.string(),
      rewritten: z.string(),
      rationale: z.string().default(""),
    })
  ).default([]),
  keywordsPresent: z.array(z.string()).default([]),
  keywordsMissing: z.array(z.string()).default([]),
  summary: z.string().default(""),
});

function buildPrompt({ rawText, targetRole }) {
  const roleContext = targetRole
    ? `Target role: ${targetRole}.`
    : "No specific target role was provided; assess for the role the candidate appears to be aiming for.";

  return [
    "You are a senior technical recruiter and ATS expert reviewing a resume.",
    roleContext,
    "Score the resume from 0 to 100 based on ATS readiness (keyword match, parseable formatting, quantified impact, and clarity).",
    "Return exactly 5 prioritized issues, 5 standout strengths, and 5 to 10 weak bullets rewritten to be stronger and quantified.",
    "Rewrites must preserve the original meaning. Each rewrite needs a one-line rationale.",
    "Identify keywords clearly present and notable keywords missing for the apparent target role.",
    "Be specific and evidence-based—cite phrasing from the resume in explanations.",
    "",
    "RESUME TEXT:",
    "----------",
    rawText,
    "----------",
  ].join("\n");
}

async function callGemini(prompt, modelName) {
  if (!ai) {
    throw new ApiError(500, "Gemini API key is missing in server environment config.");
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  const text = typeof response.text === "function" ? response.text() : response.text;
  if (!text) {
    throw new ApiError(500, "Received empty response from Gemini API.");
  }

  return {
    text,
    usage: response.usageMetadata || {}, // Fixed: usageMetadata is an object property
  };
}

const PARSER_MODELS = Array.from(
  new Set([ENV.geminiModel, "gemini-3.6-flash", "gemini-3.5-flash-lite"].filter(Boolean))
);

async function analyzeResume({ rawText, targetRole }) {
  if (!ai) {
    throw new ApiError(500, "Gemini API key is missing in server environment config.");
  }

  const prompt = buildPrompt({ rawText, targetRole });
  let lastErr;

  for (const modelName of PARSER_MODELS) {
    try {
      const { text, usage } = await callGemini(prompt, modelName);
      const parsed = JSON.parse(text);
      const validated = analysisValidator.parse(parsed);

      return {
        analysis: validated,
        model: modelName,
        promptTokens: usage.promptTokenCount || 0,
        responseTokens: usage.candidatesTokenCount || 0,
      };
    } catch (err) {
      console.warn(`Model ${modelName} failed resume analysis, trying next model. Error:`, err.message);
      lastErr = err;
    }
  }

  throw new ApiError(500, `Gemini analysis failed across all models: ${lastErr?.message || "unknown error"}`);
}

export { analyzeResume };