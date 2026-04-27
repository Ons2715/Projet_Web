import { pool } from "../config/db.js";

export async function listUsers() {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.email, u.role, u.telephone, u.photo_profil AS photo, u.date_creation,
            m.voiture, m.id_formation,
            f.nom AS formation_nom,
            f.heures_totales,
            e.heures_effectuees,
            CASE
              WHEN u.role = 'eleve' AND e.id_formation = 2 THEN (
                SELECT um.nom
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.voiture = 'Kia Picanto'
                LIMIT 1
              )
              WHEN u.role = 'eleve' AND (e.id_formation = 1 OR e.id_formation IS NULL) THEN (
                SELECT um.nom
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.voiture = 'Renault Clio'
                LIMIT 1
              )
              WHEN u.role = 'eleve' THEN (
                SELECT um.nom
                FROM moniteurs m
                JOIN utilisateurs um ON um.id = m.id
                WHERE m.id_formation = e.id_formation
                LIMIT 1
              )
              ELSE NULL
            END AS encadre_par
            ,
            CASE
              WHEN u.role = 'moniteur' THEN m.voiture
              WHEN u.role = 'eleve' AND e.id_formation = 2 THEN 'Kia Picanto'
              WHEN u.role = 'eleve' AND (e.id_formation = 1 OR e.id_formation IS NULL) THEN 'Renault Clio'
              ELSE NULL
            END AS voiture_affectee
     FROM utilisateurs u
     LEFT JOIN eleves e ON e.id = u.id
     LEFT JOIN moniteurs m ON m.id = u.id
     LEFT JOIN formations f ON f.id = e.id_formation
     ORDER BY u.date_creation DESC`
  );

  return rows;
}

export async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT u.id, u.nom, u.email, u.role, u.telephone, u.adresse, u.photo_profil AS photo, u.date_creation,
            f.nom AS formation_nom,
            f.heures_totales,
            e.heures_effectuees
     FROM utilisateurs u
     LEFT JOIN eleves e ON e.id = u.id
     LEFT JOIN formations f ON f.id = e.id_formation
     WHERE u.id = ?`,
    [id]
  );

  return rows[0] || null;
}

export async function deleteUserById(id) {
  const [result] = await pool.query(
    `DELETE FROM utilisateurs
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}

export async function updateStudentFormation(userId, formationId) {
  const [result] = await pool.query(
    `UPDATE eleves
     SET id_formation = ?
     WHERE id = ?`,
    [formationId, userId]
  );

  return result.affectedRows > 0;
}

export async function updateUserPhotoById(userId, photo) {
  const [result] = await pool.query(
    `UPDATE utilisateurs
     SET photo_profil = ?
     WHERE id = ?`,
    [photo, userId]
  );

  return result.affectedRows > 0;
}

function getFormationId({ role, voiture, formationId }) {
  if (formationId) {
    return Number(formationId);
  }

  if (role === "moniteur") {
    if (voiture === "Kia Picanto") return 2;
    if (voiture === "Renault Clio") return 1;
  }

  return 1;
}

export async function createUserProfile({ nom, email, motDePasse, role, telephone, adresse, voiture, formationId }) {
  const connection = await pool.getConnection();
  const resolvedFormationId = getFormationId({ role, voiture, formationId });

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, telephone, adresse)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, email, motDePasse, role, telephone, adresse]
    );

    if (role === "eleve") {
      await connection.query(
        `INSERT INTO eleves (id, id_formation, date_inscription)
         VALUES (?, ?, CURDATE())`,
        [result.insertId, resolvedFormationId]
      );
    }

    if (role === "moniteur") {
      await connection.query(
        `INSERT INTO moniteurs (id, id_formation, voiture)
         VALUES (?, ?, ?)`,
        [result.insertId, resolvedFormationId, voiture || "Kia Picanto"]
      );
    }

    await connection.commit();
    return result.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
