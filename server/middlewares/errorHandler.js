export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || "Erreur interne du serveur.";

  res.status(status).json({
    error: message
  });
}
