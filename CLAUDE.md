# Ultra Deck · Sitio web

Sitio corporativo de Ultra Deck, S.A. de C.V. (cubiertas metálicas para naves
industriales, General Escobedo, N.L.). Desarrollado por SCNDAL.

## Stack
- HTML, CSS y JavaScript puros. Sin frameworks, sin Tailwind, sin dependencias npm.
- Única librería externa: Lenis, para el scroll con inercia. Vive en el
  repositorio, no en npm ni en un CDN:
      assets/js/vendor/lenis.min.js    build de navegador, define `Lenis` global
      assets/css/vendor/lenis.css      su hoja, se carga antes que las nuestras
      assets/js/scroll.js              la inicializa, con nuestras reglas
  Reglas de Lenis:
    · No se inicializa con `prefers-reduced-motion`: queda el scroll normal.
    · En táctil el gesto del dedo es el nativo; Lenis solo toma la rueda.
    · Con el modal de cotización abierto, Lenis se detiene; al cerrarse se
      reanuda. La columna del formulario lleva `data-lenis-prevent`.
    · El carrusel de Proyectos conserva su scroll horizontal y su arrastre.
    · Las anclas de la misma página se desplazan con Lenis, descontando el
      alto del header para que el destino no quede tapado.
    · No uses `element.scrollIntoView()` para mover la página desde
      JavaScript: pelea con Lenis. Usa `window.lenisSitio.scrollTo()`.
  Para actualizarla, se descarga el archivo y se reemplaza; no se instala.
- Hosting en Vercel, repo en GitHub. Desarrollo local con `npx serve`.
- El formulario usa una serverless function en `api/contact.js` con Resend
  (fase final del proyecto, no implementar hasta que se pida).

## Idioma
- El sitio es solo en español por ahora. `lang="es-MX"` en todas las páginas.
- No crees páginas, rutas ni textos en inglés.

## Git
- Se trabaja directo en `main`, sin ramas. Todo push se publica.
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

## Modo mantenimiento
- `build.js` empieza con la constante `MODO_MANTENIMIENTO`, que se cambia a
  mano y hay que volver a correr `node build.js` para que surta efecto.
- En `true`, `dist/` contiene solo `src/mantenimiento-temporal.html` publicado
  como `index.html`, más los archivos de `assets/` que esa página referencia.
  Ninguna otra página del sitio se publica.
- En `false`, el sitio se arma completo y la carátula no se publica.
- El build imprime en la terminal en qué modo se armó.
- La carátula vive fuera del mapa del sitio y usa
  `assets/css/paginas/mantenimiento.css`.

## Mapa del sitio
    /                                          Home: bifurcación Construcción / Mantenimiento
    /construccion/                             Entrada de la rama
    /construccion/techos-metalicos/            Techos metálicos
    /construccion/estructura-metalica/
    /construccion/muros-y-fachadas/
    /construccion/domos-e-iluminacion/         Domos e iluminación natural
    /mantenimiento/                            Entrada de la rama
    /mantenimiento/techos-industriales/        Mantenimiento de techos
                                               industriales; en menús y
                                               enlaces cortos, "Techos
                                               industriales"
    /mantenimiento/canalones-y-bajantes/       Aparece en los submenús de
                                               Construcción y de Mantenimiento
    /nosotros/
    /proyectos/
    /aviso-de-privacidad/
    /blog/                                     Índice del blog
    /blog/<slug>/                              Notas. Ver Blog

- No crees páginas fuera de este mapa sin instrucción.
- No hay página de contacto. Ver Contacto.

## Sistema de diseño

### Dirección visual
- Sitio oscuro sobre grafito neutro, con secciones claras en Tender Light Blue.
- Todo va redondeado: botones tipo píldora, tarjetas e imágenes con esquinas
  amplias.
- El toque tecnológico viene de los detalles, no de adornos: header translúcido
  con desenfoque, títulos grandes y compactos, cifras protagonistas y etiquetas
  tipo cápsula.
- Tender Light Blue es el fondo de las secciones claras y el color con el que se
  tiñen las imágenes.
- El sitio es de ancho completo: header, footer y secciones llegan al borde de
  la ventana, con un único margen lateral mínimo y uniforme (`--margen-lateral`).
  Solo se usa un ancho máximo en una sección cuando se indique expresamente.
- Excepciones. Hay dos tokens según lo que pida la sección:
      --margen-seccion          el margen del sitio más el relleno interior de
                                la tarjeta del hero (`--relleno-hero`), para
                                dejar el contenido a plomo con el texto del hero
      --margen-seccion-amplio   el anterior en celular, pero crece con la
                                pantalla: ~150 px en laptop y tope de 12rem
  Secciones que las usan:
      Nosotros + cifras del home   --margen-seccion-amplio
      Servicios del home           --margen-seccion-amplio
- Si un párrafo se vuelve difícil de leer a todo el ancho, se limita el ancho de
  ese texto (`--ancho-texto`), nunca el de la sección.

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

### Tokens de marca
    --color-fondo         #0E0E10   grafito, fondo base del sitio
    --color-superficie-1  #16161A   tarjetas y footer
    --color-superficie-2  #1E1E23   tarjetas sobre superficie-1, modal
    --color-texto         #F1F1F1   Medium Seashell, texto sobre oscuro
    --color-primario      #0D2549   Amsterdam, texto de las secciones claras
    --color-guinda        #590606   Vintage Burgundy, guinda de marca
    --color-guinda-vivo   #A61B1B   rellenos sobre oscuro
    --color-guinda-claro  #D8514B   texto y detalles sobre oscuro
    --color-apoyo         #C8D3E6   Tender Light Blue
- El guinda de marca (#590606) solo se usa en las secciones claras. Sobre
  oscuro: guinda vivo para rellenos y guinda claro para texto y detalles.
- Las líneas sobre oscuro son blanco translúcido, nunca un gris suelto.
- Radios: pequeño 12px, mediano 20px, grande 32px y píldora.
- Pendiente: el logotipo usa #182B4B y #700519, distintos a la paleta. Se
  decidirá cuál manda; el cambio se hace solo en tokens.css.
- Tipografía (Google Fonts): Archivo SemiBold (600) en títulos, cifras, botones,
  menú y etiquetas; Manrope (400, 500, 600) en párrafos y textos largos.
  DM Sans ya no se usa.

### Marca
- El nombre se escribe "Ultra Deck" en texto corrido.
- El isotipo nunca se separa del logotipo.
- Todo el sitio usa el mismo logotipo blanco, también las páginas de
  Mantenimiento.
- Usa solo los SVG de `assets/img/marca/`. No redibujes ni modifiques logotipos.
- Los archivos y dónde se usa cada uno:
      ultradeck-white.svg                             logotipo en blanco:
                                                      header y footer
      ultradeck-logo.svg                              logotipo a color, para las
                                                      secciones claras. Sin uso
                                                      todavía
      favicon.png                                     favicon y apple-touch-icon
                                                      de todas las páginas.
                                                      500 × 500 px
- El favicon es la única excepción a la regla de no separar el isotipo del
  logotipo.
- El logotipo lleva `alt="Ultra Deck"`, `width` y `height` según su viewBox, y
  la altura visual sale de un token.

## Contacto
- No hay página de contacto. Todo botón de cotizar abre el modal de cotización
  (`src/partials/cotizacion.html`, comportamiento en `assets/js/cotizacion.js`).
- El modal se abre desde cualquier elemento con `data-abrir-cotizacion` y al
  cargar cualquier página cuya URL traiga `#cotizar`.

## Blog
- El índice vive en `/blog/` y las notas en `/blog/slug/`. La página pilar
  de la rama es `/mantenimiento/techos-industriales/`.
- Todo título y todo slug de nota incluye "industrial" o "nave industrial",
  para no atraer búsquedas de techos residenciales.
- Todas las notas comparten la plantilla: `body` con `data-plantilla="nota"` y
  `data-page` igual al slug, y la hoja `assets/css/paginas/nota.css`. El
  comportamiento del índice va en `assets/js/nota.js`.
- El menú no marca ningún enlace como activo dentro de una nota.
- Estructura de la plantilla, en orden:
      migas de pan (Inicio › Blog › título corto)
      encabezado: etiqueta cápsula, H1, fecha y tiempo de lectura
      portada redondeada
      índice "En esta nota": fijo a un lado en escritorio, plegado en celular
      cuerpo de ~68 caracteres por línea, con H2, H3, listas, cita, figura
        con pie, tabla y llamada a la acción a media nota
      enlace destacado a la página pilar
      preguntas frecuentes desplegables
      llamada a la acción final
      notas relacionadas (3 tarjetas)
- Cada nota lleva JSON-LD de Article, BreadcrumbList y FAQPage.
- Las ocho notas:
   1. ¿Cada cuánto dar mantenimiento a un techo industrial?
      /blog/cada-cuanto-dar-mantenimiento-techo-industrial/
   2. Goteras en naves industriales: causas y cómo detectarlas a tiempo
      /blog/goteras-en-naves-industriales/
   3. Qué revisar en el techo de su nave industrial antes de la temporada de lluvias
      /blog/revisar-techo-nave-industrial-antes-de-lluvias/
   4. Mantenimiento preventivo vs. correctivo en techos industriales
      /blog/mantenimiento-preventivo-vs-correctivo-techos/
   5. ¿Cuánto dura el techo de lámina de una nave industrial y cómo alargar su vida útil?
      /blog/vida-util-techo-nave-industrial/
   6. Por qué se desbordan los canalones de una nave industrial y cómo evitarlo
      /blog/canalones-nave-industrial-desbordan/
   7. ¿Reparar o cambiar el techo de su nave industrial? Cuándo conviene un retechado
      /blog/reparar-o-cambiar-techo-nave-industrial/
   8. Cuánto cuesta el mantenimiento de un techo industrial y de qué depende
      /blog/costo-mantenimiento-techo-industrial/

## Terminología
- Se dice "techo", no "cubierta": en nombres de página, menú, títulos, URLs y
  cualquier texto para el cliente.
- "Cubierta" solo como término técnico dentro de una descripción de producto,
  por ejemplo "cubierta tipo SST Elite".

## Contenido
- No redactes textos de venta por tu cuenta. Usa el texto que se entrega en la
  instrucción. Si falta, deja un marcador visible `[PENDIENTE: descripción]`.
- Domicilio oficial: Priv. Juan Escutia 115, Col. Niños Héroes, C.P. 66052,
  General Escobedo, N.L. No uses otra dirección aunque aparezca en otra fuente.

## Imágenes
- Se organizan por uso, no por página. Una misma foto vive en un solo lugar
  aunque se use en varias páginas.
- Las carpetas:
      assets/img/hero/        portadas, una por página
      assets/img/proyectos/   una carpeta por obra
      assets/img/empresa/     equipo, maquinaria y taller
      assets/img/servicios/   fotos de apoyo, una carpeta por página de servicio
      assets/img/marca/       logotipos y favicon (ver Marca)
- `hero/`: una portada por página, nombrada con el `data-page` de esa página.
  Dos versiones: horizontal `nombre.webp` (2400 px de ancho) y vertical para
  celular `nombre-movil.webp` (1200 px de ancho).
- `proyectos/`: una carpeta por obra, nombrada `marca-ubicacion` (por ejemplo
  `chrysler-ramos-arizpe`), con `portada.webp` y la galería numerada
  `01.webp`, `02.webp`…
- `servicios/`: una subcarpeta por página de servicio, con el mismo nombre que
  la página.
- Nombres en minúsculas, con guiones, sin acentos ni espacios.
- Formato WebP en el sitio. Si llega una imagen en otro formato, no la
  conviertas por tu cuenta: repórtalo.
- Los originales no van al repositorio: solo las versiones optimizadas para el
  sitio.
- Toda imagen lleva `alt` descriptivo, salvo las decorativas (`alt=""`).

## SEO
- Cada página lleva `<title>` y meta description únicos, canonical, Open Graph
  y un solo `<h1>`.
- Todo el contenido está en el HTML. No insertes texto, links ni datos de
  contacto con JavaScript: los rastreadores de IA no lo ejecutan.
- Toda imagen lleva `alt` descriptivo, salvo las decorativas (`alt=""`).
- Hasta el lanzamiento, todas las páginas llevan meta robots
  "noindex, nofollow". No la quites sin instrucción.
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
