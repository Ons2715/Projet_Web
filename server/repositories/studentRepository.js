import { pool } from "../config/db.js";

export async function listStudents(monitorId) {
  if (monitorId) {
    const [rows] = await pool.query(
      `SELECT u.id,
              u.nom,
              u.email,
              u.telephone,
              NULL AS type_formation,
              DATE(u.date_creation) AS date_inscription,
              COUNT(s.id) AS booking_count,
              MAX(s.date_lecon) AS last_lesson_date
       FROM utilisateurs u
       JOIN seances s ON s.eleve_id = u.id
       WHERE u.role = 'eleve' AND s.moniteur_id = ?
       GROUP BY u.id, u.nom, u.email, u.telephone, u.date_creation
       ORDER BY last_lesson_date DESC, u.date_creation DESC`,
      [monitorId]
    );
    return rows;
  }

  const [rows] = await pool.query(
    `SELECT u.id,
            u.nom,
            u.email,
            u.telephone,
            NULL AS type_formation,
            DATE(u.date_creation) AS date_inscription,
            COUNT(s.id) AS booking_count,
            MAX(s.date_lecon) AS last_lesson_date
     FROM utilisateurs u
     LEFT JOIN seances s ON s.eleve_id = u.id
     WHERE u.role = 'eleve'
     GROUP BY u.id, u.nom, u.email, u.telephone, u.date_creation
     ORDER BY u.date_creation DESC`
  );

  return rows;
}
