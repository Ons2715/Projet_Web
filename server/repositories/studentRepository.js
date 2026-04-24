import { pool } from "../config/db.js";

export async function listStudents() {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.email, u.telephone, e.type_formation, e.date_inscription
     FROM eleves e
     JOIN utilisateurs u ON u.id = e.id
     ORDER BY e.date_inscription DESC`
  );

  return rows;
}
