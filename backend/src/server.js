import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import morgan from "morgan";
import healthRouter from "./routes/health.js";
import connectDB from "./config/dpconfig.js";
import { errorHandler, notFound } from "./middleware/errorHandle.js";
import { ENV } from "./config/ENV.js";
import AuthRouter from "./routes/auth.router.js";
import resumeRouter from "./routes/resumes.js"
const app= express();
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({extended: true, limit: "5mb"}));
app.use(cookieParser());

if(ENV.nodeEnv === "development"){
    app.use(morgan("dev"));
}

app.use("/api/health", healthRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/resumes", resumeRouter);

app.use(notFound);
app.use(errorHandler);
const startServer = async () => {
    try{
        await connectDB();
        app.listen(ENV.port, async() => {
            console.log(`Server is running on http://localhost:${ENV.port}`);
        });
    }
    catch(err){
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Optionally, you can exit the process or perform other actions here
});
startServer();

export default app;