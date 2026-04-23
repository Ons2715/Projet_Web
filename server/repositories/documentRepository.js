import { pool } from "../config/db.js";

export async function listDocuments() {
  const [rows] = await pool.query(
    `SELECT d.id, d.type, d.fichier_url, d.date_upload,
            u.id AS eleve_id, u.nom AS eleve_nom
     FROM documents d
     JOIN utilisateurs u ON u.id = d.eleve_id
     ORDER BY d.date_upload DESC`
  );

  return rows;
}
