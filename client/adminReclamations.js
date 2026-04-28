function ensureAdmin() {
  const user = Auth.get();
  if (!user || (user.role !== "admin" && user.serverRole !== "admin")) {
    Toast.error("Acces reserve a l'administrateur.");
    location.href = "login.html";
  }
}

function attachmentLink(item) {
  if (!item.piece_nom || !item.piece_data) {
    return `<span class="text-muted">Aucune piece jointe</span>`;
  }

  return `<a class="btn btn-outline btn-sm" href="${item.piece_data}" download="${item.piece_nom}">Piece jointe</a>`;
}

function formatStatusLabel(status) {
  if (status === "terminee" || status === "traitee") return "terminee";
  if (status === "en_cours") return "en cours";
  return status || "nouvelle";
}

function renderReclamations(items) {
  const list = document.getElementById("reclamation-list");
  const count = document.getElementById("reclamation-count");
  const visibleItems = items.filter((item) => item.utilisateur_nom);
  count.textContent = `${visibleItems.length} reclamation${visibleItems.length > 1 ? "s" : ""}`;

  if (!visibleItems.length) {
    list.innerHTML = `<div class="admin-empty">Aucune reclamation pour le moment.</div>`;
    return;
  }
//permet de rendre la liste des reclamations dans la page adminReclamations.html
  list.innerHTML = visibleItems.map((item) => `
    <article class="admin-reclamation-item">
      <div class="admin-reclamation-head">
        <div class="admin-reclamation-user">
          <h3 class="h4">${item.utilisateur_nom}</h3>
          <span>${item.utilisateur_email || "Email indisponible"}</span>
          <span>${item.utilisateur_telephone || "Telephone indisponible"}</span>
        </div>
        <span class="badge badge-warning">${formatStatusLabel(item.statut)}</span>
      </div>
      <div class="admin-reclamation-meta">
        
        <span>Réclamation reçue: ${item.date_creation ? new Date(item.date_creation).toLocaleString("fr-FR") : "-"}</span>
        <span>Moniteur: ${item.moniteur_nom || "-"}${item.moniteur_telephone ? ` - ${item.moniteur_telephone}` : ""}</span>
      </div>
      <p class="admin-reclamation-reason">${item.raison}</p>
      <div class="admin-reclamation-actions">
        ${attachmentLink(item)}
        <div class="admin-reclamation-treat-action">
          ${
            item.statut === "en_cours" || item.statut === "traitee" || item.statut === "terminee"
              ? `<button class="btn btn-outline btn-sm" type="button" disabled>Terminee</button>`
              : `<button class="btn btn-primary btn-sm" type="button" onclick="treatReclamation(${item.id})">Traiter</button>`
          }
        </div>
      </div>
    </article>
  `).join("");
}

async function loadReclamations() {
  const items = await Api.get("/reclamations");
  renderReclamations(items);
}

async function treatReclamation(id) {
  try {
    await Api.patch(`/reclamations/${id}/traiter`);
    Toast.success("Reclamation terminée. Email envoyé au candidat.");
    await loadReclamations();
  } catch (error) {
    Toast.error(error.message);
  }
}

ensureAdmin();
document.getElementById("admin-logout-link").addEventListener("click", () => Auth.clear());
loadReclamations().catch((error) => Toast.error(error.message));
