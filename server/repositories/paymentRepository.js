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

export async function findPaymentsByEleve(eleveId) {
  const [rows] = await pool.query(
    `SELECT id, eleve_id, montant, statut, methode, date_paiement
     FROM paiements
     WHERE eleve_id = ?
     ORDER BY date_paiement DESC`,
    [eleveId]
  );
  return rows;
}

export async function findPaymentById(id) {
  const [rows] = await pool.query(
    `SELECT id, eleve_id, montant, statut, methode, date_paiement
     FROM paiements
     WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

export async function createPayment({ eleveId, montant, methode }) {
  const [result] = await pool.query(
    `INSERT INTO paiements (eleve_id, montant, methode, statut)
     VALUES (?, ?, ?, 'en_attente')`,
    [eleveId, montant, methode]
  );
  return result.insertId;
}

export async function updatePaymentStatut(id, statut) {
  await pool.query(
    `UPDATE paiements SET statut = ? WHERE id = ?`,
    [statut, id]
  );
}
.