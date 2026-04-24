import { pool } from "../config/db.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, nom, email, mot_de_passe, role, telephone, adresse, date_creation
     FROM utilisateurs
     WHERE email = ?`,
    [email]
  );

  return rows[0] || null;
}

export async function createUser({ nom, email, motDePasse, role, telephone, adresse }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, telephone, adresse)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nom, email, motDePasse, role, telephone || null, adresse]
    );

    if (role === "eleve") {
      await connection.query(
        `INSERT INTO eleves (id, type_formation, date_inscription)
         VALUES (?, ?, CURDATE())`,
        [result.insertId, "Permis B"]
      );
    }

    if (role === "moniteur") {
      await connection.query(
        `INSERT INTO moniteurs (id, voiture)
         VALUES (?, ?)`,
        [result.insertId, "Kia Picanto"]
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
