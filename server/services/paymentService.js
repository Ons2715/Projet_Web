import { listPayments } from "../repositories/paymentRepository.js";

export async function getPayments() {
  return listPayments();
}
