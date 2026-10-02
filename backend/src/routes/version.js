import express from "express";
import AuthMiddleware from "../middleware/auth.js";
import { getVersionsData } from "../controllers/versions.controller.js";

const router = express.Router();

router.use(AuthMiddleware);
router.get("/", getVersionsData);

export default router;