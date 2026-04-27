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
}
