import { addBookingForStudent, getBookings } from "../services/bookingService.js";

export async function listAllBookings(req, res) {
  const bookings = await getBookings();
  res.json(bookings);
}

export async function createCurrentStudentBooking(req, res) {
  const booking = await addBookingForStudent(req.user.id, req.body);
  res.status(201).json(booking);
}
