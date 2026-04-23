import { Router } from "express";
import { listAllLessons } from "../controllers/lessonController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const lessonRouter = Router();

lessonRouter.get("/", asyncHandler(listAllLessons));
