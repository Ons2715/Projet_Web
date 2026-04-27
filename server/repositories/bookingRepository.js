import { pool } from "../config/db.js";

const BOOKING_SELECT = `
  SELECT s.id, s.date_lecon,
         DATE_FORMAT(s.date_lecon, '%Y-%m-%d') AS date,
         DATE_FORMAT(s.date_lecon, '%H:%i') AS time,
         s.duree_minutes,
         s.adresse_depart, s.statut, s.notes_moniteur,
         e.id AS eleve_id, ue.nom AS eleve_nom, ue.email AS eleve_email, ue.telephone AS eleve_telephone,
         m.id AS moniteur_id, um.nom AS moniteur_nom, um.telephone AS moniteur_telephone
  FROM seances s
  JOIN eleves e ON e.id = s.eleve_id
  JOIN utilisateurs ue ON ue.id = e.id
  JOIN moniteurs m ON m.id = s.moniteur_id
  JOIN utilisateurs um ON um.id = m.id
`;

export async function listBookings() {
  const [rows] = await pool.query(`${BOOKING_SELECT} ORDER BY s.date_lecon ASC`);
  return rows;
}

export async function findAssignedMonitorIdForStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT m.id
     FROM eleves e
     JOIN moniteurs m ON m.id_formation = e.id_formation
     WHERE e.id = ?
     ORDER BY m.id ASC
     LIMIT 1`,
    [studentId]
  );

  return rows[0]?.id || null;
}

export async function createBooking({ eleveId, moniteurId, dateLecon, dureeMinutes, adresseDepart, notesMoniteur }) {
  const [result] = await pool.query(
    `INSERT INTO seances (eleve_id, moniteur_id, date_lecon, duree_minutes, adresse_depart, notes_moniteur)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [eleveId, moniteurId, dateLecon, dureeMinutes, adresseDepart, notesMoniteur]
  );

  const [rows] = await pool.query(`${BOOKING_SELECT} WHERE s.id = ?`, [result.insertId]);
  return rows[0] || null;
}
