import { addReclamation, getReclamations, treatReclamation } from "../services/reclamationService.js";

export async function listAllReclamations(req, res) {
  const reclamations = await getReclamations();
  res.json(reclamations);
}

export async function createOneReclamation(req, res) {
  const reclamation = await addReclamation({
    ...req.body,
    utilisateurId: req.body.utilisateurId || req.user?.id
  });
  res.status(201).json(reclamation);
}

export async function treatOneReclamation(req, res) {
  const reclamation = await treatReclamation(req.params.id);
  res.json(reclamation);
}
