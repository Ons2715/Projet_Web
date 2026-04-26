/**
 * API Constants and Enumerations
 */

export const ROLES = {
  ADMIN: "admin",
  MONITOR: "moniteur",
  STUDENT: "eleve"
};

export const BOOKING_STATUS = {
  PENDING: "en_attente",
  CONFIRMED: "confirmee",
  COMPLETED: "completee",
  CANCELLED: "annulee"
};

export const PAYMENT_STATUS = {
  PENDING: "en_attente",
  COMPLETED: "effectue",
  FAILED: "echoue",
  REFUNDED: "remboursee"
};

export const PAYMENT_METHOD = {
  CARD: "carte",
  TRANSFER: "virement",
  CASH: "especes"
};

export const RECLAMATION_STATUS = {
  PENDING: "en_attente",
  IN_PROGRESS: "en_cours",
  RESOLVED: "resolue",
  REJECTED: "rejetee"
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

export const ERROR_MESSAGES = {
  INVALID_INPUT: "Invalid input data",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  ALREADY_EXISTS: "Resource already exists",
  DATABASE_ERROR: "Database error occurred",
  EMAIL_ERROR: "Failed to send email",
  INVALID_TOKEN: "Invalid or expired token"
};
