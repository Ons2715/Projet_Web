import { createUser, findUserByEmail } from "../repositories/authRepository.js";
import { sendWelcomeEmail } from "./mailService.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { createToken } from "../utils/token.js";

const ROLE_TO_CLIENT = {
  admin: "admin",
  moniteur: "monitor",
  eleve: "student"
};

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "987654321";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function splitName(nom) {
  const parts = String(nom || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ")
  };
}

function toClientUser(user) {
  const name = splitName(user.nom);

  return {
    id: user.id,
    firstName: name.firstName,
    lastName: name.lastName,
    name: user.nom,
    email: user.email,
    role: ROLE_TO_CLIENT[user.role] || user.role,
    serverRole: user.role,
    phone: user.telephone,
    address: user.adresse,
    formation: "Permis B"
  };
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[0-9]{8}$/.test(String(phone || "").trim());
}

export async function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    const error = new Error("Veuillez saisir votre email et votre mot de passe.");
    error.status = 400;
    throw error;
  }

  if (normalizedEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
    const adminUser = {
      id: 0,
      firstName: "Admin",
      lastName: "EduCar",
      name: "Admin EduCar",
      email: DEFAULT_ADMIN_EMAIL,
      role: "admin",
      serverRole: "admin",
      phone: "",
      address: "",
      formation: "Administration"
    };
    const token = createToken({ id: 0, email: DEFAULT_ADMIN_EMAIL, role: "admin" });

    return { user: adminUser, token };
  }

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    const error = new Error("Compte inexistant.");
    error.status = 401;
    throw error;
  }

  const passwordMatches = await verifyPassword(password, user.mot_de_passe);

  if (!passwordMatches) {
    const error = new Error("Mot de passe incorrect.");
    error.status = 401;
    throw error;
  }

  const clientUser = toClientUser(user);
  const token = createToken({ id: user.id, email: user.email, role: user.role });

  return { user: clientUser, token };
}

export async function registerUser(payload) {
  const email = normalizeEmail(payload.email);
  const nom = String(payload.nom || "").trim();
  const adresse = String(payload.adresse || "").trim();
  const role = ["admin", "moniteur", "eleve"].includes(payload.role) ? payload.role : "eleve";

  if (!nom || !email || !payload.motDePasse || !payload.telephone || !adresse) {
    const error = new Error("Veuillez remplir tous les champs obligatoires.");
    error.status = 400;
    throw error;
  }

  if (!validateEmail(email)) {
    const error = new Error("Adresse email invalide.");
    error.status = 400;
    throw error;
  }

  if (!validatePhone(payload.telephone)) {
    const error = new Error("Le numero de telephone doit contenir exactement 8 chiffres.");
    error.status = 400;
    throw error;
  }

  if (String(payload.motDePasse).length < 8) {
    const error = new Error("Le mot de passe doit contenir au moins 8 caracteres.");
    error.status = 400;
    throw error;
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Cet email est deja utilise.");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(payload.motDePasse);
  const userId = await createUser({
    nom,
    email,
    motDePasse: hashedPassword,
    role,
    telephone: payload.telephone,
    adresse
  });

  const user = await findUserByEmail(email);
  const clientUser = toClientUser(user || { id: userId, nom, email, role, telephone: payload.telephone, adresse });
  const token = createToken({ id: userId, email, role });

  sendWelcomeEmail(clientUser).catch((error) => {
    console.error("Erreur email de bienvenue:", error.message);
  });

  return { user: clientUser, token };
}
