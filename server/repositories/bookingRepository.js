import { pool } from "../config/db.js";

export async function listBookings() {
  const [rows] = await pool.query(
    `SELECT l.id, l.date_Leçon AS date_lecon, l.statut,
            e.id AS eleve_id, ue.nom AS eleve_nom,
            m.id AS moniteur_id, um.nom AS moniteur_nom
     FROM Leçons l
     JOIN eleves e ON e.id = l.eleve_id
     JOIN utilisateurs ue ON ue.id = e.id
     JOIN moniteurs m ON m.id = l.moniteur_id
     JOIN utilisateurs um ON um.id = m.id
     ORDER BY l.date_Leçon ASC`
  );

  return rows;
}
