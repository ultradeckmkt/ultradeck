/**
 * Carruseles horizontales.
 * El desplazamiento es nativo; esto mueve una tarjeta por clic, permite
 * arrastrar con el mouse y enciende o apaga las flechas en cada extremo.
 *
 * Atiende todos los carruseles de la página: cada par de flechas se asocia a
 * su pista por el aria-controls.
 */

(function () {
  "use strict";

  var ARRASTRANDO = "esta-arrastrando";
  var UMBRAL = 6; // px que separan un clic de un arrastre

  var suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function iniciar(pista, anterior, siguiente) {
    var arrastre = null;
    var clicBloqueado = false;

    /** Ancho de una tarjeta más la separación entre tarjetas. */
    function paso() {
      var tarjeta = pista.querySelector("li");
      if (!tarjeta) return pista.clientWidth;

      var separacion = parseFloat(getComputedStyle(pista).columnGap) || 0;
      return tarjeta.getBoundingClientRect().width + separacion;
    }

    function mover(direccion) {
      pista.scrollBy({
        left: paso() * direccion,
        behavior: suave ? "smooth" : "auto",
      });
    }

    /** Deja la pista en la tarjeta más cercana. */
    function acomodar() {
      var medida = paso();
      if (!medida) return;

      pista.scrollTo({
        left: Math.round(pista.scrollLeft / medida) * medida,
        behavior: suave ? "smooth" : "auto",
      });
    }

    function actualizar() {
      var resto = pista.scrollWidth - pista.clientWidth;
      anterior.disabled = pista.scrollLeft <= 1;
      siguiente.disabled = pista.scrollLeft >= resto - 1;
    }

    anterior.addEventListener("click", function () {
      mover(-1);
    });

    siguiente.addEventListener("click", function () {
      mover(1);
    });

    /* Arrastre con el mouse. El dedo no pasa por aquí: el desplazamiento
       táctil es el nativo. */
    pista.addEventListener("pointerdown", function (evento) {
      if (evento.pointerType !== "mouse" || evento.button !== 0) return;

      arrastre = {
        id: evento.pointerId,
        x: evento.clientX,
        desde: pista.scrollLeft,
        movido: false,
      };
    });

    pista.addEventListener("pointermove", function (evento) {
      if (!arrastre || evento.pointerId !== arrastre.id) return;

      var avance = evento.clientX - arrastre.x;
      if (!arrastre.movido) {
        if (Math.abs(avance) < UMBRAL) return;
        arrastre.movido = true;
        /* La clase quita el scroll-snap mientras dura el gesto: con snap
           obligatorio la pista pelea contra el puntero. */
        pista.classList.add(ARRASTRANDO);
        pista.setPointerCapture(arrastre.id);
      }

      pista.scrollLeft = arrastre.desde - avance;
      actualizar();
    });

    function soltar() {
      if (!arrastre) return;

      var movido = arrastre.movido;
      if (movido && pista.hasPointerCapture(arrastre.id)) {
        pista.releasePointerCapture(arrastre.id);
      }
      arrastre = null;

      if (!movido) return;

      pista.classList.remove(ARRASTRANDO);
      clicBloqueado = true;
      acomodar();
      actualizar();
    }

    pista.addEventListener("pointerup", soltar);
    pista.addEventListener("pointercancel", soltar);

    /* Tras arrastrar, el clic del gesto no debe abrir la tarjeta. Un clic sin
       movimiento sí pasa. */
    pista.addEventListener(
      "click",
      function (evento) {
        if (!clicBloqueado) return;
        clicBloqueado = false;
        evento.preventDefault();
        evento.stopPropagation();
      },
      true,
    );

    /* Ni seleccionar texto ni llevarse una imagen a rastras. */
    pista.addEventListener("dragstart", function (evento) {
      evento.preventDefault();
    });

    pista.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);

    actualizar();
  }

  var grupos = {};
  document
    .querySelectorAll("[data-carrusel][aria-controls]")
    .forEach(function (boton) {
      var id = boton.getAttribute("aria-controls");
      if (!grupos[id]) grupos[id] = {};
      grupos[id][boton.getAttribute("data-carrusel")] = boton;
    });

  Object.keys(grupos).forEach(function (id) {
    var pista = document.getElementById(id);
    var flechas = grupos[id];
    if (pista && flechas.anterior && flechas.siguiente) {
      iniciar(pista, flechas.anterior, flechas.siguiente);
    }
  });
})();
