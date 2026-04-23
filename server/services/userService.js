import { findUserById, listUsers } from "../repositories/userRepository.js";

export async function getUsers() {
  return listUsers();
}

export async function getUserById(id) {
  const user = await findUserById(id);

  if (!user) {
    const error = new Error("Utilisateur introuvable.");
    error.status = 404;
    throw error;
  }

  return user;
}
