import express from "express";
import AuthMiddleware from "../middleware/auth.js";
import { getActivityData } from "../controllers/activity.controller.js";

const router = express.Router();

router.use(AuthMiddleware);
router.get("/", getActivityData);

export default router;