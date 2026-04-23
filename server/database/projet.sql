CREATE DATABASE auto_ecole;
USE auto_ecole;

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moniteur', 'eleve') NOT NULL,
    telephone VARCHAR(20),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eleves (
    id INT PRIMARY KEY,
    type_permis VARCHAR(50) NOT NULL,
    date_inscription DATE NOT NULL,
    FOREIGN KEY (id) REFERENCES utilisateurs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE moniteurs (
    id INT PRIMARY KEY,
    specialite VARCHAR(50) NOT NULL,
    FOREIGN KEY (id) REFERENCES utilisateurs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question TEXT NOT NULL,
    reponse_correcte VARCHAR(255) NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Leçons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    moniteur_id INT NOT NULL,
    date_Leçon DATETIME NOT NULL,
    statut ENUM('en_cours', 'confirmee', 'terminee', 'annulee') DEFAULT 'en_attente',
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (moniteur_id) REFERENCES moniteurs(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE (eleve_id, date_Leçon)
);

CREATE TABLE resultats_quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT NOT NULL,
    date_passage TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    methode ENUM('cash', 'carte') NOT NULL,
    statut ENUM('paye', 'en_attente') DEFAULT 'en_attente',
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    fichier_url TEXT NOT NULL,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_Leçons_eleve ON Leçons(eleve_id);
CREATE INDEX idx_Leçons_moniteur ON Leçons(moniteur_id);
CREATE INDEX idx_Leçons_date ON Leçons(date_Leçon);

CREATE INDEX idx_paiements_eleve ON paiements(eleve_id);
CREATE INDEX idx_paiements_statut ON paiements(statut);

CREATE INDEX idx_questions_quiz ON questions(quiz_id);

CREATE INDEX idx_resultats_eleve ON resultats_quiz(eleve_id);
CREATE INDEX idx_resultats_quiz_id ON resultats_quiz(quiz_id);