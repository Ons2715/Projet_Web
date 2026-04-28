import {
  createReclamation,
  findReclamationById,
  findReclamationWithUserById,
  listReclamations,
  updateReclamationStatus
} from "../repositories/reclamationRepository.js";
import { sendReclamationProcessingEmail } from "./mailService.js";

const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;

export async function getReclamations() {
  return listReclamations();
}

export async function addReclamation(payload) {
  const raison = String(payload.raison || "").trim();
  const pieceData = String(payload.pieceData || "").trim();

  if (!raison) {
    const error = new Error("Veuillez saisir la raison de la reclamation.");
    error.status = 400;
    throw error;
  }

  if (pieceData && Buffer.byteLength(pieceData, "utf8") > MAX_ATTACHMENT_SIZE * 1.4) {
    const error = new Error("La piece jointe ne doit pas depasser 2 Mo.");
    error.status = 400;
    throw error;
  }

  const reclamationId = await createReclamation({
    utilisateurId: payload.utilisateurId,
    reservationRef: payload.reservationRef,
    raison,
    pieceNom: payload.pieceNom,
    pieceType: payload.pieceType,
    pieceData
  });

  return findReclamationById(reclamationId);
}

export async function treatReclamation(id) {
  const reclamation = await findReclamationWithUserById(id);

  if (!reclamation) {
    const error = new Error("Reclamation introuvable.");
    error.status = 404;
    throw error;
  }

  const updatedReclamation = await updateReclamationStatus(id, "traitee");

  if (updatedReclamation?.utilisateur_email) {
    await sendReclamationProcessingEmail({
      email: updatedReclamation.utilisateur_email,
      nom: updatedReclamation.utilisateur_nom,
      reservationRef: updatedReclamation.reservation_ref
    });
  }

  return updatedReclamation;
}
