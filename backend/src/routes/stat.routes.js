import { Router } from "express";
import { getStats } from "../controllers/stat.controller.js";
import { protectRoute, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getStats);

export default router;
