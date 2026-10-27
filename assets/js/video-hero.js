/**
 * Video de fondo del hero del home.
 *
 * El video no lleva autoplay ni precarga para no competir con la primera
 * pantalla: se arranca cuando la página terminó de cargar. Con movimiento
 * reducido no se toca y el CSS lo oculta. Si no puede reproducirse, se oculta
 * y queda a la vista la imagen de respaldo que tiene debajo.
 */

(function () {
  "use strict";

  var video = document.querySelector(".inicio__hero-video");
  if (!video) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function ocultar() {
    video.hidden = true;
  }

  // Un fallo de la fuente se avisa en el <source>, no en el <video>.
  var fuente = video.querySelector("source");
  if (fuente) fuente.addEventListener("error", ocultar);
  video.addEventListener("error", ocultar);

  function arrancar() {
    video.muted = true;
    var intento = video.play();
    if (intento && typeof intento.catch === "function") intento.catch(ocultar);
  }

  if (document.readyState === "complete") arrancar();
  else window.addEventListener("load", arrancar, { once: true });
})();
