/**
 * Echo Widget Loader — loads the native Echo chat widget.
 * Replaces the previous Kapa.ai wrapper.
 */
(function () {
  var script = document.createElement("script");
  script.async = true;
  script.src = "https://echo-api-production-a823.up.railway.app/widget/widget.js";

  // Config
  script.setAttribute("data-api-url", "https://echo-api-production-a823.up.railway.app");
  script.setAttribute("data-mode", "modal");
  script.setAttribute("data-button-hide", "true");
  script.setAttribute("data-accent-color", "#1EE3CF");
  script.setAttribute("data-title", "Ask Echo");

  document.head.appendChild(script);
})();
