import { pool } from "../config/db.js";

export async function listMonitors() {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.email, u.telephone, u.adresse, u.photo_profil AS photo, m.voiture,
            f.nom AS formation_nom
     FROM moniteurs m
     JOIN utilisateurs u ON u.id = m.id
     LEFT JOIN formations f ON f.id = m.id_formation
     ORDER BY u.nom ASC`
  );

  return rows;
}

export async function findMonitorForStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT um.id, um.nom, um.email, um.telephone, um.adresse, um.photo_profil AS photo,
            m.voiture,
            f.nom AS formation_nom
     FROM eleves e
     JOIN moniteurs m ON m.id_formation = e.id_formation
     JOIN utilisateurs um ON um.id = m.id
     LEFT JOIN formations f ON f.id = m.id_formation
     WHERE e.id = ?
     ORDER BY um.nom ASC
     LIMIT 1`,
    [studentId]
  );

  return rows[0] || null;
}
