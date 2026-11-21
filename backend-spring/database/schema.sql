CREATE DATABASE IF NOT EXISTS auto_ecole
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE auto_ecole;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    adresse VARCHAR(255) NOT NULL DEFAULT '',
    photo_profil LONGTEXT NULL,
    role ENUM('eleve','moniteur','admin') NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_telephone CHECK (telephone REGEXP '^[0-9]{8}$')
);

CREATE TABLE IF NOT EXISTS formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    prix DECIMAL(10,2) NOT NULL,
    heures_totales INT NOT NULL DEFAULT 20,
    CONSTRAINT chk_prix_formation CHECK (prix > 0),
    CONSTRAINT chk_heures_formation CHECK (heures_totales >= 0)
);

INSERT IGNORE INTO formations (id,nom,prix,heures_totales) VALUES
    (1,'Permis B boîte manuelle',1200.00,20),
    (2,'Permis B boîte automatique',1100.00,20),
    (3,'Code',300.00,0),
    (4,'Recyclage',250.00,7);

CREATE TABLE IF NOT EXISTS eleves (
    id INT PRIMARY KEY,
    id_formation INT NOT NULL,
    progression INT NOT NULL DEFAULT 0,
    heures_effectuees DECIMAL(5,1) NOT NULL DEFAULT 0,
    date_inscription DATE NOT NULL,
    CONSTRAINT chk_progression CHECK (progression BETWEEN 0 AND 100),
    FOREIGN KEY (id) REFERENCES utilisateurs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_formation) REFERENCES formations(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS moniteurs (
    id INT PRIMARY KEY,
    id_formation INT NOT NULL,
    voiture ENUM('Kia Picanto','Renault Clio') NOT NULL,
    FOREIGN KEY (id) REFERENCES utilisateurs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_formation) REFERENCES formations(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    moniteur_id INT NOT NULL,
    date_reservation DATETIME NOT NULL,
    duree_minutes INT NOT NULL DEFAULT 60,
    adresse_depart TEXT,
    statut ENUM('reservee','terminee','annulee') NOT NULL DEFAULT 'reservee',
    note_client TEXT,
    seance_id INT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (moniteur_id) REFERENCES moniteurs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uniq_reservation_moniteur_creneau (moniteur_id,date_reservation),
    UNIQUE KEY uniq_reservation_eleve_creneau (eleve_id,date_reservation)
);

CREATE TABLE IF NOT EXISTS reclamations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NULL,
    reservation_ref VARCHAR(80) NULL,
    raison TEXT NOT NULL,
    piece_nom VARCHAR(255) NULL,
    piece_type VARCHAR(120) NULL,
    piece_data LONGTEXT NULL,
    statut ENUM('nouvelle','en_cours','traitee') NOT NULL DEFAULT 'nouvelle',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reclamations_utilisateur (utilisateur_id),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE SET NULL ON UPDATE CASCADE
);
