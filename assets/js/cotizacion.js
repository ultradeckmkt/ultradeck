/**
 * Modal de cotización.
 * Abre y cierra el <dialog>; el envío todavía no está conectado.
 */

(function () {
  "use strict";

  var modal = document.getElementById("modal-cotizacion");
  if (!modal || typeof modal.showModal !== "function") return;

  var forma = document.getElementById("cotizacion-forma");
  var origen = null;

  function abrir(disparador) {
    if (modal.open) return;
    origen = disparador || null;
    modal.showModal();
  }

  document.querySelectorAll("[data-abrir-cotizacion]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrir(boton);
    });
  });

  document
    .querySelectorAll("[data-cerrar-cotizacion]")
    .forEach(function (boton) {
      boton.addEventListener("click", function () {
        modal.close();
      });
    });

  /* Un clic sobre el fondo: el destino es el propio dialog, no su contenido. */
  modal.addEventListener("click", function (evento) {
    if (evento.target === modal) modal.close();
  });

  /* Escape lo cierra solo; aquí solo devolvemos el foco a quien lo abrió. */
  modal.addEventListener("close", function () {
    if (origen) origen.focus();
    origen = null;
  });

  if (forma) {
    forma.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!forma.checkValidity()) {
        forma.reportValidity();
        return;
      }
      // [PENDIENTE: enviar a api/contact.js y disparar form_success].
    });
  }

  if (window.location.hash === "#cotizar") abrir(null);
})();
