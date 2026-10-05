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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ENV.clientOrigins, 
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback for testing; restrict to allowedOrigins in production
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

if (ENV.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use("/api/health", healthRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/versions", versionRouter);
app.use("/api/history", historyRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || ENV.port || 5000;

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
