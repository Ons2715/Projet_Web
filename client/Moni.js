const BOOKINGS_KEY = "EduCar_client_bookings";
const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAY_START_HOUR = 7;
const DAY_END_HOUR = 19;
const HOUR_ROW_HEIGHT = 72;
let weekCursor = getStartOfWeek(new Date());
let selectedBookingId = "";
let selectedDayKey = formatDateKey(new Date());
let openedCandidateId = "";
let apiBookingsCache = null;

function getStoredBookings() {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]"); }
  catch { return []; }
}
function saveStoredBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}
function isApiMode() {
  const user = Auth.get();
  return Boolean(user && Auth.getToken() && user.role === "moniteur");
}
function getMapsUrlFromPlace(place, mapsUrl) {
  if (mapsUrl) return mapsUrl;
  const value = String(place || "").trim();
  if (!value) return "https://www.google.com/maps/search/?api=1&query=EduCar%20Tunis";
  if (value.startsWith("http")) return value;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
}
function toMonitorBooking(raw) {
  const date = raw.date || (raw.date_lecon ? String(raw.date_lecon).slice(0, 10) : "");
  const time = raw.time || (raw.date_lecon ? String(raw.date_lecon).slice(11, 16) : "");
  const durationMinutes = Number(raw.duree_minutes ?? raw.dureeMinutes ?? 60);
  const duration = durationMinutes % 60 === 0 ? `${durationMinutes / 60}h` : `${durationMinutes} min`;
  const place = raw.adresse_depart ?? raw.adresseDepart ?? raw.place ?? "";

  return {
    id: raw.id,
    _id: String(raw.id ?? ""),
    date,
    time,
    statut: raw.statut,
    duree_minutes: durationMinutes,
    duration,
    typeId: raw.typeId || (durationMinutes >= 120 ? "2h" : "1h"),
    typeLabel: raw.typeLabel || (durationMinutes >= 120 ? "2 heures" : "1 heure"),
    place,
    mapsUrl: getMapsUrlFromPlace(place, raw.mapsUrl),
    note: raw.notes_moniteur ?? raw.note ?? "",
    studentId: raw.eleve_id ?? raw.studentId,
    studentFirstName: raw.eleve_nom ? String(raw.eleve_nom).split(" ")[0] : raw.studentFirstName,
    studentLastName: raw.eleve_nom ? String(raw.eleve_nom).split(" ").slice(1).join(" ") : raw.studentLastName,
    studentPhone: raw.eleve_telephone ?? raw.studentPhone,
    studentEmail: raw.eleve_email ?? raw.studentEmail
  };
}
async function refreshApiBookings() {
  if (!isApiMode()) return;
  const rows = await Api.get("/bookings/me");
  apiBookingsCache = Array.isArray(rows) ? rows : [];
}
function formatDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function getStartOfWeek(date) {
  const out = new Date(date);
  const off = (out.getDay() + 6) % 7;
  out.setDate(out.getDate() - off);
  out.setHours(0,0,0,0);
  return out;
}
function formatWeekRange(startDate) {
  const end = new Date(startDate);
  end.setDate(startDate.getDate() + 6);
  return `${startDate.toLocaleDateString("fr-FR",{day:"numeric",month:"long"})} - ${end.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}`;
}
function formatLongDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}
function getBookingId(b) {
  if (b && (b.id !== undefined && b.id !== null) && String(b.id) !== "") return String(b.id);
  return encodeURIComponent(`${b.date}_${b.time}_${b.studentId||""}_${b.studentPhone||""}`);
}
function escapeHtml(v) {
  return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
function escapeAttribute(v) { return escapeHtml(v).replace(/`/g,"&#096;"); }
function getStudentName(b) { return `${b.studentFirstName||"Candidat"} ${b.studentLastName||""}`.trim(); }
function getStudentKey(b) { return `${b.studentFirstName||""}|${b.studentLastName||""}|${b.studentPhone||""}`; }
function parseBookingDateTime(b) {
  const time = String(b.time || "00:00");
  return new Date(`${b.date}T${time}:00`);
}
function formatHistoryMonthLabel(date) {
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" }).replace(".", "");
}
function getMapsUrl(b) {
  if (b.mapsUrl) return b.mapsUrl;
  if (b.place && b.place.startsWith("http")) return b.place;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.place||"EduCar Tunis")}`;
}
function getBookingStartMinutes(b) {
  const [h="08",m="00"] = String(b.time||"08:00").split(":");
  return (Number(h) - DAY_START_HOUR) * 60 + Number(m);
}
function getBookingDurationMinutes(b) {
  const minutes = Number(b?.duree_minutes ?? b?.dureeMinutes ?? NaN);
  if (Number.isFinite(minutes) && minutes > 0) return minutes;
  const dur = String(b.duration||b.typeLabel||"");
  const match = dur.match(/(\d+(?:[.,]\d+)?)\s*h/i);
  if (match) return Math.max(45, Number(match[1].replace(",",".")) * 60);
  return b.typeId === "2h" ? 120 : 60;
}
function getBookings() {
  if (isApiMode()) {
    const source = Array.isArray(apiBookingsCache) ? apiBookingsCache : [];
    return source
      .map(toMonitorBooking)
      .filter((b) => b.statut !== "annulee")
      .filter((b) => b.date && b.time && b._id)
      .sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`));
  }

  return getStoredBookings()
    .map(b => ({...b, _id: getBookingId(b)}))
    .sort((a,b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`));
}

function renderSummary(bookings) {
  const todayKey = formatDateKey(new Date());
  const weekEnd  = new Date(weekCursor);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const todayCount = bookings.filter(b => b.date === todayKey).length;
  const weekCount  = bookings.filter(b => { const d = new Date(`${b.date}T12:00:00`); return d >= weekCursor && d < weekEnd; }).length;
  const students   = new Set(bookings.map(b => `${b.studentFirstName||""}|${b.studentLastName||""}|${b.studentPhone||""}`));
  const el = id => document.getElementById(id);
  if (el("today-count"))   el("today-count").textContent   = todayCount;
  if (el("week-count"))    el("week-count").textContent    = weekCount;
  if (el("student-count")) el("student-count").textContent = students.size;
  el("booking-total-badge").textContent = `${bookings.length} seance${bookings.length>1?"s":""}`;
}

function renderCalendar(bookings) {
  const weekDates = Array.from({length:7}, (_,i) => {
    const d = new Date(weekCursor);
    d.setDate(weekCursor.getDate() + i);
    return d;
  });
  const todayKey = formatDateKey(new Date());
  const weekEnd  = new Date(weekCursor);
  weekEnd.setDate(weekEnd.getDate() + 7);

  document.getElementById("week-label").textContent = formatWeekRange(weekCursor);

  // Header
  document.getElementById("calendar-header").innerHTML =
    `<div class="monitor-header-spacer"></div>` +
    weekDates.map((date, i) => {
      const key    = formatDateKey(date);
      const active = key === selectedDayKey ? "active-day" : "";
      const today  = key === todayKey ? "is-today" : "";
      return `<button class="${active} ${today}" type="button" onclick="selectDay('${key}')">${DAY_NAMES[i]} ${String(date.getDate()).padStart(2,"0")}</button>`;
    }).join("");

  const grid = document.getElementById("calendar-grid");
  grid.style.setProperty("--monitor-hour-row",   `${HOUR_ROW_HEIGHT}px`);
  grid.style.setProperty("--monitor-hour-count", DAY_END_HOUR - DAY_START_HOUR);

  const weekBookings = bookings.filter(b => {
    const d = new Date(`${b.date}T12:00:00`);
    return d >= weekCursor && d < weekEnd;
  });

  const totalHeight = (DAY_END_HOUR - DAY_START_HOUR) * HOUR_ROW_HEIGHT;

  // ── Colonnes jours — chacune est position:relative pour contenir ses cartes ──
  const dayColumns = weekDates.map((date, i) => {
    const dateKey    = formatDateKey(date);
    const todayCls   = dateKey === todayKey ? "is-today" : "";
    const colBookings = weekBookings.filter(b => b.date === dateKey);

    const cards = colBookings.map(b => {
      const startMin = Math.max(0, Math.min(getBookingStartMinutes(b), (DAY_END_HOUR - DAY_START_HOUR) * 60 - 30));
      const durMin   = getBookingDurationMinutes(b);
      const top      = (startMin / 60) * HOUR_ROW_HEIGHT;
      const height   = Math.max(62, (durMin / 60) * HOUR_ROW_HEIGHT - 10);
      const selected = b._id === selectedBookingId ? "selected" : "";

      return `
        <article
          class="exam-card exam-card-client ${selected}"
          style="position:absolute; top:${top}px; height:${height}px; left:6px; right:6px; width:auto; margin:0; box-sizing:border-box;"
          onclick="selectBooking('${escapeAttribute(b._id)}','${b.date}')"
        >
          <span class="exam-time">${b.time||"--:--"}</span>
          <button class="exam-candidate-name" type="button" onclick="openCandidateWindow('${escapeAttribute(b._id)}',event)">${escapeHtml(getStudentName(b))}</button>
        </article>`;
    }).join("");

    return `
      <div
        class="monitor-day-column ${todayCls}"
        style="grid-column:${i+2}; grid-row:1; position:relative; height:${totalHeight}px; overflow:hidden;"
      >${cards}</div>`;
  }).join("");

  // Lignes horaires
  const hourLines = Array.from({length: DAY_END_HOUR - DAY_START_HOUR + 1}, (_, i) => {
    const hour = DAY_START_HOUR + i;
    return `
      <div class="monitor-time-label" style="top:${i*HOUR_ROW_HEIGHT}px">${String(hour).padStart(2,"0")}:00</div>
      <div class="monitor-hour-line"  style="top:${i*HOUR_ROW_HEIGHT}px"></div>`;
  }).join("");

  // Ligne maintenant
  const now    = new Date();
  const nowMin = (now.getHours() - DAY_START_HOUR) * 60 + now.getMinutes();
  const showNow = now >= weekCursor && now < weekEnd && nowMin >= 0 && nowMin <= (DAY_END_HOUR - DAY_START_HOUR)*60;
  const nowLine = showNow ? `<div class="monitor-now-line" style="top:${(nowMin/60)*HOUR_ROW_HEIGHT}px;"></div>` : "";

  const empty = weekBookings.length ? "" :
    `<div class="monitor-empty-state monitor-grid-empty">Aucune seance cette semaine.</div>`;

  grid.innerHTML = dayColumns + hourLines + nowLine + empty;
}

function renderSelectedBooking(bookings) {
  const b     = bookings.find(b => b._id === selectedBookingId);
  const panel = document.getElementById("selected-booking-panel");
  if (!b) {
    panel.innerHTML = `<div class="monitor-empty-state">Selectionnez une seance dans le calendrier.</div>`;
    return;
  }

  const studentKey = getStudentKey(b);
  const studentHistory = bookings
    .filter(item => getStudentKey(item) === studentKey)
    .slice()
    .sort((a, b) => parseBookingDateTime(b) - parseBookingDateTime(a))
    .slice(0, 8);

  const now = new Date();
  const historyHtml = studentHistory.length ? `
    <div class="monitor-booking-history" style="margin-top:18px;">
      <strong>Historique de l'eleve</strong>
      <div class="history-list" style="margin-top:12px;">
        ${studentHistory.map(item => {
          const dt = parseBookingDateTime(item);
          const badgeClass = dt < now ? "badge-success" : "badge-primary";
          const badgeLabel = dt < now ? "Terminee" : "A venir";
          const day = String(dt.getDate()).padStart(2,"0");
          const monthLabel = formatHistoryMonthLabel(dt);
          return `
            <article class="history-item" role="button" tabindex="0"
              onclick="selectBooking('${escapeAttribute(item._id)}','${escapeAttribute(item.date)}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectBooking('${escapeAttribute(item._id)}','${escapeAttribute(item.date)}')}"
            >
              <div class="history-date">
                <span>${day}</span>
                <small>${escapeHtml(monthLabel)}</small>
              </div>
              <div class="history-content">
                <h3>${escapeHtml(item.typeLabel || "Seance")}</h3>
                <p>Emplacement : ${escapeHtml(item.place || "Non renseigne")}</p>
              </div>
              <span class="badge ${badgeClass}">${badgeLabel}</span>
            </article>`;
        }).join("")}
      </div>
    </div>` : `
    <div class="monitor-booking-history" style="margin-top:18px;">
      <strong>Historique de l'eleve</strong>
      <div class="monitor-empty-state" style="margin-top:12px;">Aucune seance pour le moment.</div>
    </div>`;

  panel.innerHTML = `
    <article class="monitor-booking-detail">
      <h3>${escapeHtml(getStudentName(b))}</h3>
      <p class="monitor-detail-sub">${formatLongDate(b.date)} a ${b.time}</p>
      <div class="monitor-booking-meta">
        <span><strong>Telephone :</strong> ${escapeHtml(b.studentPhone||"Non renseigne")}</span>
        <span><strong>Email :</strong> ${escapeHtml(b.studentEmail||"Non renseigne")}</span>
      </div>
      <div class="monitor-booking-location">
        <strong>Adresse saisie par le client</strong>
        <p><a class="planning-place-link" href="${escapeAttribute(getMapsUrl(b))}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.place||"Aucune adresse")}</a></p>
      </div>
      <div class="monitor-booking-note">
        <strong>Note</strong>
        <p>${escapeHtml(b.note||"Aucune note.")}</p>
      </div>
      ${historyHtml}
      <button class="btn btn-outline btn-sm" type="button" onclick="cancelBooking('${b._id}')">Annuler la seance</button>
    </article>`;
}

function renderDayBookings(bookings) {
  const container   = document.getElementById("day-bookings-list");
  const dayBookings = bookings.filter(b => b.date === selectedDayKey);
  if (!dayBookings.length) {
    container.innerHTML = `<div class="monitor-empty-state">Aucune seance pour ce jour.</div>`;
    return;
  }
  container.innerHTML = dayBookings.map(b => `
    <button class="monitor-day-item ${b._id===selectedBookingId?"active":""}" type="button" onclick="selectBooking('${b._id}','${b.date}')">
      <strong>${b.time}</strong>
      <span>${escapeHtml(getStudentName(b))}</span>
      <small>${escapeHtml(b.studentPhone||"Non renseigne")}</small>
    </button>`).join("");
}

function renderCandidateWindow(bookings) {
  const existing = document.getElementById("candidate-popover");
  if (existing) existing.remove();
  if (!openedCandidateId) return;
  const b = bookings.find(b => b._id === openedCandidateId);
  if (!b) { openedCandidateId = ""; return; }
  document.body.insertAdjacentHTML("beforeend", `
    <div class="candidate-popover" id="candidate-popover" role="dialog" aria-modal="false" aria-labelledby="candidate-popover-title">
      <div class="candidate-popover-head">
        <h2 id="candidate-popover-title">${escapeHtml(getStudentName(b))}</h2>
        <button type="button" aria-label="Fermer" onclick="closeCandidateWindow(event)">x</button>
      </div>
      <dl class="candidate-contact-list">
        <div><dt>Telephone</dt><dd>${escapeHtml(b.studentPhone||"Non renseigne")}</dd></div>
        <div><dt>Email</dt><dd>${escapeHtml(b.studentEmail||"Non renseigne")}</dd></div>
        <div><dt>Adresse</dt><dd><a href="${escapeAttribute(getMapsUrl(b))}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.place||"Non renseignee")}</a></dd></div>
      </dl>
    </div>`);
}

function selectDay(dayKey) {
  selectedDayKey = dayKey;
  const dayBookings = getBookings().filter(b => b.date === dayKey);
  if (dayBookings.length && !dayBookings.some(b => b._id === selectedBookingId)) {
    selectedBookingId = dayBookings[0]._id;
  }
  renderAll();
}
function selectBooking(bookingId, dayKey) {
  selectedBookingId = bookingId;
  selectedDayKey    = dayKey;
  renderAll();
}
function openCandidateWindow(bookingId, event) {
  if (event) event.stopPropagation();
  openedCandidateId = openedCandidateId === bookingId ? "" : bookingId;
  selectedBookingId = bookingId;
  const b = getBookings().find(b => b._id === bookingId);
  if (b) selectedDayKey = b.date;
  renderAll();
}
function closeCandidateWindow(event) {
  if (event) event.stopPropagation();
  openedCandidateId = "";
  renderAll();
}
function cancelBooking(bookingId) {
  if (isApiMode()) {
    Api.delete(`/bookings/${bookingId}`)
      .then(async () => {
        await refreshApiBookings();
        const hydrated = getBookings();
        if (!hydrated.some(b => b._id === selectedBookingId)) selectedBookingId = hydrated[0]?._id || "";
        renderAll();
        Toast.success("Seance annulee.");
      })
      .catch((error) => Toast.error(error.message));
    return;
  }

  const bookings = getStoredBookings().filter(b => getBookingId(b) !== bookingId);
  saveStoredBookings(bookings);
  const hydrated = getBookings();
  if (!hydrated.some(b => b._id === selectedBookingId)) selectedBookingId = hydrated[0]?._id || "";
  renderAll();
  Toast.success("Seance annulee.");
}

function renderAll() {
  const bookings = getBookings();
  const weekEnd  = new Date(weekCursor);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekBookings = bookings.filter(b => {
    const d = new Date(`${b.date}T12:00:00`);
    return d >= weekCursor && d < weekEnd;
  });
  const selDate = new Date(`${selectedDayKey}T12:00:00`);
  if (selDate < weekCursor || selDate >= weekEnd) selectedDayKey = formatDateKey(weekCursor);
  if (!weekBookings.some(b => b._id === selectedBookingId)) {
    selectedBookingId = weekBookings.find(b => b.date === selectedDayKey)?._id || weekBookings[0]?._id || "";
  }
  renderSummary(bookings);
  renderCalendar(bookings);
  renderSelectedBooking(bookings);
  renderDayBookings(bookings);
  renderCandidateWindow(bookings);
}

document.getElementById("prev-week-btn").addEventListener("click", () => {
  weekCursor.setDate(weekCursor.getDate() - 7);
  selectedDayKey = formatDateKey(weekCursor); selectedBookingId = ""; renderAll();
});
document.getElementById("next-week-btn").addEventListener("click", () => {
  weekCursor.setDate(weekCursor.getDate() + 7);
  selectedDayKey = formatDateKey(weekCursor); selectedBookingId = ""; renderAll();
});

const monitorUser = Auth.get() || {};
if (monitorUser.firstName || monitorUser.lastName) {
  const el = document.getElementById("monitor-name-label");
  if (el) el.textContent = `${monitorUser.firstName||""} ${monitorUser.lastName||""}`.trim();
}
if (monitorUser.formation) {
  const el = document.getElementById("monitor-formation-badge");
  if (el) el.textContent = monitorUser.formation;
}
document.getElementById("monitor-logout-link").addEventListener("click", () => Auth.clear());

async function initializeMonitorDashboard() {
  if (isApiMode()) {
    try {
      await refreshApiBookings();
    } catch (error) {
      Toast.error(error.message || "Impossible de charger les seances.");
    }

    renderAll();

    window.setInterval(() => {
      refreshApiBookings().then(renderAll).catch(() => {});
    }, 5000);

    window.addEventListener("focus", () => {
      refreshApiBookings().then(renderAll).catch(() => {});
    });

    return;
  }

  renderAll();

  let storageRefreshTimer = null;
  window.addEventListener("storage", event => {
    if (event.key !== BOOKINGS_KEY) return;
    if (storageRefreshTimer) clearTimeout(storageRefreshTimer);
    storageRefreshTimer = setTimeout(() => { storageRefreshTimer = null; renderAll(); }, 50);
  });
}

initializeMonitorDashboard();