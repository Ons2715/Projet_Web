import mysql from "mysql2/promise";
import { env } from "./env.js";

export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10
});

export async function ensureDatabaseSchema() {
  const [columns] = await pool.query(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = 'utilisateurs'
       AND COLUMN_NAME = 'photo_profil'`,
    [env.dbName]
  );

  if (!columns.length) {
    await pool.query(
      `ALTER TABLE utilisateurs
       ADD COLUMN photo_profil LONGTEXT NULL AFTER adresse`
    );
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      eleve_id INT NOT NULL,
      moniteur_id INT NOT NULL,
      date_reservation DATETIME NOT NULL,
      duree_minutes INT NOT NULL DEFAULT 60,
      adresse_depart TEXT,
      statut ENUM('reservee', 'terminee', 'annulee') NOT NULL DEFAULT 'reservee',
      note_client TEXT,
      seance_id INT NULL,
      date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT chk_reservation_duree CHECK (duree_minutes > 0),
      CONSTRAINT fk_reservations_eleve FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_reservations_moniteur FOREIGN KEY (moniteur_id) REFERENCES moniteurs(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_reservations_seance FOREIGN KEY (seance_id) REFERENCES seances(id) ON DELETE SET NULL ON UPDATE CASCADE,
      UNIQUE KEY uniq_reservation_moniteur_creneau (moniteur_id, date_reservation),
      UNIQUE KEY uniq_reservation_eleve_creneau (eleve_id, date_reservation),
      UNIQUE KEY uniq_reservation_seance (seance_id)
    )
  `);
}
