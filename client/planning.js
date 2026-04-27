const BOOKINGS_KEY = "EduCar_client_bookings";
const MONITOR_PROFILE_KEY = "EduCar_monitor_profile";
const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const SESSION_TYPES = [
  {
    id: "1h",
    label: "1 heure",
    duration: "1h",
    place: "Agence EduCar, Centre Urbain Nord, Tunis",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centre+Urbain+Nord+Tunis"
  },
  {
    id: "2h",
    label: "2 heures",
    duration: "2h",
    place: "Agence EduCar, Centre Urbain Nord, Tunis",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centre+Urbain+Nord+Tunis"
  }
];
const DEFAULT_MONITOR_PROFILE = {
  firstName: "Mourad",
  lastName: "Ben Salah",
  phone: "+216 20 000 000",
  email: "",
  formation: "Permis B"
};
const PLANNING_LeçonS = [
  {
    id: "Leçon1",
    name: "Croisement",
    step: "1.0 Introduction",
    summary: "Qui passe en premier, comment ralentir et bien se positionner."
  },
  {
    id: "Leçon2",
    name: "Vitesse",
    step: "2.0 Introduction",
    summary: "Distance de reaction, distance d'arret et gestion de la vitesse."
  },
  {
    id: "Leçon4",
    name: "Priorites",
    step: "4.0 Introduction",
    summary: "Priorite a droite, ceders le passage et reflexes essentiels."
  }
];

let monthCursor = new Date();
monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
let selectedDateKey = "";
let selectedTypeId = SESSION_TYPES[0].id;
let selectedSlot = "";
let selectedReclamationIndex = -1;
let serverBookings = [];

function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(date) {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getStoredBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStoredBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function getMonitorProfile() {
  try {
    const storedProfile = JSON.parse(localStorage.getItem(MONITOR_PROFILE_KEY) || "null");
    if (storedProfile && typeof storedProfile === "object") {
      return {
        firstName: storedProfile.firstName || DEFAULT_MONITOR_PROFILE.firstName,
        lastName: storedProfile.lastName || DEFAULT_MONITOR_PROFILE.lastName,
        phone: storedProfile.phone || DEFAULT_MONITOR_PROFILE.phone,
        photo: storedProfile.photo || ""
      };
    }
  } catch {}

  return DEFAULT_MONITOR_PROFILE;
}

function getInitials(firstName, lastName) {
  const initials = `${(firstName || "").charAt(0)}${(lastName || "").charAt(0)}`.toUpperCase();
  return initials || "MD";
}

function splitName(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ")
  };
}

function renderMonitorProfile(monitorProfile = getMonitorProfile()) {
  const fullName = monitorProfile.nom || `${monitorProfile.firstName || ""} ${monitorProfile.lastName || ""}`.trim();
  const nameParts = splitName(fullName);
  const firstName = monitorProfile.firstName || nameParts.firstName;
  const lastName = monitorProfile.lastName || nameParts.lastName;

  document.getElementById("monitor-fullname").value = fullName || "Moniteur non affecte";
  document.getElementById("monitor-phone").value = monitorProfile.telephone || monitorProfile.phone || "";

  const photoBox = document.querySelector(".planning-monitor-photo");
  const photo = ProfilePhotos.get(monitorProfile.email) || monitorProfile.photo || "";
  if (photo) {
    photoBox.innerHTML = `<img src="${photo}" alt="Photo du moniteur" />`;
  } else {
    photoBox.innerHTML = `<span id="monitor-photo-fallback">${getInitials(firstName, lastName)}</span>`;
  }
}

async function loadAssignedMonitor() {
  if (!planningUser || !planningUser.id || !Auth.getToken()) {
    renderMonitorProfile();
    return;
  }

  try {
    const monitor = await Api.get("/monitors/me/assigned");
    renderMonitorProfile(monitor);
  } catch (error) {
    renderMonitorProfile();
    Toast.error(error.message || "Impossible de charger les coordonnees du moniteur.");
  }
}

function renderPlanningLeçons() {
  document.getElementById("planning-Leçons-list").innerHTML = PLANNING_LeçonS.map((Leçon, index) => `
    <article class="planning-Leçon-item">
      <span class="planning-Leçon-rank">0${index + 1}</span>
      <div class="planning-Leçon-content">
        <p class="planning-Leçon-step">${Leçon.step}</p>
        <h3>${Leçon.name}</h3>
        <p>${Leçon.summary}</p>
        <a class="planning-Leçon-link" href="./Lecons.html">Ouvrir la Leçon</a>
      </div>
    </article>
  `).join("");
}

function getDaySlots(date) {
  const hours = [];
  for (let hour = 7; hour <= 18; hour++) {
    if (hour === 12) continue;
    hours.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return hours;
}

function getBookingDateKey(booking) {
  if (booking.date) return booking.date;
  if (booking.date_lecon) return formatDateKey(new Date(booking.date_lecon));
  return "";
}

function getBookingTime(booking) {
  if (booking.time) return booking.time;
  if (!booking.date_lecon) return "";
  const date = new Date(booking.date_lecon);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function isSlotBooked(dateKey, slot) {
  return serverBookings.some((booking) =>
    booking.statut !== "annulee" &&
    getBookingDateKey(booking) === dateKey &&
    getBookingTime(booking) === slot
  );
}

function isSlotPastOrCurrent(dateKey, slot) {
  const now = new Date();
  const slotDate = new Date(`${dateKey}T${slot}:00`);
  const currentHourStart = new Date(now);
  currentHourStart.setMinutes(0, 0, 0);
  return slotDate <= currentHourStart;
}

function getSlotUnavailableReason(dateKey, slot) {
  if (isSlotPastOrCurrent(dateKey, slot)) return "Horaire passe";
  if (isSlotBooked(dateKey, slot)) return "Deja reserve";
  return "";
}

async function loadServerBookings() {
  if (!Auth.getToken()) return;

  try {
    serverBookings = await Api.get("/bookings");
  } catch (error) {
    serverBookings = [];
    Toast.error(error.message || "Impossible de charger les creneaux reserves.");
  }
}

function renderWeekDays() {
  document.getElementById("calendar-weekdays").innerHTML = WEEK_DAYS.map((day) => `
    <div class="planning-weekday">${day}</div>
  `).join("");
}

function renderCalendar() {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstIndex = (firstDay.getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = normalizeDate(new Date());
  const monthLabel = firstDay.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  document.getElementById("month-label").textContent = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const cells = [];
  for (let i = 0; i < firstIndex; i++) {
    cells.push(`<button class="planning-day is-empty" type="button" aria-hidden="true"></button>`);
  }

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(year, month, day);
    const currentKey = formatDateKey(currentDate);
    const isPast = normalizeDate(currentDate) < today;
    const isToday = formatDateKey(today) === currentKey;
    const isSelected = selectedDateKey === currentKey;

    cells.push(`
      <button
        class="planning-day ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}"
        type="button"
        onclick="selectDate('${currentKey}')"
        ${isPast ? "disabled" : ""}
      >
        <span class="planning-day-number">${day}</span>
      </button>
    `);
  }

  document.getElementById("calendar-days").innerHTML = cells.join("");
}

function renderSessionTypes() {
  document.getElementById("session-types").innerHTML = SESSION_TYPES.map((type) => `
    <div class="planning-type-card">
      <button class="planning-type ${selectedTypeId === type.id ? "active" : ""}" type="button" onclick="selectSessionType('${type.id}')">
        <span class="planning-type-label">${type.label}</span>
        <span class="planning-type-meta">${type.duration}</span>
      </button>
    </div>
  `).join("");
}

function renderSlots() {
  const container = document.getElementById("time-slots");
  if (!selectedDateKey) {
   // container.innerHTML = `<div class="planning-empty">Choisissez d'abord une date pour voir les heures disponibles.</div>`;
    return;
  }

  const date = new Date(`${selectedDateKey}T12:00:00`);
  const slots = getDaySlots(date);
  if (!slots.length) {
    container.innerHTML = `<div class="planning-empty">Aucun creneau disponible pour cette date.</div>`;
    return;
  }

  if (selectedSlot && getSlotUnavailableReason(selectedDateKey, selectedSlot)) {
    selectedSlot = "";
  }

  container.innerHTML = slots.map((slot) => {
    const unavailableReason = getSlotUnavailableReason(selectedDateKey, slot);
    const unavailable = Boolean(unavailableReason);

    return `
    <button
      class="planning-slot ${selectedSlot === slot ? "active" : ""} ${unavailable ? "is-disabled" : ""}"
      type="button"
      onclick="selectSlot('${slot}')"
      ${unavailable ? "disabled" : ""}
    >
      <span class="planning-slot-time">${slot}</span>
      <span class="planning-slot-meta">${unavailableReason || `Duree ${SESSION_TYPES.find((item) => item.id === selectedTypeId).duration}`}</span>
    </button>
  `;
  }).join("");
}

function renderSelectedDateSummary() {
  const title = document.getElementById("selected-date-label");
  const helper = document.getElementById("selected-date-helper");
  if (!selectedDateKey) {
    title.textContent = "Aucune date selectionnee";
    helper.textContent = "Selectionnez un jour disponible dans le calendrier.";
    return;
  }

  const date = new Date(`${selectedDateKey}T12:00:00`);
  title.textContent = formatLongDate(date);
  //helper.innerHTML = `${SESSION_TYPES.find((item) => item.id === selectedTypeId).label} selectionnee. Choisissez maintenant une heure.<br><a class="planning-place-link" href="${SESSION_TYPES.find((item) => item.id === selectedTypeId).mapsUrl}" target="_blank" rel="noopener noreferrer">Voir le lieu de rencontre sur Google Maps</a>`;
}

function renderUpcomingBookings() {
  const bookings = getStoredBookings()
    .sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`));
  const container = document.getElementById("upcoming-bookings");
  const badge = document.getElementById("booking-count-badge");
  badge.textContent = `${bookings.length} reservation${bookings.length > 1 ? "s" : ""}`;

  if (!bookings.length) {
    container.innerHTML = `<div class="planning-empty">Aucune reservation pour le moment. Choisissez une date et un horaire.</div>`;
    return;
  }

  container.innerHTML = bookings.map((booking, index) => {
    const date = new Date(`${booking.date}T12:00:00`);
    return `
      <article class="planning-upcoming-item">
        <div class="planning-upcoming-date">
          <span>${String(date.getDate()).padStart(2, "0")}</span>
          <small>${date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</small>
        </div>
        <div>
          <div class="planning-upcoming-title">${booking.typeLabel}</div>
          <div class="planning-upcoming-meta">${booking.time} - ${booking.duration}</div>
          <div class="planning-upcoming-meta"><a class="planning-place-link" href="${booking.mapsUrl}" target="_blank" rel="noopener noreferrer">${booking.place}</a></div>
          <div class="planning-upcoming-meta">${booking.note || "Sans note particuliere"}</div>
        </div>
        <div class="planning-upcoming-actions">
          <button class="btn btn-outline btn-sm" type="button" onclick="openReclamationModal(${index})">Reclamer</button>
          <button class="btn btn-outline btn-sm" type="button" onclick="cancelBooking(${index})">Annuler</button>
        </div>
      </article>
    `;
  }).join("");
}

function selectDate(dateKey) {
  selectedDateKey = dateKey;
  selectedSlot = "";
  renderCalendar();
  renderSelectedDateSummary();
  renderSlots();
}

function selectSessionType(typeId) {
  selectedTypeId = typeId;
  selectedSlot = "";
  const selectedType = SESSION_TYPES.find((item) => item.id === typeId);
  if (selectedType && !document.getElementById("meeting-address").value.trim()) {
    document.getElementById("meeting-address").value = selectedType.place;
  }
  renderSessionTypes();
  renderSelectedDateSummary();
  renderSlots();
}

function selectSlot(slot) {
  if (getSlotUnavailableReason(selectedDateKey, slot)) {
    return;
  }
  selectedSlot = slot;
  renderSlots();
}

function resetBookingSelection() {
  selectedDateKey = "";
  selectedTypeId = SESSION_TYPES[0].id;
  selectedSlot = "";
  document.getElementById("meeting-address").value = SESSION_TYPES[0].place;
  document.getElementById("booking-note").value = "";
  renderCalendar();
  renderSessionTypes();
  renderSelectedDateSummary();
  renderSlots();
}

async function confirmBooking() {
  if (!selectedDateKey) {
    Toast.error("Selectionnez d'abord une date.");
    return;
  }
  if (!selectedSlot) {
    Toast.error("Choisissez un horaire disponible.");
    return;
  }

  const selectedType = SESSION_TYPES.find((item) => item.id === selectedTypeId);
  const meetingAddress = document.getElementById("meeting-address").value.trim();
  const note = document.getElementById("booking-note").value.trim();
  const bookings = getStoredBookings();

  if (!meetingAddress) {
    Toast.error("Ajoutez un lieu de rencontre.");
    return;
  }

  const alreadyTaken = bookings.some((booking) =>
    booking.date === selectedDateKey &&
    booking.time === selectedSlot &&
    booking.typeId === selectedTypeId
  );

  if (alreadyTaken) {
    Toast.error("Ce creneau est deja reserve dans cette demo.");
    return;
  }

  const bookingPayload = {
    studentId: planningUser?.id || `student_${Date.now()}`,
    studentFirstName: planningUser?.firstName || "Jean",
    studentLastName: planningUser?.lastName || "Dupont",
    studentPhone: planningUser?.phone || "Non renseigne",
    studentEmail: planningUser?.email || "",
    studentFormation: planningUser?.formation || planningUser?.formation_nom || "Formation non renseignee",
    date: selectedDateKey,
    time: selectedSlot,
    typeId: selectedType.id,
    typeLabel: selectedType.label,
    duration: selectedType.duration,
    place: meetingAddress,
    mapsUrl: meetingAddress.startsWith("http")
      ? meetingAddress
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetingAddress)}`,
    note
  };

  try {
    if (Auth.getToken()) {
      const savedBooking = await Api.post("/bookings", bookingPayload);
      bookingPayload.serverId = savedBooking.id;
      bookingPayload.monitorId = savedBooking.moniteur_id;
      bookingPayload.monitorName = savedBooking.moniteur_nom;
    }
  } catch (error) {
    Toast.error(error.message || "Impossible d'enregistrer la seance.");
    return;
  }

  bookings.push(bookingPayload);
  saveStoredBookings(bookings);
  serverBookings.push({
    id: bookingPayload.serverId,
    date: bookingPayload.date,
    time: bookingPayload.time,
    statut: "confirmee"
  });
  renderUpcomingBookings();
  renderSlots();
  Toast.success(`Reservation confirmee pour le ${new Date(`${selectedDateKey}T12:00:00`).toLocaleDateString("fr-FR")} a ${selectedSlot}.`);
  resetBookingSelection();
}

function cancelBooking(index) {
  const bookings = getStoredBookings();
  bookings.splice(index, 1);
  saveStoredBookings(bookings);
  renderUpcomingBookings();
  Toast.success("Reservation annulee.");
}

function openReclamationModal(index) {
  selectedReclamationIndex = index;
  document.getElementById("reclamation-form").reset();
  document.getElementById("reclamation-modal").classList.add("open");
}

function closeReclamationModal() {
  selectedReclamationIndex = -1;
  document.getElementById("reclamation-modal").classList.remove("open");
}

function readAttachment(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve({ pieceNom: "", pieceType: "", pieceData: "" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("La piece jointe ne doit pas depasser 2 Mo."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        pieceNom: file.name,
        pieceType: file.type,
        pieceData: String(reader.result || "")
      });
    };
    reader.onerror = () => reject(new Error("Impossible de lire la piece jointe."));
    reader.readAsDataURL(file);
  });
}

async function submitReclamation(event) {
  event.preventDefault();
  const bookings = getStoredBookings();
  const booking = bookings[selectedReclamationIndex];
  const reason = document.getElementById("reclamation-reason").value.trim();
  const file = document.getElementById("reclamation-file").files[0];
  const button = document.getElementById("send-reclamation-btn");

  if (!booking && selectedReclamationIndex !== -1) {
    Toast.error("Reservation introuvable.");
    closeReclamationModal();
    return;
  }

  if (!reason) {
    Toast.error("Veuillez saisir la raison.");
    return;
  }

  button.disabled = true;

  try {
    const attachment = await readAttachment(file);
    await Api.post("/reclamations", {
      utilisateurId: planningUser?.id,
      reservationRef: booking ? `${booking.date} ${booking.time}` : "Coordonnees moniteur",
      raison: reason,
      ...attachment
    });
    Toast.success("Reclamation envoyee.");
    closeReclamationModal();
  } catch (error) {
    Toast.error(error.message);
  } finally {
    button.disabled = false;
  }
}

document.getElementById("prev-month-btn").addEventListener("click", function () {
  monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1);
  renderCalendar();
});

document.getElementById("next-month-btn").addEventListener("click", function () {
  monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1);
  renderCalendar();
});

document.getElementById("book-btn").addEventListener("click", confirmBooking);
document.getElementById("reset-btn").addEventListener("click", resetBookingSelection);
document.getElementById("reclamation-form").addEventListener("submit", submitReclamation);
document.getElementById("close-reclamation-modal").addEventListener("click", closeReclamationModal);
document.getElementById("cancel-reclamation-btn").addEventListener("click", closeReclamationModal);

const planningUser = Auth.get();

document.getElementById("planning-logout-link").addEventListener("click", function () {
  Auth.clear();
});

async function initializePlanning() {
  await loadServerBookings();
  renderWeekDays();
  renderCalendar();
  renderSessionTypes();
  loadAssignedMonitor();
  renderPlanningLeçons();
  document.getElementById("meeting-address").value = SESSION_TYPES[0].place;
  renderSelectedDateSummary();
  renderSlots();
  renderUpcomingBookings();
}

initializePlanning();

let storageRefreshTimer = null;
window.addEventListener("storage", function (event) {
  if (event.key !== BOOKINGS_KEY) return;
  if (storageRefreshTimer) clearTimeout(storageRefreshTimer);
  storageRefreshTimer = setTimeout(() => {
    storageRefreshTimer = null;
    renderCalendar();
    renderSelectedDateSummary();
    renderSlots();
    renderUpcomingBookings();
  }, 50);
});
