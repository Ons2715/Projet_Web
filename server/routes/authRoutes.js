import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/register", asyncHandler(register));
