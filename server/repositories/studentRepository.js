import { pool } from "../config/db.js";

export async function listStudents() {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.email, u.telephone, u.photo_profil AS photo,
            f.nom AS type_formation, f.heures_totales,
            e.heures_effectuees,
            e.date_inscription
     FROM eleves e
     JOIN utilisateurs u ON u.id = e.id
     LEFT JOIN formations f ON f.id = e.id_formation
     ORDER BY e.date_inscription DESC`
  );

  return rows;
}

export async function listStudentsByMonitor(monitorId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT u.id, u.nom, u.email, u.telephone, u.photo_profil AS photo,
            f.nom AS formation_nom, f.heures_totales,
            e.heures_effectuees, e.date_inscription
     FROM moniteurs m
     JOIN eleves e ON e.id_formation = m.id_formation
        OR EXISTS (
          SELECT 1
          FROM seances s
          WHERE s.moniteur_id = m.id
            AND s.eleve_id = e.id
        )
     JOIN utilisateurs u ON u.id = e.id
     LEFT JOIN formations f ON f.id = e.id_formation
     WHERE m.id = ?
     ORDER BY u.nom ASC`,
    [monitorId]
  );

  return rows;
}
