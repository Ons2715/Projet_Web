# Backend EduCar

Modules backend proposes pour ce site :

- `auth` : connexion et inscription
- `users` : liste et detail des utilisateurs
- `monitors` : moniteurs
- `students` : eleves
- `bookings` : reservations / seances
- `lessons` : cours et contenus
- `quiz` : quiz et questions
- `payments` : paiements
- `documents` : documents des eleves
- `reclamations` : reclamations client avec piece jointe

## Structure

```text
server/
  src/
    config/
    controllers/
    middlewares/
    repositories/
    routes/
    services/
    utils/
```

## Lancer le projet

1. Copier `.env.example` en `.env`
2. Importer `database/projet.sql`
3. Installer les dependances :

```bash
npm install
```

4. Lancer le serveur :

```bash
npm run dev
```

## SMTP

Pour envoyer automatiquement le mail de bienvenue apres une inscription,
renseigner ces variables dans `server/.env` :

```bash
SMTP_HOST=smtp.votre-fournisseur.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe_smtp
SMTP_FROM="EduCar <votre@email.com>"
```

## Exemples d'API

- `GET /health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users`
- `GET /api/monitors`
- `GET /api/students`
- `GET /api/bookings`
- `GET /api/lessons`
- `GET /api/quiz`
- `GET /api/payments`
- `GET /api/documents`
- `GET /api/reclamations` (admin)
- `POST /api/reclamations`
