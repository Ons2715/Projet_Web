import { Router } from "express";
import { listAllStudents, listCurrentMonitorStudents, listMonitorStudents } from "../controllers/studentController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const studentRouter = Router();

studentRouter.get("/monitor/me", requireAuth, requireRole("moniteur"), asyncHandler(listCurrentMonitorStudents));
studentRouter.get("/monitor/:monitorId", asyncHandler(listMonitorStudents));
studentRouter.get("/", asyncHandler(listAllStudents));
