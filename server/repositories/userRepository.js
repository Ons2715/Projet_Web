import { pool } from "../config/db.js";

export async function listUsers() {
  const [rows] = await pool.query(
    `SELECT id, nom, email, role, telephone, date_creation
     FROM utilisateurs
     ORDER BY date_creation DESC`
  );

  return rows;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT id, nom, email, role, telephone, date_creation
     FROM utilisateurs
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}
