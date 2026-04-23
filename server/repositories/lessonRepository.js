import { pool } from "../config/db.js";

export async function listLessons() {
  const [rows] = await pool.query(
    `SELECT id, titre, description
     FROM quiz
     ORDER BY id ASC`
  );

  return rows;
}
