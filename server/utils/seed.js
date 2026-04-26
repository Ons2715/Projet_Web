/**
 * Database Seeding
 * Run this to populate the database with initial data
 * 
 * Usage: node --watch utils/seed.js
 */

import { pool } from "../config/db.js";
import { hashPassword } from "./password.js";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Create default formations (if not exists)
    const formations = [
      { nom: "Permis B", description: "Permis de conduire voiture" },
      { nom: "Permis C", description: "Permis de conduire camion" },
      { nom: "Permis D", description: "Permis de conduire autobus" }
    ];

    for (const formation of formations) {
      await pool.query(
        `INSERT IGNORE INTO formations (nom, description) VALUES (?, ?)`,
        [formation.nom, formation.description]
      );
    }
    console.log("✅ Formations created");

    // Create default admin user (if not exists)
    const adminEmail = "admin@educar.local";
    const [existingAdmin] = await pool.query(
      `SELECT id FROM utilisateurs WHERE email = ?`,
      [adminEmail]
    );

    if (existingAdmin.length === 0) {
      const hashedPassword = await hashPassword("admin123456");
      await pool.query(
        `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, telephone, adresse)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ["Admin EduCar", adminEmail, hashedPassword, "admin", "22123456", "EduCar Center"]
      );
      console.log("✅ Admin user created (email: admin@educar.local, password: admin123456)");
    }

    // Create sample monitors (if table is empty)
    const [monitors] = await pool.query(`SELECT COUNT(*) as count FROM moniteurs`);
    
    if (monitors[0].count === 0) {
      const monitorData = [
        { nom: "Mohamed Ali", email: "m.ali@educar.local", telephone: "98765432" },
        { nom: "Fatima Ben", email: "f.ben@educar.local", telephone: "87654321" }
      ];

      for (const monitor of monitorData) {
        const hashedPassword = await hashPassword("monitor123");
        const [result] = await pool.query(
          `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, telephone)
           VALUES (?, ?, ?, ?, ?)`,
          [monitor.nom, monitor.email, hashedPassword, "moniteur", monitor.telephone]
        );

        // Create monitor record
        const [formation] = await pool.query(
          `SELECT id FROM formations LIMIT 1`
        );

        await pool.query(
          `INSERT INTO moniteurs (id, id_formation, voiture)
           VALUES (?, ?, ?)`,
          [result.insertId, formation[0].id, "Kia Picanto"]
        );
      }
      console.log("✅ Sample monitors created");
    }

    console.log("🌱 Database seeding completed!");

  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
