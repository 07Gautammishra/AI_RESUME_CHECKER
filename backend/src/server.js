import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import healthRouter from "./routes/health.js";
import connectDB from "./config/dpconfig.js";
import { errorHandler, notFound } from "./middleware/errorHandle.js";
import { ENV } from "./config/ENV.js";
import AuthRouter from "./routes/auth.router.js";
import resumeRouter from "./routes/resumes.js";
import dashboardRouter from "./routes/dashboard.js";
import insightsRouter from "./routes/insights.js";
import versionRouter from "./routes/version.js";
import historyRouter from "./routes/history.js";

const app = express();

// 1. TRUST PROXY MUST BE FIRST (Before CORS & Cookie Parser)
app.set("trust proxy", 1);

// 2. DYNAMIC CORS CONFIGURATION
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
      if (!origin || ENV.clientOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access for origin: ${origin}`));
      }
    },
    credentials: true, // Required for HTTP-only cross-origin cookies
  })
);

// 3. BODY PARSERS & COOKIES
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

if (ENV.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// 4. API ROUTES
app.use("/api/health", healthRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/versions", versionRouter);
app.use("/api/history", historyRouter);

// 5. ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

const PORT = ENV.port;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

startServer();

export default app;
