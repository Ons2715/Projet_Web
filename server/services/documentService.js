import { listDocuments } from "../repositories/documentRepository.js";

export async function getDocuments() {
  return listDocuments();
}
