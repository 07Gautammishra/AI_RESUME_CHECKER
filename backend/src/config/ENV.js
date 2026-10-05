import dotenv from "dotenv";
dotenv.config();

const required = ["MONGO_URL", "JWT_SECRET", "GEMINI_API_KEY"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required env var: ${missing.join(", ")}`);
  process.exit(1);
}

// Clean and parse origins (supports single URL, comma-separated URLs, and strips trailing slashes)
const rawOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const parsedOrigins = rawOrigins
  .split(",")
  .map((url) => url.trim().replace(/\/$/, "")); // Strip trailing slashes

const ENV = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  cookieName: process.env.COOKIE_NAME || "arr_token",
  clientOrigins: parsedOrigins,
  CLIENT_URL: parsedOrigins,
  geminiApi: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  isProd: (process.env.NODE_ENV || "development") === "production",
};

export { ENV };
