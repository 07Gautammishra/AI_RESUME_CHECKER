import dotenv from "dotenv";
dotenv.config();

const req= ["MONGO_URL", "JWT_SECRET"];
const missing= req.filter((key)=> !process.env[key]);
if(missing.length){
    console.error(`Missing requied env var : ${missing.join(", ")}`)
    process.exit(1);
}

const ENV={
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET,
    cookieName: process.env.COOKIE_NAME || "arr_token",
    clientOrigins: (
        process.env.CLIENT_ORIGIN || "http://localhost:5173,http://localhost:5174"
    ).split(",").map((e)=>e.trim()).filter(Boolean),
    geminiApi: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
    isProd: (process.env.NODE_ENV || "development") === "production"
}
export {ENV};