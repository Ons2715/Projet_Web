# Backend CityDrive

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
