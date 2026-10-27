# Ultra Deck · Sitio web

Responde siempre en español.

Sitio corporativo de Ultra Deck, S.A. de C.V. (construcción y mantenimiento de
techos metálicos para naves industriales, General Escobedo, N.L.). Desarrollado
por SCNDAL.

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

- Las URLs se forman por carpetas: `src/construccion/techos-metalicos/index.html`
  se publica como `/construccion/techos-metalicos/`.
- No edites nada dentro de `dist/`: se regenera en cada build.

## Header y footer
- Viven solo en `src/partials/`. Nunca los pegues dentro de una página.
- Cada página los incluye con las marcas `<!-- @include header -->` y
  `<!-- @include footer -->`. `build.js` las reemplaza al publicar, de modo que
  el HTML final llega completo, sin depender de JavaScript.
- La opción activa del menú se marca con el atributo `data-page` del `<body>`.
- `build.js` no usa dependencias externas. Si una tarea parece requerir una,
  detente y repórtalo.

### Estructura del footer
- Dos tarjetas redondeadas (radio grande, fondo `--color-superficie-1`),
  separadas del borde de la ventana por `--margen-lateral` y entre sí por
  `--espacio-2`. No lleva líneas: las tarjetas hacen de separador.
- Tarjeta principal (`ud-footer__interior`): logotipo, frase, botón de
  cotizar y las cuatro columnas (Construcción, Mantenimiento, Empresa y
  Contacto), con relleno interior generoso en los cuatro lados. "Aviso de
  privacidad" va al final de la columna Empresa, como un enlace más.
- Tarjeta inferior (`ud-footer__legal`), más baja: solo el copyright a la
  izquierda y el sello de SCNDAL a la derecha, en la esquina.
- Columnas de la tarjeta principal:
      celular           todo apilado
      64rem a 80rem     la marca (logotipo, frase y botón) en su propia fila;
                        debajo, en una fila, los tres grupos de enlaces (que
                        se reparten el sobrante) y Contacto (14–18rem)
      desde 80rem       todo en una fila: marca angosta (17.5–20rem), enlaces
                        y Contacto; el sobrante va dos partes a los enlaces y
                        una a Contacto
  Entre 64rem y 80rem no caben las cuatro columnas junto a la marca sin
  apretarse (Contacto quedaba casi en 0 px a 1024).
- Tamaños: el logotipo usa su propio token, `--altura-logo-footer` (el del
  header es `--altura-logo`). En celular 2rem; desde 64rem 3rem, donde el
  bajotítulo del logotipo vigente ya se lee. El sello crece en la misma
  proporción que el logotipo (× 1.5) desde 64rem; en celular conserva
  1.0625rem.

### Sello de SCNDAL
- Archivo `assets/img/marca/White-webtag.svg`, con `alt="SCNDAL"`, `width` y
  `height` según su viewBox (1812.85 × 220.52) y la altura visual del token
  `--altura-sello`.
- Enlaza a https://scndal.com en pestaña nueva (`target="_blank"`,
  `rel="noopener"`) con `aria-label="Sitio desarrollado por SCNDAL"`.
- Atenuado en reposo (`--opacidad-atenuada`) y a opacidad completa al pasar
  el cursor o con foco.

## Sitemap, robots y redirecciones

### sitemap.xml y robots.txt
- `build.js` genera `dist/sitemap.xml` con todas las páginas publicables
  (cada `index.html` de `dist/`), en URL absoluta con
  `https://ultradeck.com.mx` y barra final. Quedan fuera `404.html` y la
  carátula de mantenimiento.
- `lastmod`: las notas del blog llevan su fecha de publicación (se toma de su
  JSON-LD `datePublished`); el resto, la fecha del build.
- `build.js` también escribe `dist/robots.txt`. Con el sitio completo permite
  todo a todos los agentes, incluidos de forma explícita GPTBot, ClaudeBot,
  PerplexityBot y Google-Extended, y declara el sitemap.
- En modo mantenimiento no hay sitemap y `robots.txt` bloquea todo.
- Las páginas siguen con `noindex` hasta el lanzamiento: el rastreo tiene que
  estar permitido para que los buscadores vean ese `noindex`.

### Redirecciones del sitio viejo (vercel.json)
Todas permanentes (308). Cada URL vieja se atiende en sus tres formas —con
`.html`, sin extensión y con barra final— para llegar en un solo salto:

      /index.html                         → /
      /nosotros.html                      → /nosotros/
      /servicios(.html)                   → /construccion/
      /galeria(.html)                     → /#proyectos  (mientras /proyectos/
      /clientes(.html)                    → /#proyectos   esté oculta; ver
      /proyectos(/)                       → /#proyectos   Páginas ocultas)
      /contacto(.html)                    → /#cotizar  (abre el modal)
      /ventajas(.html)                    → /nosotros/
      /sst(.html)                         → /construccion/techos-metalicos/
      cualquier otro *.html               → /  (respaldo)

### Orden de evaluación (por qué no hay cleanUrls ni trailingSlash)
- `vercel.json` es JSON estricto: no admite comentarios y una clave extra
  rompe la validación. Por eso esta explicación vive aquí.
- Vercel evalúa primero las reglas que generan `cleanUrls` y `trailingSlash`
  y solo después las `redirects` propias. Con `cleanUrls`, `/servicios.html`
  se convertía en `/servicios/` (404) antes de llegar a su redirección; con
  `trailingSlash`, `/servicios` recibía la barra antes que su regla.
- El sitio no necesita `cleanUrls`: todas las páginas son carpetas con
  `index.html`. Se quitó.
- La barra final se impone con la **última** regla de `redirects`, que
  replica la de Vercel: cualquier ruta sin punto en el último tramo y sin
  barra final recibe la barra (excepto `/.well-known`). Al ir al final, las
  redirecciones del sitio viejo se evalúan antes.
- Reglas nuevas: van **antes** del respaldo `*.html` y de la regla de la
  barra final.

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
    /mantenimiento/                            La rama completa en una sola
                                               página: techos industriales
                                               (#techos) y canalones y
                                               bajantes (#canalones). Es la
                                               página pilar del blog
    /nosotros/
    /proyectos/                                Oculta: no se publica. Ver
                                               Páginas ocultas
    /aviso-de-privacidad/
    /blog/                                     Índice del blog
    /blog/<slug>/                              Notas. Ver Blog

- `/mantenimiento/techos-industriales/` y `/mantenimiento/canalones-y-bajantes/`
  ya no existen: su contenido se fusionó en `/mantenimiento/`. Nunca fueron
  públicas, así que no tienen redirección.
- No crees páginas fuera de este mapa sin instrucción.

### Menú
- Principal, en orden: Construcción (con submenú), Mantenimiento, Proyectos
  (`/#proyectos`), Nosotros y Blog.
- Submenú de Construcción: Techos metálicos, Estructura metálica, Muros y
  fachadas, Domos e iluminación natural. Mantenimiento no tiene submenú.
- Footer: la columna Mantenimiento lleva "Techos industriales"
  (`/mantenimiento/#techos`) y "Canalones y bajantes"
  (`/mantenimiento/#canalones`); Blog sigue en la columna Empresa.
- No hay página de contacto. Ver Contacto.

### Páginas ocultas
- `/proyectos/` está oculta a la espera de las fotos del cliente. Su fuente
  (`src/proyectos/index.html`) se conserva, pero `build.js` no la publica ni
  la pone en el sitemap: la lista `PAGINAS_OCULTAS` del inicio del archivo.
- Mientras tanto, todo enlace a Proyectos (menú, footer, botón "Ver
  proyectos" del hero del home y tarjeta de la 404) lleva a `/#proyectos`, la
  sección de proyectos del home. Estando en el home se desplaza con Lenis
  (`assets/js/scroll.js`); desde otra página, el salto nativo respeta el
  `scroll-margin-top` de la sección.
- `vercel.json` redirige `/proyectos` y `/proyectos/` a `/#proyectos`, igual
  que `/galeria` y `/clientes` del sitio viejo.
- El botón "Ver todos los proyectos" de la sección de proyectos del home está
  comentado en `src/index.html`.
- Para reactivarla:
    1. Quita `"proyectos"` de `PAGINAS_OCULTAS` en `build.js`.
    2. En `vercel.json`, borra las dos reglas de `/proyectos` y regresa
       `/galeria` y `/clientes` a `/proyectos/`.
    3. Regresa a `/proyectos/` los enlaces del menú, del footer, del hero del
       home y de la 404, y descomenta el botón "Ver todos los proyectos".
    4. Actualiza esta sección, el mapa y la tabla de redirecciones.

## Sistema de diseño

### Dirección visual
- Sitio oscuro sobre grafito neutro, con secciones claras en Tender Light Blue.
- Todo va redondeado: botones tipo píldora, tarjetas e imágenes con esquinas
  amplias.
- El toque tecnológico viene de los detalles, no de adornos: header translúcido
  con desenfoque, títulos grandes y compactos, cifras protagonistas y etiquetas
  tipo cápsula.
- Tender Light Blue es el fondo de las secciones claras en tarjeta (SST Elite y
  Proyectos) y el color con el que se tiñen las imágenes. Medium Seashell
  (`--color-fondo-claro`) es el fondo de la franja clara de Servicios del home.
- El sitio es de ancho completo: header, footer y secciones llegan al borde de
  la ventana, con un único margen lateral mínimo y uniforme (`--margen-lateral`).
  Solo se usa un ancho máximo en una sección cuando se indique expresamente.
- Separación vertical entre secciones del home: `--espacio-12` (48 px). La
  excepción es SST Elite, que queda entre dos franjas claras de borde a borde:
  `--espacio-16` (64 px) en celular y `--espacio-24` (96 px) desde 64rem,
  arriba y abajo, como margen de la propia sección (sección y tarjeta azul son
  el mismo elemento). `--espacio-24` se agregó a la escala para esto.
- Excepciones. Hay dos tokens según lo que pida la sección:
      --margen-seccion          el margen del sitio más el relleno interior de
                                la tarjeta del hero (`--relleno-hero`), para
                                dejar el contenido a plomo con el texto del hero
      --margen-seccion-amplio   el anterior en celular, pero crece con la
                                pantalla: ~150 px en laptop y tope de 12rem
  Secciones que las usan:
      Nosotros del home            --margen-seccion-amplio
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

### Hover de tarjetas (patrón `ud-tarjeta`)
- Un solo efecto para todas las tarjetas del sitio, definido en patrones.css
  con los tokens `--elevacion-tarjeta`, `--zoom-imagen-tarjeta`,
  `--sombra-tarjeta`, `--sombra-tarjeta-clara` y `--transicion-tarjeta`.
- Clases, en el markup de la tarjeta:
      ud-tarjeta            toda tarjeta: al pasar el cursor se marca su borde
      ud-tarjeta--enlace    la tarjeta lleva a otra página: además se eleva y
                            gana sombra, al pasar el cursor y con foco de
                            teclado (en ella o en un enlace de adentro)
      ud-tarjeta--clara     sobre fondo claro: borde y sombra en azul
      ud-tarjeta--fuerte    la tarjeta ya parte de un borde marcado
      ud-tarjeta__imagen    marco de la imagen: recorta y lo de adentro se
                            acerca un poco
- La hoja que dibuja la tarjeta declara su borde con
  `var(--tarjeta-borde, <color de reposo>)`. El patrón cambia esa variable;
  no pongas un `border-color` de hover propio en la hoja de página.
- Con `prefers-reduced-motion` no hay elevación ni acercamiento: solo cambia
  el borde.
- Las pistas de carrusel con tarjetas-enlace llevan respiro arriba y abajo
  (compensado con márgenes) para que la elevación y la sombra no se corten.
- La tarjeta guinda de llamada a la acción de Servicios del home no usa el
  patrón: conserva su propio hover.
- Ya son patrones compartidos: `ud-capsula`, `ud-boton`, `ud-carrusel`,
  `ud-cta`, `ud-migas`, `ud-foto` y `ud-pendiente`, `ud-seccion-clara`,
  `ud-pasos`/`ud-paso`, `ud-proyecto`, `ud-nota`, `ud-pregunta` y `ud-hero`.
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
- Tipografía (Google Fonts): Archivo en títulos, cifras, botones, menú y
  etiquetas; Manrope (400, 500, 600) en párrafos y textos largos.
  DM Sans ya no se usa.
- La petición de Google Fonts incluye el eje de ancho de Archivo y carga solo
  dos combinaciones: ancho normal en 600 y ancho 112.5 en 700
  (`Archivo:wdth,wght@100,600;112.5,700`). Es la misma en todas las páginas.

### Puntos de corte
- Móvil primero. Los del sitio son 48rem (tableta) y 64rem (escritorio); para
  lo que solo aplica en celular se usa `max-width: 63.999rem`.
- 30rem (480 px) es propio de las ramas del home: desde ahí sus tarjetas
  pasan de 3:4 a 4:3 (ver Ramas del home).
- 80rem (1280 px): desde ahí la marca y las cuatro columnas del footer caben
  en una fila (ver Estructura del footer), y las tarjetas de ramas del home
  pasan al degradado de esquina (ver Ramas del home).
- 84rem (1344 px) es propio de los carruseles del blog (`.inicio__notas`) y
  de servicios (`.inicio__servicios`) del home: desde ahí muestran cuatro
  tarjetas completas más el asomo de la quinta; entre 64rem y 84rem, tres más
  el asomo. Antes de 84rem la tarjeta quedaría por debajo de ~221 px (blog) o
  ~230 px (servicios): los títulos largos se partirían en cinco o seis líneas
  o, en servicios, "policarbonato" no cabría y se partiría a media palabra.
  Los títulos de las tarjetas de servicios usan `--titulo-tarjeta`.

### Texto del hero del home sobre el video
- Un degradado decorativo (`.inicio__hero-foto::after`, sin texto, que los
  lectores de pantalla no anuncian) oscurece solo la zona del texto, con el
  fondo al 86 %:
      antes de 64rem    franja de arriba (las cifras van debajo del texto),
                        plena hasta el 45 % del alto y limpia desde el 62 %
      desde 64rem       radial desde la esquina inferior izquierda; la zona
                        de las cifras, a la derecha, queda casi limpia
  No hay velo parejo sobre todo el hero.
- La cápsula del hero tiene fondo sólido: `--color-guinda-vivo` con texto
  `--color-blanco` (7.5:1, no depende del video). Es un override acotado al
  hero; el patrón `ud-capsula` no cambia.
- El párrafo (`inicio__entrada`) va en `--color-texto`, no en el gris suave.
- Contraste medido sobre 30 cuadros del video (dos por segundo) en 390, 768,
  1024 y 1440 px: el párrafo da 8.4:1 o más en el peor cuadro. Si cambia el
  video, hay que volver a medir.

### Ramas del home
- Sección entre la barra de clientes y Servicios (`inicio__ramas`), con el
  margen `--margen-seccion-amplio` de las secciones de abajo (como SST Elite)
  y `--espacio-8` entre tarjetas. Dos tarjetas del mismo alto, Construcción y
  Mantenimiento: foto de fondo, H2, texto breve y botón "Ver más" a la página
  de la rama. La tarjeta no es enlace; el enlace es el botón (con texto
  oculto " de Construcción" / " de Mantenimiento" para lectores de
  pantalla). Llevan `ud-tarjeta`: solo el borde al pasar el cursor.
- Montaje: la barra de clientes queda a caballo sobre el borde superior de
  las tarjetas. La sección de ramas sube `--espacio-24` (96 px, cerca de la
  mitad del alto de la barra) y la barra va por encima (`z-index: 1`, debajo
  del header y del botón de WhatsApp). Las tarjetas suman ese mismo valor a
  su relleno superior (y el marcador de foto al suyo), así la barra nunca
  tapa texto. Se conserva en celular, donde solo monta sobre la primera
  tarjeta.
- Contenido abajo a la izquierda, con su ancho de lectura; desde 64rem, el
  de Mantenimiento (segunda tarjeta) abajo a la derecha.
- Celular: apiladas, en 3:4, las dos con el contenido abajo a la izquierda.
  Desde 30rem (480 px), en 4:3: apiladas hasta 64rem y en dos columnas desde
  ahí. Así, entre ~600 y 1023 px miden ~360–600 px de alto en lugar de
  ~1000. Crecen si el contenido no cabe.
- Fotos: Construcción usa `hero/estructura-metalica.webp` (obra en proceso);
  Mantenimiento lleva el marcador `[PENDIENTE: foto de mantenimiento]` sobre
  el mismo fondo que el hero interior sin foto.
- Degradado donde está el texto, con el fondo al 84 %: hasta 80rem, lineal
  desde abajo (pleno hasta el 70 % del alto, limpio arriba), porque el texto
  ocupa casi todo el ancho de la tarjeta; desde 80rem, radial desde la
  esquina del texto (abajo a la izquierda o a la derecha). Medido sobre la
  foto de Construcción: el párrafo da 5:1 o más (AA) en 390, 430, 480, 600,
  768, 900, 1000, 1024, 1280, 1440 y 1920 px; sobre el marcador, 7.3:1.

### Títulos
- H1, H2 y H3 de todo el sitio, y los títulos de tarjeta aunque no sean
  encabezado (`ud-cta__titulo`, `nota__relacionada-titulo`): Archivo Bold
  semi expandida. Tokens: `--peso-encabezado: 700` y
  `--ancho-encabezado: 112.5%`.
- Cifras, botones, menú y etiquetas cápsula no cambian: Archivo SemiBold de
  ancho normal (`--peso-titulo: 600`). Dos excepciones son H2
  con estilo de etiqueta y se quedan en ancho normal: los títulos de columna
  del footer y el título de la barra de clientes del home
  (`inicio__clientes-titulo`).
- Los tamaños salen de la escala de títulos de tokens.css, nunca de un valor
  suelto en la hoja de página:
      --titulo-hero          H1 de los heros
      --titulo-seccion       H2 de sección del home y H1 sin hero (blog, nota,
                             aviso, 404)
      --titulo-subseccion    H2 de las plantillas de servicio, rama, Mantenimiento,
                             Nosotros y Proyectos
      --titulo-bloque        H2 del cuerpo de nota y nota destacada del blog
      --titulo-tarjeta       títulos de tarjeta grandes (proyectos, CTA, modal)
      --titulo-tarjeta-sm    títulos de tarjeta chicos (servicios, pasos, notas)
  Para subir o bajar todos los títulos se ajusta la escala, no cada título.
- Las cifras del hero del home (`inicio__hero-cifra-numero`) usan
  `--titulo-seccion`. En escritorio sus cuatro tarjetas ocupan el alto
  completo del hero, dentro de su relleno, repartido en partes iguales; cifra
  y etiqueta quedan juntas al centro de cada tarjeta. En celular van debajo
  del texto, a su alto natural. No usan el patrón `ud-cifras`.
- Realce de esas cifras: un borde en `--color-guinda-claro` (más una línea
  interior del mismo color, sin cambiar el tamaño de la caja) recorre las
  cuatro tarjetas, una a la vez y en bucle. Solo CSS: la misma animación con
  un cuarto de vuelta de desfase por tarjeta. Vuelta completa en
  `--duracion-cifras` (10 s, 2.5 s por tarjeta: 0.4 s de entrada, 1.7 s firme
  y 0.4 s de salida). Con `prefers-reduced-motion` no hay realce: las cuatro
  quedan como en reposo. Es decorativo: no cambia nada para los lectores de
  pantalla.
- Los títulos llevan `text-wrap: balance`, así sus líneas quedan parejas.
  Donde un título debe partirse en un punto concreto, además lleva un
  `max-width` en `em`; con la fuente ancha, ese valor se mide en el navegador
  (por ejemplo, el hero del home: 16em para "Construimos y mantenemos" /
  "techos para naves industriales").

### Marca
- El nombre se escribe "Ultra Deck" en texto corrido.
- El isotipo nunca se separa del logotipo.
- Todo el sitio usa el mismo logotipo claro, también las páginas de
  Mantenimiento.
- Usa solo los SVG de `assets/img/marca/`. No redibujes ni modifiques logotipos.
- Los archivos y dónde se usa cada uno:
      ultradeck-claro.svg                             logotipo vigente, en un
                                                      color claro (#f0f0f0) para
                                                      fondo oscuro. viewBox
                                                      1881.14 × 356.11 (en el
                                                      markup, 1881 × 356). Header,
                                                      footer y carátula de
                                                      mantenimiento
      ultradeck-logo.svg                              logotipo anterior a color.
                                                      Solo lo usa el JSON-LD
                                                      (logo de Organization en
                                                      Nosotros y de publisher en
                                                      las notas), porque necesita
                                                      verse sobre fondo blanco.
                                                      Se reemplaza cuando llegue
                                                      la versión a color del
                                                      logotipo nuevo
      White-webtag.svg                                sello de SCNDAL en el
                                                      footer (ver Sello de
                                                      SCNDAL). No es de Ultra
                                                      Deck
      favicon.png                                     favicon y apple-touch-icon
                                                      de todas las páginas.
                                                      500 × 500 px
- El favicon es la única excepción a la regla de no separar el isotipo del
  logotipo.
- El logotipo lleva `alt="Ultra Deck"`, `width` y `height` según su viewBox, y
  la altura visual sale de un token:
      --altura-logo          2rem   header y carátula de mantenimiento
                                    (~169 px de ancho)
      --altura-logo-footer   2rem en celular, 3rem desde 64rem (~254 px de
                             ancho); a 3rem el bajotítulo mide ~6 px
      --altura-sello         sello de SCNDAL: 1.0625rem en celular,
                             1.0625rem × 1.5 desde 64rem (~25 px de alto,
                             ~210 px de ancho)

## Contacto
- No hay página de contacto. Todo botón de cotizar abre el modal de cotización
  (`src/partials/cotizacion.html`, comportamiento en `assets/js/cotizacion.js`).
- El modal se abre desde cualquier elemento con `data-abrir-cotizacion` y al
  cargar cualquier página cuya URL traiga `#cotizar`.

## WhatsApp
- Botón flotante (`ud-whatsapp`) en todas las páginas, abajo a la derecha:
  guinda vivo con ícono blanco (no el verde de WhatsApp), `--z-flotante`
  (sobre el contenido, bajo el header; los modales quedan encima). Se aparta
  mientras el footer está a la vista. Llega con `hidden` y lo muestra el
  JavaScript, porque sin él no abre nada.
- No lleva directo a WhatsApp: abre un diálogo compacto (`ud-modal
  ud-modal--compacto`, ancho `--ancho-modal-compacto`) con Nombre y Teléfono
  obligatorios y la casilla del aviso de privacidad, como el de cotización.
  En celular el diálogo se ancla arriba para que el teclado no tape los
  campos.
- Al continuar abre `wa.me` en pestaña nueva con el mensaje: "Hola, soy
  <nombre>. Me gustaría recibir información sobre sus servicios para mi nave
  industrial."
- Markup: al final de `src/partials/cotizacion.html`, que ya incluyen todas
  las páginas. Comportamiento: `assets/js/cotizacion.js`, que comparte con
  la cotización la función `prepararModal` (apertura, cierre con botón,
  Escape y clic fuera, y foco). `scroll.js` detiene Lenis con cualquier
  `dialog.ud-modal` abierto.
- **Número pendiente**: vive solo en el atributo `data-whatsapp-numero` del
  formulario `#whatsapp-forma` (en `cotizacion.html`), marcado con
  `[PENDIENTE]`. Solo dígitos, con lada de país y sin "+".
- El teléfono capturado no se envía a ningún lado todavía. Para mandarlo por
  correo con Resend se completa `registrarContacto(datos)` en
  `cotizacion.js` (está el `fetch` de ejemplo): sin esperar respuesta, para
  no bloquear la pestaña de WhatsApp. `form_success` solo cuando el backend
  confirme.

## Hero de las páginas interiores
- Lo comparten Nosotros, `/construccion/`, `/mantenimiento/` y las cuatro
  páginas de servicio. No aplica al home, que tiene el suyo.
- Es una tarjeta con las proporciones del hero del home: margen
  `--margen-lateral` a los lados y arriba, y el mismo alto mínimo
  (`100svh` menos el header y tres márgenes laterales), así llena la pantalla
  bajo el header. Si el contenido no cabe, crece; en celular aplica el mismo
  criterio que el home. Radio `--radio-lg` y la foto recortada dentro del
  redondeo.
- Migas, cápsula, título, entrada y botón van centrados en horizontal y en
  vertical; el texto conserva su ancho de lectura (`--ancho-texto`).
- Sobre la foto no hay velo parejo: un degradado radial oscurece solo detrás
  del texto y deja limpias las orillas. Su radio horizontal es
  `--ancho-texto × 1.1`, así el párrafo cae en la zona plena con cualquier
  ancho de tarjeta, y su centro va al medio del alto, como el contenido.
  Intensidad: el fondo al 84 % en esa zona, medida contra las siete fotos de
  obra con la tarjeta a pantalla completa para que el párrafo cumpla AA (5:1
  o más en 390, 1024, 1440 y 1920 px). Si entra una foto nueva más clara, hay que volver a
  medirla antes de subir la intensidad para todas.
- En celular el texto ocupa casi todo el ancho, así que el degradado cubre
  casi toda la tarjeta; el ajuste fino queda para la etapa responsive.
- El degradado vive en el token `--degradado-texto-foto` (tokens.css), que
  también usan las ramas del home.
- Es el patrón `ud-hero` de `patrones.css`. Clases, en el markup:
      ud-hero               la sección: tarjeta, degradado (::after)
      ud-hero__foto         el fondo: la foto o, sin ella, el marcador
      ud-hero__imagen       la foto, a todo el fondo
      ud-hero__contenido    migas, cápsula, H1, entrada y botón, centrados
  Lo propio de cada plantilla (el `max-width` del H1 y la entrada) sigue en
  `servicio.css`, `rama.css` y `nosotros.css`, con sus clases de página
  (`servicio__titulo`, `rama__entrada`, `nos__titulo`…).

## Nosotros
- `/nosotros/` tiene estructura propia: `data-plantilla="nosotros"` y la hoja
  `assets/css/paginas/nosotros.css`.
- Estructura: hero a pantalla completa, historia en línea de tiempo, misión y
  visión, valores (sección clara, ver abajo), maquinaria e infraestructura,
  certificaciones con insignias, las cuatro cifras, carrusel de proyectos y
  cierre.
- **El JSON-LD de `Organization` del sitio completo vive en esta página**:
  nombre legal, fundación, domicilio, teléfonos, correo y logotipo. Si cambia
  un dato de la empresa, se actualiza aquí.
- Valores: tarjeta clara (`nos__seccion--valores`) con el margen
  (`--margen-seccion-amplio`) y el relleno de la de SST Elite del home, no de
  borde a borde. En escritorio, dos columnas: a la izquierda cápsula, H2 y
  párrafo; a la derecha los seis valores en una sola lista vertical, con su
  filete guinda. En celular se apilan: primero el texto, después la lista.
- Misión y visión son redacción propia y siguen la regla de Terminología sin
  excepción. Están pendientes de visto bueno del cliente.

## Páginas de rama
- `/construccion/` usa la plantilla de rama: `body` con
  `data-plantilla="rama"` y `data-page="construccion"`. Estilos en
  `assets/css/paginas/rama.css`. `/mantenimiento/` tiene estructura propia
  (ver Mantenimiento).
- Son páginas cortas de reparto: migas, hero a pantalla completa, introducción,
  tarjetas de los servicios de la rama, carrusel de proyectos, confianza con
  insignias, preguntas frecuentes y cierre.
- JSON-LD de `CollectionPage` (con las páginas hijas) y `BreadcrumbList`.

## Mantenimiento
- `/mantenimiento/` es la rama completa en una sola página y la página pilar
  del blog. Estructura propia: `body` con `data-page="mantenimiento"` (sin
  plantilla) y la hoja `assets/css/paginas/rama-mantenimiento.css`.
- Estructura: migas (Inicio › Mantenimiento), hero con el patrón `ud-hero`
  y el teléfono ("o llámenos ahora") centrado debajo del botón, introducción, señales de alerta, techos industriales (`#techos`:
  preventivo y correctivo), canalones y bajantes (`#canalones`: cuatro
  tarjetas), "Sin detener su operación" (sección clara), proceso propio de
  mantenimiento, confianza con insignias y marcas, carrusel de proyectos,
  preguntas frecuentes de los dos servicios, carrusel con las 8 notas del
  blog y cierre.
- JSON-LD: dos `Service` (techos y canalones, con su ancla) y
  `BreadcrumbList`; el de `FAQPage` va comentado hasta que las respuestas
  sean reales.

## Plantilla de servicio
- La comparten las 4 páginas de servicio de Construcción: `body` con `data-plantilla="servicio"`
  y `data-page` igual al slug. Los estilos propios viven en
  `assets/css/paginas/servicio.css`; lo compartido, en `patrones.css`.
- Márgenes laterales: el amplio (`--margen-seccion-amplio`), como en el home.
- Estructura, en orden:
      migas de pan (Inicio › rama › página)
      hero a pantalla completa: foto con degradado, cápsula de la rama, H1, entrada y
        botón que abre el modal
      introducción: H2 y dos o tres párrafos
      "Qué incluye": tarjetas de los sistemas o productos de esa página
      diferenciadores: 4 puntos con ícono, sobre sección clara
      proceso: los mismos 4 pasos del home
      proyectos: el carrusel con las mismas obras, sobre sección clara
      preguntas frecuentes: 4 `<details>`
      notas del blog relacionadas: 3 tarjetas
      cierre: la caja `ud-cta`
- JSON-LD de `Service` y `BreadcrumbList`. El de `FAQPage` se activa solo
  cuando las preguntas tengan texto real; mientras tanto va comentado.

## Blog
- El índice vive en `/blog/` y las notas en `/blog/slug/`. La página pilar
  es `/mantenimiento/`: el enlace destacado de cada nota apunta ahí (la nota
  de canalones, además, a `/mantenimiento/#canalones`).
- Todo título y todo slug de nota incluye "industrial" o "nave industrial",
  para no atraer búsquedas de techos residenciales.
- Todas las notas comparten la plantilla: `body` con `data-plantilla="nota"` y
  `data-page` igual al slug, y la hoja `assets/css/paginas/nota.css`. El
  comportamiento del índice va en `assets/js/nota.js`.
- Dentro de una nota, el menú marca Blog como la sección en la que se está
  (`ud-nav__enlace--rama`); en `/blog/`, como página activa.
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
- Tarjetas de nota (patrón `ud-nota` en el home, `/mantenimiento/` y las
  páginas de servicio; `blog__*` en el índice del blog):
    · El título es el elemento principal: `--titulo-tarjeta`.
    · La cápsula de categoría va por debajo: Manrope (`--fuente-texto`) en
      `--peso-medio`, no Archivo seminegra. Archivo solo se carga en 600 y
      700, así que bajarle el peso no surtiría efecto.
    · El pie lleva solo la fecha, sin tiempo de lectura. El tiempo de lectura
      se muestra únicamente en el encabezado de cada nota, junto a la fecha.
  Las notas relacionadas al pie de cada nota no llevan cápsula ni pie.
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
- El hero del home usa video de fondo, con imagen de respaldo. Dos archivos
  en `hero/`:
      inicio.mp4           el video: en bucle, silenciado, sin audio ni
                           controles y decorativo (`aria-hidden`)
      inicio.webp          doble función: póster del video mientras carga y
                           respaldo debajo de él, que es lo que se ve sin
                           JavaScript, con `prefers-reduced-motion` o si el
                           video no se puede reproducir
  No se precarga: lo arranca `assets/js/video-hero.js` cuando la página
  terminó de cargar.
- Fotos de obra genéricas. **Su origen no está identificado**: no se sabe de
  qué obra ni de qué cliente es cada una. Se usan solo como apoyo visual,
  nunca como "proyecto de [cliente]"; su `alt` describe lo que se ve, sin
  nombrar empresa, lugar ni cliente, y no llevan pie de foto. Todas de
  2400 × 1350 px, sin versión vertical para celular todavía (pendiente
  anotado en cada hero):
      empresa/maquinaria/perfiladora-en-obra.webp
                                   hero de /nosotros/ y de
                                   /construccion/techos-metalicos/. Una sola
                                   copia para las dos páginas, por eso no
                                   sigue el nombre por `data-page` de `hero/`
      hero/domos-e-iluminacion.webp     hero de /construccion/domos-e-iluminacion/
                                        (nave terminada con domos continuos)
      hero/estructura-metalica.webp     hero de /construccion/estructura-metalica/
                                        y tarjeta "Estructura metálica" de
                                        /construccion/ (estructura metálica
                                        expuesta)
      hero/muros-y-fachadas.webp        hero de /construccion/muros-y-fachadas/
                                        y tarjeta "Muros y fachadas" de
                                        /construccion/ (nave terminada con
                                        fachada clara)
      hero/construccion.webp            hero de /construccion/
                                        (parque industrial, vista aérea)
      servicios/techos-metalicos/cuadrilla-instalando-lamina.webp
                                   tarjeta "Techos metálicos" de /construccion/
      servicios/domos-e-iluminacion/techo-con-domos-en-proceso.webp
                                   tarjeta "Domos e iluminación natural" de
                                   /construccion/
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
