import express from "express";
import mongoose from "mongoose";


const router = express.Router();
router.get("/", (req, res) => {
    const status = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
        status: "ok",
        db: status[mongoose.connection.readyState] || "unknown",
        timestamp: new Date().toISOString(),
    })
})

export default router;