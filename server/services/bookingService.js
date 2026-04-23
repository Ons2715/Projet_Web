import { listBookings } from "../repositories/bookingRepository.js";

export async function getBookings() {
  return listBookings();
}
