import { Router } from "express";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/register", asyncHandler(register));
authRouter.get("/me", requireAuth, asyncHandler(me));
