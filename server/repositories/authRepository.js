import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, nom, email, mot_de_passe, role, telephone, date_creation
     FROM utilisateurs
     WHERE email = ?`,
    [email]
  );

  return rows[0] || null;
}

export async function createUser({ nom, email, motDePasse, role, telephone }) {
  const [result] = await pool.query(
    `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, telephone)
     VALUES (?, ?, ?, ?, ?)`,
    [nom, email, motDePasse, role, telephone || null]
  );

  return result.insertId;
}
