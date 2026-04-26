function formatDate(dateValue) {
  if (!dateValue) return "Non renseigne";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Non renseigne";
  return date.toLocaleDateString("fr-FR");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function fetchStudentsByMonitor(monitorId) {
  try {
    const query = monitorId ? `?monitorId=${encodeURIComponent(monitorId)}` : "";
    let data;

    if (window.Api && typeof window.Api.get === "function") {
      data = await window.Api.get(`/students${query}`);
    } else {
      const response = await fetch(`http://localhost:4000/api/students${query}`);
      data = await response.json().catch(() => []);
      if (!response.ok) {
        throw new Error("Erreur API");
      }
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur de chargement des candidats:", error);
    if (window.Toast && typeof window.Toast.error === "function") {
      window.Toast.error("Impossible de charger les candidats.");
    }
    return [];
  }
}

async function fetchStudents() {
  const monitorUser = window.Auth && typeof window.Auth.get === "function" ? (window.Auth.get() || {}) : {};
  const monitorId = Number.parseInt(monitorUser.id, 10);

  if (Number.isNaN(monitorId)) {
    return [];
  }

  return fetchStudentsByMonitor(monitorId);
}

function renderStudents(students) {
  const list = document.getElementById("students-list");
  const badge = document.getElementById("students-total-badge");
  if (!list || !badge) return;

  badge.textContent = `${students.length} candidat${students.length > 1 ? "s" : ""}`;

  if (!students.length) {
    list.innerHTML = `<div class="monitor-empty-state">Aucun candidat reserve pour le moment.</div>`;
    return;
  }

  list.innerHTML = students
    .map((student) => {
      const fullName = student.nom || "Nom inconnu";
      const safeFullName = escapeHtml(fullName);
      const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "?";
      const phone = student.telephone || "Non renseigne";
      const email = student.email || "Non renseigne";
      const safePhone = escapeHtml(phone);
      const safeEmail = escapeHtml(email);
      const bookingCount = Number(student.booking_count || 0);
      const lastLesson = formatDate(student.last_lesson_date);
      const safeLastLesson = escapeHtml(lastLesson);

      return `
      <article class="monitor-booking-item">
        <div class="monitor-booking-date">
          <span>${escapeHtml(initials)}</span>
          <small>Eleve</small>
        </div>
        <div class="monitor-booking-content">
          <div class="monitor-booking-top">
            <div>
              <h3>${safeFullName}</h3>
              <p>Contact direct du candidat</p>
            </div>
            <span class="badge badge-accent">Actif</span>
          </div>
          <div class="monitor-booking-meta">
            <span><strong>Telephone :</strong> ${safePhone}</span>
            <span><strong>Email :</strong> ${safeEmail}</span>
          </div>
          <div class="monitor-booking-location">
            <strong>Derniere seance</strong>
            <p>${safeLastLesson}</p>
          </div>
          <div class="monitor-booking-count">
            <strong>Nombre de reservations :</strong>
            <p>${bookingCount}</p>
          </div>
        </div>
        <div class="monitor-booking-actions">
          <a class="btn btn-outline btn-sm" href="tel:${phone !== "Non renseigne" ? encodeURIComponent(phone) : ""}">Appeler</a>
          <button class="btn btn-outline btn-sm student-email-btn" data-email="${safeEmail}">Envoyer un email</button>
        </div>
      </article>
      `;
    })
    .join("");

  list.querySelectorAll(".student-email-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const email = button.getAttribute("data-email") || "";
      sendEmailToStudent(email);
    });
  });
}

function sendEmailToStudent(email) {
  if (email && email !== "Non renseigne") {
    window.location.href = `mailto:${encodeURIComponent(email)}`;
  }
}

async function initPage() {
  const students = await fetchStudents();
  console.log(students);
  renderStudents(students);

  const logoutLink = document.getElementById("students-logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function () {
      if (window.Auth && typeof window.Auth.clear === "function") {
        window.Auth.clear();
      }
    });
  }
}

window.initPage = initPage;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.initPage();
  });
} else {
  window.initPage();
}
