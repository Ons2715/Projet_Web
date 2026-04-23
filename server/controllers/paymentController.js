import { getPayments } from "../services/paymentService.js";

export async function listAllPayments(req, res) {
  const payments = await getPayments();
  res.json(payments);
}
