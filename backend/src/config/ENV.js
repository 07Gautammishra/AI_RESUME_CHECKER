import dotenv from "dotenv";
dotenv.config();

const required = ["MONGO_URL", "JWT_SECRET", "GEMINI_API_KEY"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required env var: ${missing.join(", ")}`);
  process.exit(1);
}

const ENV = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  cookieName: process.env.COOKIE_NAME || "arr_token",
  clientOrigins: process.env.FRONTEND_URL || "https://resume-roaster-2vg6.onrender.com",
  geminiApi: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  isProd: (process.env.NODE_ENV || "development") === "production",
};

export { ENV };
