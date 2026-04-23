import { pool } from "../config/db.js";

export async function listQuiz() {
  const [rows] = await pool.query(
    `SELECT q.id, q.titre, q.description, COUNT(qq.id) AS total_questions
     FROM quiz q
     LEFT JOIN questions qq ON qq.quiz_id = q.id
     GROUP BY q.id, q.titre, q.description
     ORDER BY q.id ASC`
  );

  return rows;
}
