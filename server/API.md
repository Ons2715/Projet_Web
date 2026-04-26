# API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
Most endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires auth)

### Users (`/users`)
- `GET /users` - List all users (admin only)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user (admin only)

### Monitors (`/monitors`)
- `GET /monitors` - List monitors
- `GET /monitors/:id` - Get monitor details
- `POST /monitors` - Create monitor (admin)
- `PUT /monitors/:id` - Update monitor (admin)
- `DELETE /monitors/:id` - Delete monitor (admin)

### Students (`/students`)
- `GET /students` - List students
- `GET /students/:id` - Get student details
- `POST /students` - Create student (admin)
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student (admin)

### Bookings (`/bookings`)
- `GET /bookings` - List bookings
- `GET /bookings/:id` - Get booking details
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

### Lessons (`/lessons`)
- `GET /lessons` - List lessons
- `GET /lessons/:id` - Get lesson details
- `POST /lessons` - Create lesson (monitor/admin)
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson

### Quiz (`/quiz`)
- `GET /quiz` - List quizzes
- `GET /quiz/:id` - Get quiz details
- `POST /quiz` - Create quiz (admin)
- `PUT /quiz/:id` - Update quiz
- `DELETE /quiz/:id` - Delete quiz
- `POST /quiz/:id/submit` - Submit quiz answers

### Payments (`/payments`)
- `GET /payments` - List payments
- `GET /payments/:id` - Get payment details
- `POST /payments` - Create payment
- `PUT /payments/:id` - Update payment status
- `DELETE /payments/:id` - Delete payment

### Documents (`/documents`)
- `GET /documents` - List documents
- `GET /documents/:id` - Download document
- `POST /documents` - Upload document
- `DELETE /documents/:id` - Delete document

### Reclamations (`/reclamations`)
- `GET /reclamations` - List reclamations (admin)
- `GET /reclamations/:id` - Get reclamation details
- `POST /reclamations` - Create reclamation
- `PUT /reclamations/:id` - Update reclamation status (admin)
- `DELETE /reclamations/:id` - Delete reclamation

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Success Response Format

### List Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 0,
    "pages": 0
  }
}
```

### Single Resource Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "..."
  }
}
```

### Create Response (201 Created)
```json
{
  "success": true,
  "message": "Resource created",
  "data": {
    "id": 1,
    ...
  }
}
```
