import { addBookingForStudent, cancelBookingForUser, getBookings, getBookingsForUser } from "../services/bookingService.js";

export async function listAllBookings(req, res) {
  const bookings = await getBookings();
  res.json(bookings);
}

export async function listMyBookings(req, res) {
  const bookings = await getBookingsForUser(req.user);
  res.json(bookings);
}

export async function createCurrentStudentBooking(req, res) {
  const booking = await addBookingForStudent(req.user.id, req.body);
  res.status(201).json(booking);
}

export async function cancelBooking(req, res) {
  const booking = await cancelBookingForUser(req.user, req.params.id);
  res.json(booking);
}
