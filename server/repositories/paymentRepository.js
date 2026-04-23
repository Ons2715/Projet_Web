import { pool } from "../config/db.js";

export async function listPayments() {
  const [rows] = await pool.query(
    `SELECT p.id, p.montant, p.methode, p.statut, p.date_paiement,
            u.id AS eleve_id, u.nom AS eleve_nom
     FROM paiements p
     JOIN utilisateurs u ON u.id = p.eleve_id
     ORDER BY p.date_paiement DESC`
  );

  return rows;
}
