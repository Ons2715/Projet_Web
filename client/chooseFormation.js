const formationCards = document.querySelectorAll(".plan-card");
      const selectedPrice = document.getElementById("selected-price");
      const selectedFormationLabel = document.getElementById("selected-formation-label");
      const selectedTax = document.getElementById("selected-tax");
      const selectedTotal = document.getElementById("selected-total");
      const walletModalOverlay = document.getElementById("wallet-modal-overlay");
      const walletModalFrame = document.getElementById("wallet-modal-frame");
      const TAX_RATE = 0.19;

      function normalizePrice(rawValue) {
        return Number(String(rawValue).replace(/[^\d]/g, "")) || 0;
      }

      function formatCurrency(value) {
        return `${Number(value).toLocaleString("fr-TN")} TND`;
      }

      function updateSummary(card) {
        const basePrice = normalizePrice(card.dataset.price);
        const taxAmount = Math.round(basePrice * TAX_RATE);
        const totalPrice = basePrice + taxAmount;
          selectedFormationLabel.textContent = `1 article • ${card.dataset.formation}`;
          selectedPrice.textContent = formatCurrency(basePrice);
          selectedTax.textContent = formatCurrency(taxAmount);
          selectedTotal.textContent = formatCurrency(totalPrice);
      }

      formationCards.forEach((card) => {
        card.addEventListener("click", () => {
          formationCards.forEach((item) => item.classList.remove("selected"));
          card.classList.add("selected");
          updateSummary(card);
        });
      });

      async function handlePayment() {
        const activeCard = document.querySelector(".plan-card.selected");
        const user = Auth.get() || {};
        user.formation = activeCard ? activeCard.dataset.formation : "Code";
        Auth.set(user);
        sessionStorage.setItem("selectedFormation", user.formation);
        sessionStorage.setItem("selectedFormationPrice", selectedTotal.textContent);
        if (activeCard && Auth.getToken()) {
          try {
            const updatedProfile = await Api.patch("/users/me/formation", {
              formationId: activeCard.dataset.formationId
            });
            user.formation = updatedProfile.formation_nom || user.formation;
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

      function openWalletModal() {
        const activeCard = document.querySelector(".plan-card.selected");
        const formation = activeCard ? activeCard.dataset.formation : "Formation EduCar";
        const amount = selectedTotal.textContent;
        walletModalFrame.src = `wallet.html?embedded=1&formation=${encodeURIComponent(formation)}&amount=${encodeURIComponent(amount)}`;
        walletModalOverlay.classList.add("open");
        walletModalOverlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("wallet-modal-open");
      }

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

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && walletModalOverlay.classList.contains("open")) {
          closeWalletModal();
        }
      });

      window.addEventListener("message", function (event) {
        if (event.data && event.data.type === "EduCar-wallet-close") {
          closeWalletModal();
        }
      });

      updateSummary(document.querySelector(".plan-card.selected"));
