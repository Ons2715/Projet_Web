import { Router } from "express";
import { listAllBookings } from "../controllers/bookingController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookingRouter = Router();

bookingRouter.get("/", asyncHandler(listAllBookings));
