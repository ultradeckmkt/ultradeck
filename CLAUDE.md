# Ultra Deck · Sitio web

Sitio corporativo de Ultra Deck, S.A. de C.V. (cubiertas metálicas para naves
industriales, General Escobedo, N.L.). Desarrollado por SCNDAL.

## Stack
- HTML, CSS y JavaScript puros. Sin frameworks, sin Tailwind, sin dependencias npm.
- Hosting en Vercel, repo en GitHub. Desarrollo local con `npx serve`.
- El formulario usa una serverless function en `api/contact.js` con Resend
  (fase final del proyecto, no implementar hasta que se pida).

## Idioma
- El sitio es solo en español por ahora. `lang="es-MX"` en todas las páginas.
- No crees páginas, rutas ni textos en inglés.

## Git
- No ejecutes `git add`, `git commit`, `git push` ni ningún comando de git.
- No despliegues a producción bajo ninguna circunstancia, ni con aprobación verbal.
- Al terminar una tarea, deja los cambios en el working directory y lista los
  archivos que tocaste. El commit y el push los hace el equipo manualmente.

## Flujo de trabajo
- Ejecuta directamente. No entregues plan previo ni esperes aprobación,
  salvo que la tarea sea ambigua o que ejecutarla implique una decisión
  que no está en la instrucción.
- Si durante la ejecución encuentras algo que la instrucción no contemplaba,
  detente y repórtalo antes de improvisar una solución.
- No repitas contexto ya establecido en el proyecto.

## Estructura de archivos
    src/                        páginas fuente, una carpeta por URL con su index.html
    src/partials/header.html    el header, única copia
    src/partials/footer.html    el footer, única copia
    assets/css/                 hojas de estilo (ver Sistema de diseño)
    assets/js/                  JavaScript
    assets/img/marca/           logotipos en SVG
    assets/img/                 fotografía y demás imágenes
    api/                        serverless functions
    build.js                    arma el sitio final en dist/
    vercel.json                 configuración, redirecciones y headers

- Las URLs se forman por carpetas: `src/construccion/cubiertas-metalicas/index.html`
  se publica como `/construccion/cubiertas-metalicas/`.
- No edites nada dentro de `dist/`: se regenera en cada build.

## Header y footer
- Viven solo en `src/partials/`. Nunca los pegues dentro de una página.
- Cada página los incluye con las marcas `<!-- @include header -->` y
  `<!-- @include footer -->`. `build.js` las reemplaza al publicar, de modo que
  el HTML final llega completo, sin depender de JavaScript.
- La opción activa del menú se marca con el atributo `data-page` del `<body>`.
- `build.js` no usa dependencias externas. Si una tarea parece requerir una,
  detente y repórtalo.

## Mapa del sitio
    /                                          Home: bifurcación Construcción / Mantenimiento
    /construccion/                             Entrada de la rama
    /construccion/cubiertas-metalicas/
    /construccion/estructura-metalica/
    /construccion/muros-y-fachadas/
    /construccion/iluminacion-cenital/
    /mantenimiento/                            Entrada de la rama
    /mantenimiento/cubiertas-industriales/
    /mantenimiento/canalones-y-bajantes/       Reservada, no se construye todavía
    /nosotros/
    /proyectos/
    /contacto/
    /aviso-de-privacidad/

- No crees páginas fuera de este mapa sin instrucción.

## Sistema de diseño
- Todo el estilo es CSS propio, organizado en capas:
    assets/css/tokens.css         los valores de diseño, única fuente de verdad
    assets/css/base.css           el reset y los estilos de elemento, únicos
    assets/css/patrones.css       el vocabulario compartido, clases ud-*
    assets/css/interacciones.css  las clases que consulta el JavaScript
    assets/css/paginas/*.css      lo propio de cada página, un archivo por página
- Orden de capas: base y patrones dentro de `@layer`; las hojas de página fuera
  de toda capa. Así una página siempre puede ajustar un patrón con una regla
  normal, sin `!important` ni selectores inflados.
- Las reglas de una hoja de página van acotadas a su `data-page` para que no se
  filtren a otras páginas. No hay hojas globales de página.
- Un patrón sube a patrones.css cuando lo piden dos páginas, no antes.
- No inventes valores fuera del sistema: usa los tokens de tokens.css. Si un
  valor no está, no lo escribas suelto: decide si toca añadirlo al sistema.
- Ningún archivo fuera de tokens.css contiene colores hex.
- Si un cambio toca un patrón compartido y afectaría a otras páginas, no lo
  toques: aplica el override acotado a la sección y repórtalo.

### Tokens de marca (provisionales)
    --color-primario     #0D2549   Amsterdam
    --color-acento       #590606   Vintage Burgundy
    --color-superficie   #F1F1F1   Medium Seashell, fondo general
    --color-apoyo        #C8D3E6   Tender Light Blue
- Pendiente: el logotipo usa #182B4B y #700519, distintos a la paleta. Se
  decidirá cuál manda; el cambio se hace solo en tokens.css.
- Tipografía: DM Sans (Google Fonts).

### Marca
- El nombre se escribe "Ultra Deck" en texto corrido.
- El isotipo nunca se separa del logotipo.
- La rama Mantenimiento usa la variante del logotipo con tagline "Mantenimiento";
  el resto del sitio usa la versión con "Edificaciones Metálicas".
- Usa solo los SVG de `assets/img/marca/`. No redibujes ni modifiques logotipos.

## Contenido
- No redactes textos de venta por tu cuenta. Usa el texto que se entrega en la
  instrucción. Si falta, deja un marcador visible `[PENDIENTE: descripción]`.
- Domicilio oficial: Priv. Juan Escutia 115, Col. Niños Héroes, C.P. 66052,
  General Escobedo, N.L. No uses otra dirección aunque aparezca en otra fuente.

## SEO
- Cada página lleva `<title>` y meta description únicos, canonical, Open Graph
  y un solo `<h1>`.
- Todo el contenido está en el HTML. No insertes texto, links ni datos de
  contacto con JavaScript: los rastreadores de IA no lo ejecutan.
- Toda imagen lleva `alt` descriptivo, salvo las decorativas (`alt=""`).
- No agregues ni quites `noindex` ni reglas de `robots` sin instrucción.

## Tracking (fase final)
- La conversión del formulario solo se dispara con el evento
  `form_success` en el dataLayer, después de que el backend confirme el envío.
  Nunca con el clic ni con el submit del formulario.

## Alcance
- Haz solo lo que se pide. No agregues elementos, secciones ni mejoras no solicitadas.
- Si algo se ve duplicado, mal escrito o mejorable fuera del alcance, repórtalo.
  No lo corrijas.

## Verificación
- No hagas comprobaciones repetidas ni ciclos de validación por tu cuenta.
  Ejecuta la tarea una vez y reporta.
- Para cambios visuales, la revisión la hace el equipo. No abras el navegador
  para valorar cómo se ve algo.
- Para diagnosticar un fallo reportado, sí levanta el servidor y mide en el
  navegador. No deduzcas la causa leyendo el CSS: repróducela.
- Si detectas un error real que impide que la tarea funcione, repórtalo.
