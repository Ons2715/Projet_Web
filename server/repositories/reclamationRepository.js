import { pool } from "../config/db.js";

export async function listReclamations() {
  const [rows] = await pool.query(
    `SELECT r.id, r.utilisateur_id, r.reservation_ref, r.raison, r.piece_nom,
            r.piece_type, r.piece_data, r.statut, r.date_creation, u.nom AS utilisateur_nom,
            u.email AS utilisateur_email, u.telephone AS utilisateur_telephone,
            u.role AS utilisateur_role,
            CASE
              WHEN e.id_formation = 2 THEN (
                SELECT um.nom
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.voiture = 'Kia Picanto'
                LIMIT 1
              )
              WHEN e.id_formation = 1 OR e.id_formation IS NULL THEN (
                SELECT um.nom
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.voiture = 'Renault Clio'
                LIMIT 1
              )
              ELSE (
                SELECT um.nom
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.id_formation = e.id_formation
                LIMIT 1
              )
            END AS moniteur_nom,
            CASE
              WHEN e.id_formation = 2 THEN (
                SELECT um.telephone
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.voiture = 'Kia Picanto'
                LIMIT 1
              )
              WHEN e.id_formation = 1 OR e.id_formation IS NULL THEN (
                SELECT um.telephone
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.voiture = 'Renault Clio'
                LIMIT 1
              )
              ELSE (
                SELECT um.telephone
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.id_formation = e.id_formation
                LIMIT 1
              )
            END AS moniteur_telephone
     FROM reclamations r
     LEFT JOIN utilisateurs u ON u.id = r.utilisateur_id
     LEFT JOIN eleves e ON e.id = u.id
     ORDER BY r.date_creation DESC`
  );

  return rows;
}

export async function createReclamation({ utilisateurId, reservationRef, raison, pieceNom, pieceType, pieceData }) {
  const [result] = await pool.query(
    `INSERT INTO reclamations (utilisateur_id, reservation_ref, raison, piece_nom, piece_type, piece_data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [utilisateurId || null, reservationRef || null, raison, pieceNom || null, pieceType || null, pieceData || null]
  );

  return result.insertId;
}

export async function findReclamationById(id) {
  const [rows] = await pool.query(
    `SELECT id, utilisateur_id, reservation_ref, raison, piece_nom, piece_type,
            piece_data, statut, date_creation
     FROM reclamations
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

export async function findReclamationWithUserById(id) {
  const [rows] = await pool.query(
    `SELECT r.id, r.utilisateur_id, r.reservation_ref, r.raison, r.piece_nom,
            r.piece_type, r.piece_data, r.statut, r.date_creation,
            u.nom AS utilisateur_nom, u.email AS utilisateur_email,
            u.telephone AS utilisateur_telephone
     FROM reclamations r
     LEFT JOIN utilisateurs u ON u.id = r.utilisateur_id
     WHERE r.id = ?`,
    [id]
  );

  return rows[0] || null;
}

export async function updateReclamationStatus(id, statut) {
  await pool.query(
    `UPDATE reclamations
     SET statut = ?
     WHERE id = ?`,
    [statut, id]
  );

  return findReclamationWithUserById(id);
}
