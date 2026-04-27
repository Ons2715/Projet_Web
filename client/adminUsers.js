let adminUsers = [];

function ensureAdmin() {
  const user = Auth.get();
  if (!user || (user.role !== "admin" && user.serverRole !== "admin")) {
    Toast.error("Acces reserve a l'administrateur.");
    location.href = "login.html";
  }
}

function getMonitorForFormation(formationId) {
  if (String(formationId) === "3" || String(formationId) === "4") {
    const monitor = adminUsers.find((user) => user.role === "moniteur" && String(user.id_formation) === String(formationId));
    return monitor ? monitor.nom : "Aucun moniteur affecte";
  }

  const car = String(formationId) === "2" ? "Kia Picanto" : "Renault Clio";
  const monitor = adminUsers.find((user) => user.role === "moniteur" && user.voiture === car);
  return monitor ? monitor.nom : `Moniteur ${car} non ajoute`;
}

function updateFormByRole() {
  const isMonitor = document.getElementById("admin-role").value === "moniteur";
  document.getElementById("car-group").hidden = !isMonitor;
  document.getElementById("formation-group").hidden = false;
  document.getElementById("assigned-monitor-group").hidden = isMonitor;
  document.querySelectorAll(".admin-profile-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === document.getElementById("admin-role").value);
  });
  updateAssignedMonitorPreview();
}

function updateAssignedMonitorPreview() {
  const input = document.getElementById("assigned-monitor");
  if (!input || document.getElementById("assigned-monitor-group").hidden) {
    return;
  }

  input.value = getMonitorForFormation(document.getElementById("admin-formation").value);
}

function openUserModal() {
  document.getElementById("user-modal").classList.add("open");
  updateFormByRole();
}

function closeUserModal() {
  document.getElementById("user-modal").classList.remove("open");
}

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.charAt(0) || ""}${parts[1]?.charAt(0) || ""}`.toUpperCase() || "EC";
}

function userPhotoCell(user) {
  const photo = user.photo || user.avatar || ProfilePhotos.get(user.email);
  if (photo) {
    return `<div class="admin-user-photo"><img src="${photo}" alt="Photo de profil" /></div>`;
  }
  return `<div class="admin-user-photo">${getInitials(user.nom)}</div>`;
}

function formatHours(user) {
  if (user.role !== "eleve") return "-";
  const done = user.heures_effectuees ?? 0;
  const total = user.heures_totales ?? "-";
  return `${done} / ${total} h`;
}

function renderUsers() {
  const searchTerm = document.getElementById("user-search").value.trim().toLowerCase();
  const users = adminUsers.filter((user) => {
    const matchesSearch = !searchTerm ||
      String(user.nom || "").toLowerCase().includes(searchTerm) ||
      String(user.email || "").toLowerCase().includes(searchTerm);
    return matchesSearch;
  });
  const students = users.filter((user) => user.role === "eleve");
  const monitors = users.filter((user) => user.role === "moniteur");

  document.getElementById("students-count").textContent = students.length;
  document.getElementById("monitors-count").textContent = monitors.length;

  document.getElementById("students-table-body").innerHTML = students.length ? students.map((user) => `
    <tr>
      <td>${userPhotoCell(user)}</td>
      <td>${user.nom || "-"}</td>
      <td>${user.email || "-"}</td>
      <td>${user.telephone || "-"}</td>
      <td>${user.formation_nom || "Aucune formation"}</td>
      <td><span class="badge badge-accent">${formatHours(user)}</span></td>
      <td>${user.encadre_par || "Aucun moniteur"}</td>
      <td>${user.date_creation ? new Date(user.date_creation).toLocaleDateString("fr-FR") : "-"}</td>
      <td><button class="btn btn-outline btn-sm" type="button" onclick="deleteUserAccount(${user.id}, '${String(user.nom || "").replace(/'/g, "\\'")}')">Supprimer</button></td>
    </tr>
  `).join("") : `<tr><td colspan="9"><div class="admin-empty">Aucun candidat trouve.</div></td></tr>`;

  document.getElementById("monitors-table-body").innerHTML = monitors.length ? monitors.map((user) => `
    <tr>
      <td>${userPhotoCell(user)}</td>
      <td>${user.nom || "-"}</td>
      <td>${user.email || "-"}</td>
      <td>${user.telephone || "-"}</td>
      <td>${user.voiture || user.voiture_affectee || "-"}</td>
      <td>${user.date_creation ? new Date(user.date_creation).toLocaleDateString("fr-FR") : "-"}</td>
      <td><button class="btn btn-outline btn-sm" type="button" onclick="deleteUserAccount(${user.id}, '${String(user.nom || "").replace(/'/g, "\\'")}')">Supprimer</button></td>
    </tr>
  `).join("") : `<tr><td colspan="7"><div class="admin-empty">Aucun moniteur trouve.</div></td></tr>`;
}

async function loadUsers() {
  adminUsers = await Api.get("/users");
  renderUsers();
  updateAssignedMonitorPreview();
}

async function createUser(event) {
  event.preventDefault();
  const button = document.getElementById("save-user-btn");
  const role = document.getElementById("admin-role").value;
  button.disabled = true;

  try {
    const phone = document.getElementById("admin-phone").value.trim();
    if (!/^[0-9]{8}$/.test(phone)) {
      Toast.error("Le numero de telephone doit contenir exactement 8 chiffres.");
      return;
    }

    const payload = {
      role,
      nom: `${document.getElementById("admin-firstname").value.trim()} ${document.getElementById("admin-lastname").value.trim()}`.trim(),
      email: document.getElementById("admin-email").value.trim(),
      telephone: phone,
      adresse: document.getElementById("admin-address").value.trim(),
      password: document.getElementById("admin-password").value
    };

    if (role === "moniteur") {
      payload.voiture = document.getElementById("admin-car").value;
    }
    payload.formationId = document.getElementById("admin-formation").value;

    await Api.post("/users", payload);
    Toast.success("Profil ajoute avec succes.");
    event.target.reset();
    document.getElementById("admin-role").value = "eleve";
    updateFormByRole();
    closeUserModal();
    await loadUsers();
  } catch (error) {
    Toast.error(error.message);
  } finally {
    button.disabled = false;
  }
}

async function deleteUserAccount(id, name) {
  const confirmed = window.confirm(`Supprimer le compte de ${name || "cet utilisateur"} ? Cette action est definitive.`);
  if (!confirmed) {
    return;
  }

  try {
    await Api.delete(`/users/${id}`);
    Toast.success("Compte supprime.");
    await loadUsers();
  } catch (error) {
    Toast.error(error.message);
  }
}

ensureAdmin();
document.getElementById("admin-logout-link").addEventListener("click", () => Auth.clear());
document.getElementById("user-search").addEventListener("input", renderUsers);
document.getElementById("open-user-modal-btn").addEventListener("click", openUserModal);
document.getElementById("close-user-modal-btn").addEventListener("click", closeUserModal);
document.getElementById("user-modal").addEventListener("click", function (event) {
  if (event.target === this) {
    closeUserModal();
  }
});
document.querySelectorAll(".admin-profile-option").forEach((button) => {
  button.addEventListener("click", function () {
    document.getElementById("admin-role").value = this.dataset.role;
    updateFormByRole();
  });
});
document.getElementById("admin-formation").addEventListener("change", updateAssignedMonitorPreview);
document.getElementById("admin-user-form").addEventListener("reset", function () {
  window.setTimeout(updateFormByRole, 0);
});
document.getElementById("admin-user-form").addEventListener("submit", createUser);
loadUsers().catch((error) => Toast.error(error.message));
updateFormByRole();
