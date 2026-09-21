/**
 * Scroll con inercia, sobre Lenis (assets/js/vendor/lenis.min.js).
 *
 * No se inicializa si el sistema pide movimiento reducido. En pantallas
 * táctiles el gesto del dedo sigue siendo el nativo: Lenis solo toma la rueda.
 */

(function () {
  "use strict";

  if (typeof Lenis !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var lenis = new Lenis({
    duration: 0.9,
    smoothWheel: true,
    syncTouch: false, // el dedo no pasa por Lenis
  });

  window.lenisSitio = lenis;

  function marco(tiempo) {
    lenis.raf(tiempo);
    requestAnimationFrame(marco);
  }
  requestAnimationFrame(marco);

  /** Alto que tapa el header flotante, para no dejar el destino debajo. */
  function estorboDelHeader() {
    var header = document.querySelector(".ud-header");
    return header ? header.offsetHeight + 8 : 0;
  }

  /* Anclas de la misma página. */
  document.addEventListener("click", function (evento) {
    var destino = evento.target;
    if (!destino || !destino.closest) return;

    var enlace = destino.closest('a[href^="#"]');
    if (!enlace) return;

    var id = enlace.getAttribute("href");
    if (id === "#" || id.length < 2) return;

    var ancla = document.getElementById(id.slice(1));
    if (!ancla) return; // p. ej. #cotizar, que lo atiende el modal

    evento.preventDefault();
    lenis.scrollTo(ancla, { offset: -estorboDelHeader() });
  });

  /* Con el modal abierto la página de atrás no se mueve; la columna del
     formulario lleva data-lenis-prevent y se desplaza sola. */
  var modal = document.getElementById("modal-cotizacion");
  if (modal) {
    new MutationObserver(function () {
      if (modal.open) lenis.stop();
      else lenis.start();
    }).observe(modal, { attributes: true, attributeFilter: ["open"] });

    if (modal.open) lenis.stop();
  }
})();
