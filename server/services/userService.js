import { createUserProfile, deleteUserById, findUserById, listUsers } from "../repositories/userRepository.js";
import { sendWelcomeEmail } from "./mailService.js";
import { hashPassword } from "../utils/password.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9]{8}$/.test(String(phone || "").trim());
}

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

export async function addUserProfile(payload) {
  const nom = String(payload.nom || "").trim();
  const email = normalizeEmail(payload.email);
  const telephone = String(payload.telephone || "").trim();
  const adresse = String(payload.adresse || "").trim();
  const role = payload.role === "moniteur" ? "moniteur" : "eleve";
  const password = String(payload.motDePasse || payload.password || "");

  if (!nom || !email || !telephone || !adresse || !password) {
    const error = new Error("Veuillez remplir tous les champs obligatoires.");
    error.status = 400;
    throw error;
  }

  if (!validateEmail(email)) {
    const error = new Error("Adresse email invalide.");
    error.status = 400;
    throw error;
  }

  if (!validatePhone(telephone)) {
    const error = new Error("Le numero de telephone doit contenir exactement 8 chiffres.");
    error.status = 400;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Le mot de passe doit contenir au moins 8 caracteres.");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const userId = await createUserProfile({
    nom,
    email,
    motDePasse: hashedPassword,
    role,
    telephone,
    adresse,
    voiture: payload.voiture,
    formationId: payload.formationId
  });

  const user = await getUserById(userId);
  sendWelcomeEmail(user).catch((error) => {
    console.error("Erreur email de bienvenue:", error.message);
  });

  return user;
}

export async function deleteUserProfile(id) {
  const deleted = await deleteUserById(id);

  if (!deleted) {
    const error = new Error("Utilisateur introuvable.");
    error.status = 404;
    throw error;
  }

  return { success: true };
}
