import { verifyToken } from "../utils/token.js";

export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: "Session expiree ou invalide. Veuillez vous reconnecter." });
  }

  req.user = payload;
  next();
}

export function requireRole(...roles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Vous n'avez pas l'autorisation d'acceder a cette ressource." });
    }

    next();
  };
}
