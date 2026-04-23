import { Router } from "express";
import { listAllStudents } from "../controllers/studentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const studentRouter = Router();

studentRouter.get("/", asyncHandler(listAllStudents));
