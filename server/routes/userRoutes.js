import { Router } from "express";
import { createUser, deleteUser, getOneUser, listAllUsers } from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRouter = Router();

userRouter.get("/", asyncHandler(listAllUsers));
userRouter.post("/", requireAuth, requireRole("admin"), asyncHandler(createUser));
userRouter.delete("/:id", requireAuth, requireRole("admin"), asyncHandler(deleteUser));
userRouter.get("/:id", asyncHandler(getOneUser));
