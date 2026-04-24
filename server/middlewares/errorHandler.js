export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  let message = error.message || "Erreur interne du serveur.";

  if (error.code === "ER_DUP_ENTRY") {
    message = "Cette information existe deja dans la base.";
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    message = "La ressource liee est introuvable.";
  }

  res.status(status).json({
    error: message
  });
}
