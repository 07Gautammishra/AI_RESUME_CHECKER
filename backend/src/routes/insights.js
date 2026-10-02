import express from "express";
import AuthMiddleware from "../middleware/auth.js";
import { getInsightsData } from "../controllers/insights.controller.js";

const router = express.Router();

router.use(AuthMiddleware);
router.get("/", getInsightsData);

export default router;