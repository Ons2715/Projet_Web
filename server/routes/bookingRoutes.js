import { Router } from "express";
import { createCurrentStudentBooking, listAllBookings } from "../controllers/bookingController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookingRouter = Router();

bookingRouter.get("/", asyncHandler(listAllBookings));
bookingRouter.post("/", requireAuth, requireRole("eleve"), asyncHandler(createCurrentStudentBooking));
