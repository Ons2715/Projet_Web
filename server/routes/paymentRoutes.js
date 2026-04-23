import { Router } from "express";
import { listAllPayments } from "../controllers/paymentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const paymentRouter = Router();

paymentRouter.get("/", asyncHandler(listAllPayments));
