import express from "express";
import AuthMiddleware from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(AuthMiddleware);
router.get("/", getDashboardData);

export default router;