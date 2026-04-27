import { createBooking, findAssignedMonitorIdForStudent, listBookings } from "../repositories/bookingRepository.js";

export async function getBookings() {
  return listBookings();
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
