/**
 * Diálogos de contacto: el modal de cotización y el de WhatsApp.
 * Los dos comparten apertura, cierre (botón, Escape y clic fuera) y la
 * devolución del foco a quien los abrió. El envío de la cotización todavía
 * no está conectado.
 */

(function () {
  "use strict";

  /**
   * Prepara un <dialog> con el patrón del sitio y devuelve su función de
   * apertura. Lenis se detiene mientras está abierto (assets/js/scroll.js).
   */
  function prepararModal(modal, selectorAbrir) {
    var origen = null;

    function abrir(disparador) {
      if (modal.open) return;
      origen = disparador || null;
      modal.showModal();
    }

    document.querySelectorAll(selectorAbrir).forEach(function (boton) {
      boton.addEventListener("click", function () {
        abrir(boton);
      });
    });

    modal.querySelectorAll(".ud-modal__cerrar").forEach(function (boton) {
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

    return abrir;
  }

  /** Valida con el mismo criterio en los dos formularios. */
  function esValido(forma) {
    if (forma.checkValidity()) return true;
    forma.reportValidity();
    return false;
  }

  /* Cotización ----------------------------------------------------------- */

  var cotizacion = document.getElementById("modal-cotizacion");
  if (cotizacion && typeof cotizacion.showModal === "function") {
    var abrirCotizacion = prepararModal(cotizacion, "[data-abrir-cotizacion]");
    var formaCotizacion = document.getElementById("cotizacion-forma");

    if (formaCotizacion) {
      formaCotizacion.addEventListener("submit", function (evento) {
        evento.preventDefault();
        if (!esValido(formaCotizacion)) return;
        // [PENDIENTE: enviar a api/contact.js y disparar form_success].
      });
    }

    if (window.location.hash === "#cotizar") abrirCotizacion(null);
  }

  /* WhatsApp ------------------------------------------------------------- */

  var whatsapp = document.getElementById("modal-whatsapp");
  var botonWhatsapp = document.querySelector(".ud-whatsapp");
  var formaWhatsapp = document.getElementById("whatsapp-forma");

  if (
    whatsapp &&
    botonWhatsapp &&
    formaWhatsapp &&
    typeof whatsapp.showModal === "function"
  ) {
    prepararModal(whatsapp, "[data-abrir-whatsapp]");
    botonWhatsapp.hidden = false;

    /* Se aparta mientras el footer está a la vista: así no tapa sus datos
       ni el sello de la esquina. */
    var footer = document.querySelector(".ud-footer");
    if (footer && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entradas) {
        botonWhatsapp.classList.toggle("esta-oculto", entradas[0].isIntersecting);
      }).observe(footer);
    }

    /** El mensaje que el visitante encuentra escrito al abrir WhatsApp. */
    function mensaje(nombre) {
      return (
        "Hola, soy " +
        nombre +
        ". Me gustaría recibir información sobre sus servicios para mi nave industrial."
      );
    }

    /**
     * [PENDIENTE: Resend]. Aquí se conecta el envío por correo cuando exista
     * api/contact.js. Debe ir sin esperar respuesta, para no retrasar la
     * pestaña de WhatsApp (los navegadores bloquean una ventana que no se
     * abre en el mismo clic):
     *
     *   fetch("/api/contact", {
     *     method: "POST",
     *     keepalive: true,
     *     headers: { "Content-Type": "application/json" },
     *     body: JSON.stringify({ origen: "whatsapp", nombre: datos.nombre,
     *       telefono: datos.telefono }),
     *   });
     *
     * El evento form_success del dataLayer solo se dispara cuando el backend
     * confirme el envío, nunca aquí.
     */
    function registrarContacto(datos) {}

    formaWhatsapp.addEventListener("submit", function (evento) {
      evento.preventDefault();
      if (!esValido(formaWhatsapp)) return;

      var datos = {
        nombre: formaWhatsapp.elements.nombre.value.trim(),
        telefono: formaWhatsapp.elements.telefono.value.trim(),
      };
      var numero = formaWhatsapp.getAttribute("data-whatsapp-numero");

      window.open(
        "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje(datos.nombre)),
        "_blank",
        "noopener"
      );
      registrarContacto(datos);
      whatsapp.close();
    });
  }
})();
