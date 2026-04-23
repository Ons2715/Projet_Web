import { getDocuments } from "../services/documentService.js";

export async function listAllDocuments(req, res) {
  const documents = await getDocuments();
  res.json(documents);
}
