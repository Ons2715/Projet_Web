import { Router } from "express";
import { getCurrentStudentMonitor, listAllMonitors } from "../controllers/monitorController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const monitorRouter = Router();

monitorRouter.get("/me/assigned", requireAuth, requireRole("eleve"), asyncHandler(getCurrentStudentMonitor));
monitorRouter.get("/", asyncHandler(listAllMonitors));
