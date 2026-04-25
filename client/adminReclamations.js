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

function renderReclamations(items) {
  const list = document.getElementById("reclamation-list");
  const count = document.getElementById("reclamation-count");
  count.textContent = `${items.length} reclamation${items.length > 1 ? "s" : ""}`;

  if (!items.length) {
    list.innerHTML = `<div class="admin-empty">Aucune reclamation pour le moment.</div>`;
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="admin-reclamation-item">
      <div class="admin-reclamation-head">
        <div class="admin-reclamation-user">
          <h3 class="h4">${item.utilisateur_nom || "Utilisateur supprime"}</h3>
          <span>${item.utilisateur_email || "Email indisponible"}</span>
          <span>${item.utilisateur_telephone || "Telephone indisponible"}</span>
        </div>
        <span class="badge badge-warning">${item.statut || "nouvelle"}</span>
      </div>
      <div class="admin-reclamation-meta">
        <span>Reservation: ${item.reservation_ref || "-"}</span>
        <span>${item.date_creation ? new Date(item.date_creation).toLocaleString("fr-FR") : "-"}</span>
        <span>Moniteur: ${item.moniteur_nom || "-"}${item.moniteur_telephone ? ` - ${item.moniteur_telephone}` : ""}</span>
      </div>
      <p class="admin-reclamation-reason">${item.raison}</p>
      <div class="admin-reclamation-actions">
        ${attachmentLink(item)}
        <div class="admin-reclamation-treat-action">
          ${
            item.statut === "en_cours" || item.statut === "traitee"
              ? `<button class="btn btn-outline btn-sm" type="button" disabled>En cours</button>`
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
    Toast.success("Reclamation traitee. Email envoye au candidat.");
    await loadReclamations();
  } catch (error) {
    Toast.error(error.message);
  }
}

ensureAdmin();
document.getElementById("admin-logout-link").addEventListener("click", () => Auth.clear());
loadReclamations().catch((error) => Toast.error(error.message));
