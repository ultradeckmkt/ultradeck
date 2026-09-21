/**
 * Menú de celular y submenús del header.
 * No escribe contenido: solo abre y cierra lo que ya está en el HTML.
 */

(function () {
  "use strict";

  var ABIERTO = "esta-abierto";

  var boton = document.querySelector(".ud-header__menu");
  var panel = boton && document.getElementById(boton.getAttribute("aria-controls"));
  var grupos = Array.prototype.slice.call(
    document.querySelectorAll(".ud-nav__grupo"),
  );

  function abrir(elemento, disparador) {
    elemento.classList.add(ABIERTO);
    disparador.setAttribute("aria-expanded", "true");
  }

  function cerrar(elemento, disparador) {
    elemento.classList.remove(ABIERTO);
    disparador.setAttribute("aria-expanded", "false");
  }

  function estaAbierto(elemento) {
    return elemento.classList.contains(ABIERTO);
  }

  /** Cierra todos los submenús, menos el que se indique. */
  function cerrarSubmenus(excepcion) {
    grupos.forEach(function (grupo) {
      var disparador = grupo.querySelector(".ud-nav__disparador");
      if (!disparador || grupo === excepcion) return;
      cerrar(grupo, disparador);
    });
  }

  if (boton && panel) {
    boton.addEventListener("click", function () {
      if (estaAbierto(panel)) {
        cerrar(panel, boton);
        cerrarSubmenus(null);
      } else {
        abrir(panel, boton);
      }
    });
  }

  grupos.forEach(function (grupo) {
    var disparador = grupo.querySelector(".ud-nav__disparador");
    if (!disparador) return;

    disparador.addEventListener("click", function () {
      if (estaAbierto(grupo)) {
        cerrar(grupo, disparador);
      } else {
        cerrarSubmenus(grupo);
        abrir(grupo, disparador);
      }
    });
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key !== "Escape") return;

    var grupoAbierto = grupos.filter(estaAbierto)[0];

    if (grupoAbierto) {
      var disparador = grupoAbierto.querySelector(".ud-nav__disparador");
      cerrar(grupoAbierto, disparador);
      disparador.focus();
      return;
    }

    if (panel && estaAbierto(panel)) {
      cerrar(panel, boton);
      boton.focus();
    }
  });

  /* Un clic fuera del header cierra lo que esté abierto. */
  document.addEventListener("click", function (evento) {
    var destino = evento.target;
    if (destino && destino.closest && destino.closest(".ud-header")) return;

    cerrarSubmenus(null);
    if (panel && estaAbierto(panel)) cerrar(panel, boton);
  });
})();
