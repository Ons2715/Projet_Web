import { Router } from "express";
import { cancelBooking, createCurrentStudentBooking, listAllBookings, listMyBookings } from "../controllers/bookingController.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const bookingRouter = Router();

bookingRouter.get("/", asyncHandler(listAllBookings));
bookingRouter.get("/me", requireAuth, asyncHandler(listMyBookings));
bookingRouter.post("/", requireAuth, requireRole("eleve"), asyncHandler(createCurrentStudentBooking));
bookingRouter.delete("/:id", requireAuth, asyncHandler(cancelBooking));
