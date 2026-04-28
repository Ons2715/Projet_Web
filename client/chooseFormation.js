const formationCards = document.querySelectorAll(".plan-card");
const selectedPrice = document.getElementById("selected-price");
const selectedFormationLabel = document.getElementById("selected-formation-label");
const selectedTotal = document.getElementById("selected-total");
const walletModalOverlay = document.getElementById("wallet-modal-overlay");
const walletModalFrame = document.getElementById("wallet-modal-frame");
//pour les cards de formation dans la page de choix de formation
function normalizePrice(rawValue) {
  return Number(String(rawValue).replace(/[^\d]/g, "")) || 0;
}
//pour les cards de formation dans la page de choix de formation
function formatCurrency(value) {
  return `${Number(value).toLocaleString("fr-TN")} TND`;
}
//pour les cards de formation dans la page de choix de formation
function getRecyclageBoite(card) {
  if (!card || card.dataset.formationId !== "4") return "";
  return document.querySelector('input[name="recyclage-boite"]:checked')?.value || "automatique";
}
//pour les cards de formation dans la page de choix de formation
function getRecyclageBoiteLabel() {
  return getRecyclageBoite(document.querySelector(".plan-card.selected")) === "manuelle"
    ? "boite manuelle"
    : "boite automatique";
}
//pour les cards de formation dans la page de choix de formation
function updateSummary(card) {
  const basePrice = normalizePrice(card.dataset.price);
  const recyclageSuffix = getRecyclageBoite(card) ? ` - ${getRecyclageBoiteLabel()}` : "";

  selectedFormationLabel.textContent = `${card.dataset.formation}${recyclageSuffix}`;
  selectedPrice.textContent = formatCurrency(basePrice);
  selectedTotal.textContent = formatCurrency(basePrice);
}
//pour les cards de formation dans la page de choix de formation
formationCards.forEach((card) => {
  card.addEventListener("click", () => {
    formationCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");
    updateSummary(card);
  });
});
//pour les cards de formation dans la page de choix de formation
document.querySelectorAll('input[name="recyclage-boite"]').forEach((input) => {
  input.addEventListener("click", (event) => event.stopPropagation());
  input.addEventListener("change", () => {
    updateSummary(document.querySelector(".plan-card.selected"));
  });
});
//pour les cards de formation dans la page de choix de formation
async function handlePayment() {
  const activeCard = document.querySelector(".plan-card.selected");
  const user = Auth.get() || {};

  user.formation = activeCard ? activeCard.dataset.formation : "Code";
  user.recyclageBoite = getRecyclageBoite(activeCard);
  Auth.set(user);
  sessionStorage.setItem("selectedFormation", user.formation);
  sessionStorage.setItem("selectedRecyclageBoite", user.recyclageBoite || "");
  sessionStorage.setItem("selectedFormationPrice", selectedTotal.textContent);

  if (activeCard && Auth.getToken()) {
    try {
      const updatedProfile = await Api.patch("/users/me/formation", {
        formationId: activeCard.dataset.formationId
      });
      user.formation = updatedProfile.formation_nom || user.formation;
      user.recyclageBoite = getRecyclageBoite(activeCard);
      user.heuresEffectuees = updatedProfile.heures_effectuees ?? user.heuresEffectuees;
      user.heuresTotales = updatedProfile.heures_totales ?? user.heuresTotales;
      Auth.set(user);
    } catch (error) {
      Toast.error(error.message || "Impossible d'enregistrer la formation.");
      return;
    }
  }

  openWalletModal();
}
//pour les cards de formation dans la page de choix de formation
function openWalletModal() {
  const activeCard = document.querySelector(".plan-card.selected");
  const formation = activeCard ? activeCard.dataset.formation : "Formation EduCar";
  const suffix = getRecyclageBoite(activeCard) ? ` - ${getRecyclageBoiteLabel()}` : "";
  const amount = selectedTotal.textContent;

  walletModalFrame.src = `wallet.html?embedded=1&formation=${encodeURIComponent(formation + suffix)}&amount=${encodeURIComponent(amount)}`;
  walletModalOverlay.classList.add("open");
  walletModalOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("wallet-modal-open");
}
//pour les cards de formation dans la page de choix de formation
function closeWalletModal() {
  walletModalOverlay.classList.remove("open");
  walletModalOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("wallet-modal-open");
  setTimeout(() => {
    walletModalFrame.src = "";
  }, 180);
}

document.getElementById("formation-logout-link").addEventListener("click", function () {
  Auth.clear();
});

walletModalOverlay.addEventListener("click", function (event) {
  if (event.target === walletModalOverlay) {
    closeWalletModal();
  }
});
//pour les cards de formation dans la page de choix de formation
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && walletModalOverlay.classList.contains("open")) {
    closeWalletModal();
  }
});
//pour les cards de formation dans la page de choix de formation
window.addEventListener("message", function (event) {
  if (event.data && event.data.type === "EduCar-wallet-close") {
    closeWalletModal();
  }
});

updateSummary(document.querySelector(".plan-card.selected"));
