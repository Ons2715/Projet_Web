import { pool } from "../config/db.js";

export async function listBookings() {
  const [rows] = await pool.query(
    `SELECT s.id, s.date_lecon, s.duree_minutes,
            s.adresse_depart, s.statut, s.notes_moniteur,
            e.id AS eleve_id, ue.nom AS eleve_nom, ue.email AS eleve_email, ue.telephone AS eleve_telephone,
            m.id AS moniteur_id, um.nom AS moniteur_nom
     FROM seances s
     JOIN eleves e ON e.id = s.eleve_id
     JOIN utilisateurs ue ON ue.id = e.id
     JOIN moniteurs m ON m.id = s.moniteur_id
     JOIN utilisateurs um ON um.id = m.id
     ORDER BY s.date_lecon ASC`
  );

  return rows;
}
