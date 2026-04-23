import { Router } from "express";
import { listAllQuiz } from "../controllers/quizController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const quizRouter = Router();

quizRouter.get("/", asyncHandler(listAllQuiz));
