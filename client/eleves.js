 const BOOKINGS_KEY = "citydrive_client_bookings";

    function getStoredBookings() {
      try {
        return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
      } catch {
        return [];
      }
    }

    function getStudentsFromBookings() {
      const map = new Map();
      getStoredBookings().forEach((booking) => {
        const key = `${booking.studentFirstName || ""}|${booking.studentLastName || ""}|${booking.studentPhone || ""}`;
        if (!map.has(key)) {
          map.set(key, {
            firstName: booking.studentFirstName || "Jean",
            lastName: booking.studentLastName || "Dupont",
            phone: booking.studentPhone || "Non renseigne",
            email: booking.studentEmail || "Non renseigne",
            latestPlace: booking.place || "Non renseigne"
          });
        }
      });
      return Array.from(map.values()).sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    }

    function renderStudents() {
      const students = getStudentsFromBookings();
      const list = document.getElementById("students-list");
      const badge = document.getElementById("students-total-badge");
      badge.textContent = `${students.length} eleve${students.length > 1 ? "s" : ""}`;

      if (!students.length) {
        list.innerHTML = `<div class="monitor-empty-state">Aucun eleve avec reservation pour le moment.</div>`;
        return;
      }

      list.innerHTML = students.map((student) => `
        <article class="monitor-booking-item">
          <div class="monitor-booking-date">
            <span>${student.firstName.charAt(0)}${student.lastName.charAt(0)}</span>
            <small>Eleve</small>
          </div>
          <div class="monitor-booking-content">
            <div class="monitor-booking-top">
              <div>
                <h3>${student.firstName} ${student.lastName}</h3>
                <p>Contact direct de l'eleve</p>
              </div>
              <span class="badge badge-accent">Actif</span>
            </div>
            <div class="monitor-booking-meta">
              <span><strong>Telephone :</strong> ${student.phone}</span>
              <span><strong>Email :</strong> ${student.email}</span>
            </div>
            <div class="monitor-booking-location">
              <strong>Dernier lieu saisi</strong>
              <p>${student.latestPlace}</p>
            </div>
          </div>
          <div class="monitor-booking-actions">
            <a class="btn btn-outline btn-sm" href="tel:${student.phone !== "Non renseigne" ? student.phone : ""}">Appeler</a>
          </div>
        </article>
      `).join("");
    }

    const monitorUser = Auth.get() || {};
    if (monitorUser && (monitorUser.firstName || monitorUser.lastName)) {
      document.getElementById("students-monitor-name-label").textContent = `${monitorUser.firstName || ""} ${monitorUser.lastName || ""}`.trim();
    }
    if (monitorUser && monitorUser.formation) {
      document.getElementById("students-monitor-formation-badge").textContent = monitorUser.formation;
    }

    document.getElementById("students-logout-link").addEventListener("click", function () {
      Auth.clear();
    });

    renderStudents();