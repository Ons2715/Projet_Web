import { pool } from "../config/db.js";

export async function listMonitors() {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.email, u.telephone, m.voiture
     FROM moniteurs m
     JOIN utilisateurs u ON u.id = m.id
     ORDER BY u.nom ASC`
  );

  return rows;
}
