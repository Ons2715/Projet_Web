import { Router } from "express";
import { getOneUser, listAllUsers } from "../controllers/userController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRouter = Router();

userRouter.get("/", asyncHandler(listAllUsers));
userRouter.get("/:id", asyncHandler(getOneUser));
