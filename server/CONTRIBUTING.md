# CONTRIBUTING.md

## Development Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

5. Import the database schema:
```bash
mysql -h localhost -u root -p auto_ecole < database/projet.sql
```

6. (Optional) Seed the database with default data:
```bash
node utils/seed.js
```

7. Start the development server:
```bash
npm run dev
```

## Code Style

- Use ES6+ syntax with import/export
- Use async/await for promises
- Keep functions focused and single-responsibility
- Add JSDoc comments to functions
- Use meaningful variable names

## Project Structure

- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Handle database queries
- **Routes**: Define API endpoints
- **Middlewares**: Express middlewares
- **Utils**: Utility functions and helpers

## Adding a New Feature

### 1. Database Schema (if needed)
Update `database/projet.sql` and run migrations

### 2. Repository
Create database query functions in `repositories/featureRepository.js`

### 3. Service
Add business logic in `services/featureService.js`

### 4. Controller
Create request handlers in `controllers/featureController.js`

### 5. Routes
Define endpoints in `routes/featureRoutes.js`

### 6. Register Routes
Add the new router to `routes/index.js`

## Error Handling

Always throw `AppError` or its subclasses:

```javascript
import { ValidationError, NotFoundError } from "../utils/errors.js";

if (!email) {
  throw new ValidationError("Email is required");
}

const user = await findUserById(id);
if (!user) {
  throw new NotFoundError("User");
}
```

## API Response Format

All responses should follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

## Testing

Run tests (when implemented):
```bash
npm test
```

## Deployment

### Using Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Build the project
2. Set environment variables
3. Start the server: `npm start`

## Common Issues

### Connection refused to MySQL
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Ensure MySQL is running

### JWT errors
- Regenerate JWT_SECRET in .env
- Clear auth tokens in client

### Email not sending
- Verify SMTP credentials
- Allow less secure apps (Gmail)
- Check SMTP port is not blocked

## Need Help?

See [API.md](API.md) for API documentation
See [STRUCTURE.md](STRUCTURE.md) for project structure
