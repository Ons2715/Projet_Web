import { createUser, findUserByEmail } from "../repositories/authRepository.js";

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);

  if (!user || user.mot_de_passe !== password) {
    const error = new Error("Email ou mot de passe invalide.");
    error.status = 401;
    throw error;
  }

  return {
    id: user.id,
    name: user.nom,
    email: user.email,
    role: user.role,
    phone: user.telephone
  };
}

export async function registerUser(payload) {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    const error = new Error("Cet email existe deja.");
    error.status = 409;
    throw error;
  }

  const userId = await createUser(payload);
  return { id: userId };
}
