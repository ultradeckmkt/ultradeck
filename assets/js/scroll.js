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

  /* Anclas de la misma página: "#id" o una ruta con ancla que apunta a la
     página actual, como "/#proyectos" estando en el home. */
  document.addEventListener("click", function (evento) {
    var destino = evento.target;
    if (!destino || !destino.closest) return;

    var enlace = destino.closest('a[href*="#"]');
    if (!enlace) return;
    if (
      enlace.origin !== location.origin ||
      enlace.pathname !== location.pathname
    ) {
      return; // otra página: el navegador la carga y salta al ancla
    }

    var id = enlace.hash;
    if (id.length < 2) return;

    var ancla = document.getElementById(decodeURIComponent(id.slice(1)));
    if (!ancla) return; // p. ej. #cotizar, que lo atiende el modal

    evento.preventDefault();
    lenis.scrollTo(ancla, { offset: -estorboDelHeader() });
  });

  /* Con un modal abierto (cotización o WhatsApp) la página de atrás no se
     mueve; la columna del formulario lleva data-lenis-prevent y se desplaza
     sola. */
  var modales = document.querySelectorAll("dialog.ud-modal");

  function revisarModales() {
    var alguno = Array.prototype.some.call(modales, function (modal) {
      return modal.open;
    });
    if (alguno) lenis.stop();
    else lenis.start();
  }

  modales.forEach(function (modal) {
    new MutationObserver(revisarModales).observe(modal, {
      attributes: true,
      attributeFilter: ["open"],
    });
  });
  revisarModales();
})();
