/**
 * "Mostrar más" de la cuadrícula de servicios del home.
 * Las 11 tarjetas están siempre en el HTML: esto solo pliega las últimas.
 */

(function () {
  "use strict";

  var PLEGADO = "esta-plegado";

  var lista = document.getElementById("lista-servicios");
  var boton = document.getElementById("mostrar-servicios");
  if (!lista || !boton) return;

  lista.classList.add(PLEGADO);
  boton.hidden = false;
  boton.setAttribute("aria-expanded", "false");

  boton.addEventListener("click", function () {
    var plegado = lista.classList.toggle(PLEGADO);

    boton.setAttribute("aria-expanded", plegado ? "false" : "true");
    boton.textContent = plegado ? "Mostrar más servicios" : "Mostrar menos";
  });
})();
