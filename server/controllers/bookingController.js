import { getBookings } from "../services/bookingService.js";

export async function listAllBookings(req, res) {
  const bookings = await getBookings();
  res.json(bookings);
}
