import {
  createBooking,
  findAssignedMonitorIdForStudent,
  listBookings,
  listBookingsByMonitor,
  listBookingsByStudent,
  updateBookingStatus,
  findBookingById
} from "../repositories/bookingRepository.js";

export async function getBookings() {
  return listBookings();
}

export async function getBookingsForUser(user) {
  if (!user) {
    const error = new Error("Authentification requise.");
    error.status = 401;
    throw error;
  }

  if (user.role === "admin") {
    return listBookings();
  }
  if (user.role === "moniteur") {
    return listBookingsByMonitor(user.id);
  }
  if (user.role === "eleve") {
    return listBookingsByStudent(user.id);
  }

  return [];
}

function getDurationMinutes(duration, typeId) {
  const durationText = String(duration || "");
  const hourMatch = durationText.match(/(\d+(?:[.,]\d+)?)\s*h/i);
  if (hourMatch) {
    return Math.max(30, Math.round(Number(hourMatch[1].replace(",", ".")) * 60));
  }

  return typeId === "2h" ? 120 : 60;
}

function getDateTime(date, time) {
  const dateValue = String(date || "").trim();
  const timeValue = String(time || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue) || !/^\d{2}:\d{2}$/.test(timeValue)) {
    const error = new Error("Date ou heure invalide.");
    error.status = 400;
    throw error;
  }

  return `${dateValue} ${timeValue}:00`;
}

export async function addBookingForStudent(studentId, payload) {
  const moniteurId = await findAssignedMonitorIdForStudent(studentId);

  if (!moniteurId) {
    const error = new Error("Aucun moniteur n'est lie a votre formation.");
    error.status = 404;
    throw error;
  }

  const adresseDepart = String(payload.place || payload.adresseDepart || "").trim();
  if (!adresseDepart) {
    const error = new Error("Veuillez saisir le lien de rencontre.");
    error.status = 400;
    throw error;
  }

  return createBooking({
    eleveId: studentId,
    moniteurId,
    dateLecon: getDateTime(payload.date, payload.time),
    dureeMinutes: getDurationMinutes(payload.duration, payload.typeId),
    adresseDepart,
    notesMoniteur: String(payload.note || "").trim()
  });
}

export async function cancelBookingForUser(user, bookingId) {
  if (!user) {
    const error = new Error("Authentification requise.");
    error.status = 401;
    throw error;
  }

  const id = Number(bookingId);
  if (!Number.isFinite(id) || id <= 0) {
    const error = new Error("Reservation invalide.");
    error.status = 400;
    throw error;
  }

  const booking = await findBookingById(id);
  if (!booking) {
    const error = new Error("Reservation introuvable.");
    error.status = 404;
    throw error;
  }

  const isOwnerStudent = user.role === "eleve" && Number(booking.eleve_id) === Number(user.id);
  const isOwnerMonitor = user.role === "moniteur" && Number(booking.moniteur_id) === Number(user.id);
  const isAdmin = user.role === "admin";

  if (!isOwnerStudent && !isOwnerMonitor && !isAdmin) {
    const error = new Error("Vous n'avez pas l'autorisation d'annuler cette reservation.");
    error.status = 403;
    throw error;
  }

  if (booking.statut === "annulee") {
    return booking;
  }

  return updateBookingStatus(id, "annulee");
}
