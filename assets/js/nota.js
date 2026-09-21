/**
 * Índice de la nota.
 * En el HTML nace abierto, para quien no tenga JavaScript y para los
 * rastreadores. En celular se pliega; en escritorio se queda siempre abierto.
 */

(function () {
  "use strict";

  var indice = document.getElementById("indice-nota");
  if (!indice) return;

  var escritorio = window.matchMedia("(min-width: 64rem)");

  function ajustar() {
    indice.open = escritorio.matches;
  }

  ajustar();
  escritorio.addEventListener("change", ajustar);
})();
