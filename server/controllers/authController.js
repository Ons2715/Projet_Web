import { loginUser, registerUser } from "../services/authService.js";

export async function login(req, res) {
  const result = await loginUser(req.body);
  res.json(result);
}

export async function register(req, res) {
  const result = await registerUser({
    nom: req.body.nom || `${req.body.firstName || ""} ${req.body.lastName || ""}`.trim(),
    email: req.body.email,
    motDePasse: req.body.motDePasse || req.body.password,
    role: req.body.role,
    telephone: req.body.telephone,
    adresse: req.body.adresse || req.body.address
  });

  res.status(201).json(result);
}

export async function me(req, res) {
  res.json({ user: req.user });
}
