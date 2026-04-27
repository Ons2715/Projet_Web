// Alias pour compatibilite: charge la logique existante de eleves.js
(function loadElevesScript() {
  if (document.querySelector('script[data-eleves-alias="true"]')) return;
  const script = document.createElement("script");
  script.src = "eleves.js";
  script.defer = true;
  script.dataset.elevesAlias = "true";
  document.head.appendChild(script);
})();
