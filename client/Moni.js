 const BOOKINGS_KEY = "citydrive_client_bookings";
    const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    let weekCursor = getStartOfWeek(new Date());
    let selectedBookingId = "";
    let selectedDayKey = formatDateKey(new Date());

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
      return `${booking.date}_${booking.time}_${booking.studentPhone || ""}_${booking.place || ""}`;
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

      document.getElementById("today-count").textContent = todayCount;
      document.getElementById("week-count").textContent = weekCount;
      document.getElementById("student-count").textContent = students.size;
      document.getElementById("booking-total-badge").textContent = `${bookings.length} seance${bookings.length > 1 ? "s" : ""}`;
    }

    function renderCalendar(bookings) {
      const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekCursor);
        date.setDate(weekCursor.getDate() + index);
        return date;
      });

      document.getElementById("week-label").textContent = formatWeekRange(weekCursor);
      document.getElementById("calendar-header").innerHTML = weekDates.map((date) => {
        const key = formatDateKey(date);
        const active = key === selectedDayKey ? "active-day" : "";
        return `<button class="${active}" type="button" onclick="selectDay('${key}')">${DAY_NAMES[indexOfDate(weekDates, key)]} ${String(date.getDate()).padStart(2, "0")}</button>`;
      }).join("");

      const grid = document.getElementById("calendar-grid");
      const weekBookings = bookings.filter((booking) => {
        const bookingDate = new Date(`${booking.date}T12:00:00`);
        const weekEnd = new Date(weekCursor);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return bookingDate >= weekCursor && bookingDate < weekEnd;
      });

      if (!weekBookings.length) {
        grid.innerHTML = `<div class="monitor-empty-state monitor-grid-empty">Aucune seance dans cette semaine.</div>`;
        return;
      }

      grid.innerHTML = weekBookings.map((booking) => {
        const bookingDate = new Date(`${booking.date}T12:00:00`);
        const dayIndex = Math.round((bookingDate - weekCursor) / 86400000) + 1;
        const hour = Number((booking.time || "08:00").split(":")[0]);
        const startRow = Math.max(1, Math.min(10, hour - 6));
        const selected = booking._id === selectedBookingId ? "selected" : "";

        return `
          <button
            class="exam-card exam-card-client ${selected}"
            style="grid-column:${dayIndex}; grid-row:${startRow} / span 2;"
            type="button"
            onclick="selectBooking('${booking._id}', '${booking.date}')"
          >
            <span class="exam-time">${booking.time || "--:--"}</span>
            <strong>${booking.studentFirstName || "Client"} ${booking.studentLastName || ""}</strong>
            <span>${booking.place || "Lieu non renseigne"}</span>
          </button>
        `;
      }).join("");
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

    function renderSelectedBooking(bookings) {
      const selectedBooking = bookings.find((booking) => booking._id === selectedBookingId);
      const panel = document.getElementById("selected-booking-panel");

      if (!selectedBooking) {
        panel.innerHTML = `<div class="monitor-empty-state">Selectionnez une seance dans le calendrier.</div>`;
        return;
      }

      panel.innerHTML = `
        <article class="monitor-booking-detail">
          <h3>${selectedBooking.studentFirstName || "Client"} ${selectedBooking.studentLastName || ""}</h3>
          <p class="monitor-detail-sub">${formatLongDate(selectedBooking.date)} a ${selectedBooking.time}</p>
          <div class="monitor-booking-meta">
            <span><strong>Telephone :</strong> ${selectedBooking.studentPhone || "Non renseigne"}</span>
            <span><strong>Email :</strong> ${selectedBooking.studentEmail || "Non renseigne"}</span>
          </div>
          <div class="monitor-booking-location">
            <strong>Lieu saisi par le client</strong>
            <p>${selectedBooking.place || "Aucun lieu renseigne"}</p>
          </div>
          <div class="monitor-booking-note">
            <strong>Note</strong>
            <p>${selectedBooking.note || "Aucune note."}</p>
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
          <span>${booking.studentFirstName || "Client"} ${booking.studentLastName || ""}</span>
          <small>${booking.studentPhone || "Non renseigne"}</small>
        </button>
      `).join("");
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

      if (!weekBookings.some((booking) => booking.date === selectedDayKey)) {
        selectedDayKey = formatDateKey(weekCursor);
      }
      if (!weekBookings.some((booking) => booking._id === selectedBookingId)) {
        selectedBookingId = weekBookings.find((booking) => booking.date === selectedDayKey)?._id || weekBookings[0]?._id || "";
      }

      renderSummary(bookings);
      renderCalendar(bookings);
      renderSelectedBooking(bookings);
      renderDayBookings(bookings);
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
      document.getElementById("monitor-name-label").textContent = `${monitorUser.firstName || ""} ${monitorUser.lastName || ""}`.trim();
    }
    if (monitorUser && monitorUser.formation) {
      document.getElementById("monitor-formation-badge").textContent = monitorUser.formation;
    }

    document.getElementById("monitor-logout-link").addEventListener("click", function () {
      Auth.clear();
    });

    renderAll();