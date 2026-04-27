 const BOOKINGS_KEY = "EduCar_client_bookings";
    const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const DAY_START_HOUR = 7;
    const DAY_END_HOUR = 19;
    const HOUR_ROW_HEIGHT = 72;
    let weekCursor = getStartOfWeek(new Date());
    let selectedBookingId = "";
    let selectedDayKey = formatDateKey(new Date());
    let openedCandidateId = "";

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

    function formatDateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function getStartOfWeek(date) {
      const output = new Date(date);
      const offset = (output.getDay() + 6) % 7;
      output.setDate(output.getDate() - offset);
      output.setHours(0, 0, 0, 0);
      return output;
    }

    function formatWeekRange(startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      const startLabel = startDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
      const endLabel = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      return `${startLabel} - ${endLabel}`;
    }

    function formatLongDate(dateKey) {
      return new Date(`${dateKey}T12:00:00`).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    }

    function getBookingId(booking) {
      return encodeURIComponent(`${booking.date}_${booking.time}_${booking.studentId || ""}_${booking.studentPhone || ""}`);
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
      return escapeHtml(value).replace(/`/g, "&#096;");
    }

    function getStudentName(booking) {
      return `${booking.studentFirstName || "Candidat"} ${booking.studentLastName || ""}`.trim();
    }

    function getMapsUrl(booking) {
      if (booking.mapsUrl) return booking.mapsUrl;
      if (booking.place && booking.place.startsWith("http")) return booking.place;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.place || "EduCar Tunis")}`;
    }

    function getBookingStartMinutes(booking) {
      const [hour = "08", minute = "00"] = String(booking.time || "08:00").split(":");
      return (Number(hour) - DAY_START_HOUR) * 60 + Number(minute);
    }

    function getBookingDurationMinutes(booking) {
      const duration = String(booking.duration || booking.typeLabel || "");
      const hourMatch = duration.match(/(\d+(?:[.,]\d+)?)\s*h/i);
      if (hourMatch) {
        return Math.max(45, Number(hourMatch[1].replace(",", ".")) * 60);
      }
      return booking.typeId === "2h" ? 120 : 60;
    }

    function getBookings() {
      return getStoredBookings()
        .map((booking) => ({ ...booking, _id: getBookingId(booking) }))
        .sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`));
    }

    function renderSummary(bookings) {
      const todayKey = formatDateKey(new Date());
      const weekStart = new Date(weekCursor);
      const weekEnd = new Date(weekCursor);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const todayCount = bookings.filter((booking) => booking.date === todayKey).length;
      const weekCount = bookings.filter((booking) => {
        const bookingDate = new Date(`${booking.date}T12:00:00`);
        return bookingDate >= weekStart && bookingDate < weekEnd;
      }).length;
      const students = new Set(bookings.map((booking) => `${booking.studentFirstName || ""}|${booking.studentLastName || ""}|${booking.studentPhone || ""}`));

      const todayCountEl = document.getElementById("today-count");
      const weekCountEl = document.getElementById("week-count");
      const studentCountEl = document.getElementById("student-count");
      if (todayCountEl) todayCountEl.textContent = todayCount;
      if (weekCountEl) weekCountEl.textContent = weekCount;
      if (studentCountEl) studentCountEl.textContent = students.size;
      document.getElementById("booking-total-badge").textContent = `${bookings.length} seance${bookings.length > 1 ? "s" : ""}`;
    }

    function renderCalendar(bookings) {
      const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekCursor);
        date.setDate(weekCursor.getDate() + index);
        return date;
      });

      const todayKey = formatDateKey(new Date());
      document.getElementById("week-label").textContent = formatWeekRange(weekCursor);
      document.getElementById("calendar-header").innerHTML = `<div class="monitor-header-spacer"></div>` + weekDates.map((date) => {
        const key = formatDateKey(date);
        const active = key === selectedDayKey ? "active-day" : "";
        const today = key === todayKey ? "is-today" : "";
        return `<button class="${active} ${today}" type="button" onclick="selectDay('${key}')">${DAY_NAMES[indexOfDate(weekDates, key)]} ${String(date.getDate()).padStart(2, "0")}</button>`;
      }).join("");

      const grid = document.getElementById("calendar-grid");
      grid.style.setProperty("--monitor-hour-row", `${HOUR_ROW_HEIGHT}px`);
      grid.style.setProperty("--monitor-hour-count", DAY_END_HOUR - DAY_START_HOUR);
      const weekBookings = bookings.filter((booking) => {
        const bookingDate = new Date(`${booking.date}T12:00:00`);
        const weekEnd = new Date(weekCursor);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return bookingDate >= weekCursor && bookingDate < weekEnd;
      });

      const hourLines = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, index) => {
        const hour = DAY_START_HOUR + index;
        return `
          <div class="monitor-time-label" style="top:${index * HOUR_ROW_HEIGHT}px">${String(hour).padStart(2, "0")}:00</div>
          <div class="monitor-hour-line" style="top:${index * HOUR_ROW_HEIGHT}px"></div>
        `;
      }).join("");
      const dayColumns = weekDates.map((date, index) => {
        const today = formatDateKey(date) === todayKey ? "is-today" : "";
        return `<div class="monitor-day-column ${today}" style="grid-column:${index + 2};"></div>`;
      }).join("");

      const now = new Date();
      const showNowLine = now >= weekCursor && now < new Date(weekCursor.getFullYear(), weekCursor.getMonth(), weekCursor.getDate() + 7);
      const nowMinutes = (now.getHours() - DAY_START_HOUR) * 60 + now.getMinutes();
      const nowLine = showNowLine && nowMinutes >= 0 && nowMinutes <= (DAY_END_HOUR - DAY_START_HOUR) * 60
        ? `<div class="monitor-now-line" style="top:${(nowMinutes / 60) * HOUR_ROW_HEIGHT}px"></div>`
        : "";

      const bookingCards = weekBookings.map((booking) => {
        const bookingDate = new Date(`${booking.date}T12:00:00`);
        const dayIndex = Math.round((bookingDate - weekCursor) / 86400000) + 1;
        const startMinutes = Math.max(0, Math.min(getBookingStartMinutes(booking), (DAY_END_HOUR - DAY_START_HOUR) * 60 - 30));
        const durationMinutes = getBookingDurationMinutes(booking);
        const top = (startMinutes / 60) * HOUR_ROW_HEIGHT;
        const height = Math.max(62, (durationMinutes / 60) * HOUR_ROW_HEIGHT - 10);
        const selected = booking._id === selectedBookingId ? "selected" : "";
        const mapsUrl = escapeAttribute(getMapsUrl(booking));
        const place = escapeHtml(booking.place || "Adresse non renseignee");
        const studentName = escapeHtml(getStudentName(booking));

        return `
          <article
            class="exam-card exam-card-client ${selected}"
            style="grid-column:${dayIndex + 1}; top:${top}px; height:${height}px;"
            onclick="selectBooking('${escapeAttribute(booking._id)}', '${booking.date}')"
          >
            <span class="exam-time">${booking.time || "--:--"}</span>
            <a class="exam-location-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${place}</a>
            <button class="exam-candidate-name" type="button" onclick="openCandidateWindow('${escapeAttribute(booking._id)}', event)">${studentName}</button>
          </article>
        `;
      }).join("");

      const emptyState = weekBookings.length
        ? ""
        : `<div class="monitor-empty-state monitor-grid-empty">Aucune seance dans cette semaine.</div>`;

      grid.innerHTML = dayColumns + hourLines + nowLine + bookingCards + emptyState;
    }

    function indexOfDate(weekDates, key) {
      return weekDates.findIndex((date) => formatDateKey(date) === key);
    }

    function selectDay(dayKey) {
      selectedDayKey = dayKey;
      const dayBookings = getBookings().filter((booking) => booking.date === dayKey);
      if (dayBookings.length && !dayBookings.some((booking) => booking._id === selectedBookingId)) {
        selectedBookingId = dayBookings[0]._id;
      }
      renderAll();
    }

    function selectBooking(bookingId, dayKey) {
      selectedBookingId = bookingId;
      selectedDayKey = dayKey;
      renderAll();
    }

    function openCandidateWindow(bookingId, event) {
      if (event) event.stopPropagation();
      openedCandidateId = openedCandidateId === bookingId ? "" : bookingId;
      selectedBookingId = bookingId;
      const booking = getBookings().find((item) => item._id === bookingId);
      if (booking) selectedDayKey = booking.date;
      renderAll();
    }

    function closeCandidateWindow(event) {
      if (event) event.stopPropagation();
      openedCandidateId = "";
      renderAll();
    }

    function renderSelectedBooking(bookings) {
      const selectedBooking = bookings.find((booking) => booking._id === selectedBookingId);
      const panel = document.getElementById("selected-booking-panel");

      if (!selectedBooking) {
        panel.innerHTML = `<div class="monitor-empty-state">Selectionnez une seance dans le calendrier.</div>`;
        return;
      }

      panel.innerHTML = `
        <article class="monitor-booking-detail">
          <h3>${escapeHtml(getStudentName(selectedBooking))}</h3>
          <p class="monitor-detail-sub">${formatLongDate(selectedBooking.date)} a ${selectedBooking.time}</p>
          <div class="monitor-booking-meta">
            <span><strong>Telephone :</strong> ${escapeHtml(selectedBooking.studentPhone || "Non renseigne")}</span>
            <span><strong>Email :</strong> ${escapeHtml(selectedBooking.studentEmail || "Non renseigne")}</span>
          </div>
          <div class="monitor-booking-location">
            <strong>Adresse saisie par le client</strong>
            <p><a class="planning-place-link" href="${escapeAttribute(getMapsUrl(selectedBooking))}" target="_blank" rel="noopener noreferrer">${escapeHtml(selectedBooking.place || "Aucune adresse renseignee")}</a></p>
          </div>
          <div class="monitor-booking-note">
            <strong>Note</strong>
            <p>${escapeHtml(selectedBooking.note || "Aucune note.")}</p>
          </div>
          <button class="btn btn-outline btn-sm" type="button" onclick="cancelBooking('${selectedBooking._id}')">Annuler la seance</button>
        </article>
      `;
    }

    function renderDayBookings(bookings) {
      const container = document.getElementById("day-bookings-list");
      const dayBookings = bookings.filter((booking) => booking.date === selectedDayKey);

      if (!dayBookings.length) {
        container.innerHTML = `<div class="monitor-empty-state">Aucune seance pour ce jour.</div>`;
        return;
      }

      container.innerHTML = dayBookings.map((booking) => `
        <button class="monitor-day-item ${booking._id === selectedBookingId ? "active" : ""}" type="button" onclick="selectBooking('${booking._id}', '${booking.date}')">
          <strong>${booking.time}</strong>
          <span>${escapeHtml(getStudentName(booking))}</span>
          <small>${escapeHtml(booking.studentPhone || "Non renseigne")}</small>
        </button>
      `).join("");
    }

    function renderCandidateWindow(bookings) {
      const existing = document.getElementById("candidate-popover");
      if (existing) existing.remove();
      if (!openedCandidateId) return;

      const booking = bookings.find((item) => item._id === openedCandidateId);
      if (!booking) {
        openedCandidateId = "";
        return;
      }

      document.body.insertAdjacentHTML("beforeend", `
        <div class="candidate-popover" id="candidate-popover" role="dialog" aria-modal="false" aria-labelledby="candidate-popover-title">
          <div class="candidate-popover-head">
            <h2 id="candidate-popover-title">${escapeHtml(getStudentName(booking))}</h2>
            <button type="button" aria-label="Fermer" onclick="closeCandidateWindow(event)">x</button>
          </div>
          <dl class="candidate-contact-list">
            <div><dt>Telephone</dt><dd>${escapeHtml(booking.studentPhone || "Non renseigne")}</dd></div>
            <div><dt>Email</dt><dd>${escapeHtml(booking.studentEmail || "Non renseigne")}</dd></div>
            <div><dt>Adresse</dt><dd><a href="${escapeAttribute(getMapsUrl(booking))}" target="_blank" rel="noopener noreferrer">${escapeHtml(booking.place || "Non renseignee")}</a></dd></div>
          </dl>
        </div>
      `);
    }

    function cancelBooking(bookingId) {
      const bookings = getStoredBookings().filter((booking) => getBookingId(booking) !== bookingId);
      saveStoredBookings(bookings);
      const hydrated = getBookings();
      if (!hydrated.some((booking) => booking._id === selectedBookingId)) {
        selectedBookingId = hydrated[0]?._id || "";
      }
      renderAll();
      Toast.success("Seance annulee.");
    }

    function renderAll() {
      const bookings = getBookings();
      const weekBookings = bookings.filter((booking) => {
        const bookingDate = new Date(`${booking.date}T12:00:00`);
        const weekEnd = new Date(weekCursor);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return bookingDate >= weekCursor && bookingDate < weekEnd;
      });

      const selectedDate = new Date(`${selectedDayKey}T12:00:00`);
      const weekEnd = new Date(weekCursor);
      weekEnd.setDate(weekEnd.getDate() + 7);

      if (selectedDate < weekCursor || selectedDate >= weekEnd) {
        selectedDayKey = formatDateKey(weekCursor);
      }
      if (!weekBookings.some((booking) => booking._id === selectedBookingId)) {
        selectedBookingId = weekBookings.find((booking) => booking.date === selectedDayKey)?._id || weekBookings[0]?._id || "";
      }

      renderSummary(bookings);
      renderCalendar(bookings);
      renderSelectedBooking(bookings);
      renderDayBookings(bookings);
      renderCandidateWindow(bookings);
    }

    document.getElementById("prev-week-btn").addEventListener("click", function () {
      weekCursor.setDate(weekCursor.getDate() - 7);
      selectedDayKey = formatDateKey(weekCursor);
      selectedBookingId = "";
      renderAll();
    });

    document.getElementById("next-week-btn").addEventListener("click", function () {
      weekCursor.setDate(weekCursor.getDate() + 7);
      selectedDayKey = formatDateKey(weekCursor);
      selectedBookingId = "";
      renderAll();
    });

    const monitorUser = Auth.get() || {};
    if (monitorUser && (monitorUser.firstName || monitorUser.lastName)) {
      const monitorNameLabel = document.getElementById("monitor-name-label");
      if (monitorNameLabel) monitorNameLabel.textContent = `${monitorUser.firstName || ""} ${monitorUser.lastName || ""}`.trim();
    }
    if (monitorUser && monitorUser.formation) {
      document.getElementById("monitor-formation-badge").textContent = monitorUser.formation;
    }

     document.getElementById("monitor-logout-link").addEventListener("click", function () {
       Auth.clear();
     });

     renderAll();

     let storageRefreshTimer = null;
     window.addEventListener("storage", function (event) {
       if (event.key !== BOOKINGS_KEY) return;
       if (storageRefreshTimer) clearTimeout(storageRefreshTimer);
       storageRefreshTimer = setTimeout(() => {
         storageRefreshTimer = null;
         renderAll();
       }, 50);
     });
