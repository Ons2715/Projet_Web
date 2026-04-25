-- ============================================================
--  BASE DE DONNÉES : auto_ecole  (v3)
--  Encodage : utf8mb4 / utf8mb4_unicode_ci
-- ============================================================
 
CREATE DATABASE IF NOT EXISTS auto_ecole
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
 
USE auto_ecole;
 
-- ============================================================
--  TABLE CENTRALE : utilisateurs
-- ============================================================
CREATE TABLE utilisateurs (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nom              VARCHAR(100) NOT NULL,
    email            VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe     VARCHAR(255) NOT NULL,
    telephone        VARCHAR(15)  NOT NULL,
    adresse          VARCHAR(255) NOT NULL DEFAULT '',
    role             ENUM('eleve', 'moniteur', 'admin') NOT NULL,
    date_creation    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_telephone CHECK (telephone REGEXP '^[0-9]{8}$')
);

-- ============================================================
--  FORMATIONS
-- ============================================================
CREATE TABLE formations (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nom            VARCHAR(100)  NOT NULL UNIQUE,
    prix           DECIMAL(10,2) NOT NULL,
    heures_totales INT           NOT NULL DEFAULT 20,
    CONSTRAINT chk_prix_formation    CHECK (prix > 0),
    CONSTRAINT chk_heures_formation  CHECK (heures_totales >= 0)
);
 
INSERT INTO formations (nom, prix, heures_totales) VALUES
    ('Permis B boîte manuelle',  1200.00, 20),
    ('Permis B boîte automatique',  1100.00, 20),
    ('Code',     300.00,  0),
    ('Recyclage', 250.00,  7);
 
-- ============================================================
--  ÉLÈVES
-- ============================================================
CREATE TABLE eleves (
    id                INT          PRIMARY KEY,
    id_formation      INT          NOT NULL,
    progression       INT          NOT NULL DEFAULT 0,
    heures_effectuees DECIMAL(5,1) NOT NULL DEFAULT 0,
    date_inscription  DATE         NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT chk_progression CHECK (progression BETWEEN 0 AND 100),
    FOREIGN KEY (id)           REFERENCES utilisateurs(id)
        ON DELETE CASCADE  ON UPDATE CASCADE,
    FOREIGN KEY (id_formation) REFERENCES formations(id)
        ON DELETE RESTRICT ON UPDATE CASCADE  
);

CREATE TABLE moniteurs (
    id           INT PRIMARY KEY,
    id_formation INT NOT NULL,
    voiture      ENUM('Kia Picanto', 'Renault Clio') NOT NULL,
    FOREIGN KEY (id)           REFERENCES utilisateurs(id)
        ON DELETE CASCADE  ON UPDATE CASCADE,
    FOREIGN KEY (id_formation) REFERENCES formations(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);
 
-- ============================================================
--  SÉANCES
-- ============================================================
CREATE TABLE seances (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id       INT      NOT NULL,
    moniteur_id    INT      NOT NULL,
    date_lecon     DATETIME NOT NULL,
    duree_minutes  INT      NOT NULL DEFAULT 60,
    adresse_depart TEXT,
    statut         ENUM('confirmee', 'terminee', 'annulee') NOT NULL DEFAULT 'confirmee',
    notes_moniteur TEXT,
    date_creation  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_duree CHECK (duree_minutes > 0),
    FOREIGN KEY (eleve_id)    REFERENCES eleves(id)    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (moniteur_id) REFERENCES moniteurs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uniq_moniteur_creneau (moniteur_id, date_lecon),
    UNIQUE KEY uniq_eleve_creneau    (eleve_id,    date_lecon)
);
 
-- ============================================================
--  QUIZ & QUESTIONS
-- ============================================================
CREATE TABLE quiz (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    titre       VARCHAR(255) NOT NULL,
    description TEXT
);
 
CREATE TABLE questions (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id          INT  NOT NULL,
    question         TEXT NOT NULL,
    reponse_correcte VARCHAR(255) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 
CREATE TABLE options_reponses (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    question_id  INT          NOT NULL,
    texte        VARCHAR(255) NOT NULL,
    est_correcte TINYINT(1)   NOT NULL DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES questions(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
 
-- ============================================================
--  RÉSULTATS QUIZ
-- ============================================================
CREATE TABLE resultats_quiz (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id     INT NOT NULL,
    quiz_id      INT NOT NULL,
    score        INT NOT NULL,
    date_passage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_score CHECK (score BETWEEN 0 AND 100),
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (quiz_id)  REFERENCES quiz(id)    ON DELETE CASCADE ON UPDATE CASCADE
);
 
-- ============================================================
--  PAIEMENTS
-- ============================================================
CREATE TABLE paiements (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id      INT           NOT NULL,
    montant       DECIMAL(10,2) NOT NULL,
    statut        ENUM('en_attente', 'valide', 'rembourse') NOT NULL DEFAULT 'en_attente',
    methode       ENUM('especes', 'carte', 'virement')      NOT NULL DEFAULT 'carte',
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_montant CHECK (montant > 0),
    FOREIGN KEY (eleve_id) REFERENCES eleves(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
--  RECLAMATIONS
-- ============================================================
CREATE TABLE reclamations (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id  INT NULL,
    reservation_ref VARCHAR(80) NULL,
    raison          TEXT NOT NULL,
    piece_nom       VARCHAR(255) NULL,
    piece_type      VARCHAR(120) NULL,
    piece_data      LONGTEXT NULL,
    statut          ENUM('nouvelle', 'en_cours', 'traitee') NOT NULL DEFAULT 'nouvelle',
    date_creation   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reclamations_utilisateur (utilisateur_id),
    CONSTRAINT fk_reclamations_utilisateur
        FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
        ON DELETE SET NULL ON UPDATE CASCADE
);
