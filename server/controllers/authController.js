import { loginUser, registerUser } from "../services/authService.js";

export async function login(req, res) {
  const user = await loginUser(req.body);
  res.json({ user });
}

export async function register(req, res) {
  const result = await registerUser({
    nom: req.body.nom,
    email: req.body.email,
    motDePasse: req.body.motDePasse,
    role: req.body.role,
    telephone: req.body.telephone
  });

  res.status(201).json(result);
}
