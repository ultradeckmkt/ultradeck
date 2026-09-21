/**
 * Arma el sitio final en dist/.
 *
 * Borra dist/, copia src/ y assets/, sustituye las marcas
 * <!-- @include nombre --> por el contenido de src/partials/nombre.html,
 * pone el año en curso y marca en el menú la página activa.
 * Sin dependencias externas.
 */

const fs = require("node:fs");
const path = require("node:path");

// ---------------------------------------------------------------------------
// MODO MANTENIMIENTO
//
// true  → dist/ contiene solo la carátula de src/mantenimiento-temporal.html
//         como index.html, más los archivos de assets/ que esa página usa.
//         Ninguna otra página del sitio se publica.
// false → el sitio se arma completo y la carátula no se publica.
//
// Se cambia a mano aquí y hay que volver a correr `node build.js`.
// ---------------------------------------------------------------------------
const MODO_MANTENIMIENTO = false;

const raiz = __dirname;
const dirSrc = path.join(raiz, "src");
const dirAssets = path.join(raiz, "assets");
const dirPartials = path.join(dirSrc, "partials");
const dirDist = path.join(raiz, "dist");

const DOMINIO = "https://ultradeck.com.mx";
const CARATULA = "mantenimiento-temporal.html";

// Rastreadores de IA que se permiten de forma explícita en robots.txt.
const RASTREADORES_IA = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
const RECURSO = /(?:href|src)="(\/assets\/[^"]+)"/g;

const MARCA = /<!--\s*@include\s+([\w-]+)\s*-->/g;
const MARCA_ANIO = /\[año\]/g;
const ENLACE_NAV = /<a\b([^>]*\bclass="[^"]*\bud-nav__enlace\b[^"]*"[^>]*)>/g;

// Andamiaje del repositorio: no tiene nada que hacer en el sitio publicado.
const IGNORADOS = new Set([".DS_Store", ".gitkeep"]);

function sePublica(origen) {
  return !IGNORADOS.has(path.basename(origen));
}

/** Lee un partial una sola vez y lo guarda para las demás páginas. */
const cache = new Map();

function leerPartial(nombre, pagina) {
  if (cache.has(nombre)) return cache.get(nombre);

  const archivo = path.join(dirPartials, `${nombre}.html`);
  if (!fs.existsSync(archivo)) {
    const relativa = path.relative(raiz, pagina);
    throw new Error(
      `${relativa} incluye "${nombre}", pero no existe src/partials/${nombre}.html`,
    );
  }

  const contenido = fs.readFileSync(archivo, "utf8");
  cache.set(nombre, contenido);
  return contenido;
}

/**
 * La URL que tendrá el archivo publicado. Solo las páginas de carpeta
 * (index.html) tienen ruta propia; 404.html no es una ruta del sitio.
 */
function rutaPublicada(archivo) {
  if (path.basename(archivo) !== "index.html") return null;

  const carpeta = path.relative(dirDist, path.dirname(archivo));
  if (!carpeta) return "/";

  return `/${carpeta.split(path.sep).join("/")}/`;
}

function agregarClase(atributos, clase) {
  return atributos.replace(/class="([^"]*)"/, `class="$1 ${clase}"`);
}

/**
 * Marca en el menú el enlace de la página y, en las subpáginas, la rama a la
 * que pertenecen. Así el estado activo llega en el HTML, sin JavaScript.
 */
function marcarActivos(html, ruta) {
  if (!ruta) return html;

  return html.replace(ENLACE_NAV, (etiqueta, atributos) => {
    const href = (atributos.match(/href="([^"]*)"/) || [])[1];
    if (!href) return etiqueta;

    if (href === ruta) {
      return `<a${agregarClase(atributos, "ud-nav__enlace--activo")} aria-current="page">`;
    }

    if (href !== "/" && ruta.startsWith(href)) {
      return `<a${agregarClase(atributos, "ud-nav__enlace--rama")}>`;
    }

    return etiqueta;
  });
}

/** Recorre dist/ y deja cada .html listo para publicar. */
function procesarHtml(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);

    if (entrada.isDirectory()) {
      procesarHtml(ruta);
      continue;
    }

    if (!entrada.name.endsWith(".html")) continue;

    const original = fs.readFileSync(ruta, "utf8");
    let final = original.replace(MARCA, (_, nombre) => leerPartial(nombre, ruta));
    final = final.replace(MARCA_ANIO, String(new Date().getFullYear()));
    final = marcarActivos(final, rutaPublicada(ruta));

    if (final !== original) fs.writeFileSync(ruta, final);
  }
}

/** Fecha del build (AAAA-MM-DD), en la zona de quien lo corre. En Vercel es UTC. */
function hoy() {
  const fecha = new Date();
  const dos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

/** Todas las páginas publicables: cada index.html de dist/, con su URL. */
function paginasPublicables(dir, lista = []) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      paginasPublicables(ruta, lista);
    } else if (entrada.name === "index.html") {
      lista.push(ruta);
    }
  }
  return lista;
}

/**
 * dist/sitemap.xml con todas las páginas. Las notas del blog llevan su fecha
 * de publicación (la toman de su JSON-LD); el resto, la fecha del build.
 */
function generarSitemap() {
  const fechaBuild = hoy();
  const urls = paginasPublicables(dirDist)
    .map((archivo) => {
      const html = fs.readFileSync(archivo, "utf8");
      const publicada = html.match(/"datePublished":\s*"(\d{4}-\d{2}-\d{2})"/);
      return {
        loc: DOMINIO + rutaPublicada(archivo),
        lastmod: publicada ? publicada[1] : fechaBuild,
      };
    })
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const cuerpo = urls
    .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
    .join("\n");

  fs.writeFileSync(
    path.join(dirDist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${cuerpo}\n</urlset>\n`,
  );
  return urls.length;
}

/**
 * dist/robots.txt. En el sitio completo permite todo, incluidos los
 * rastreadores de IA, y declara el sitemap. En mantenimiento bloquea todo.
 */
function escribirRobots(mantenimiento) {
  let texto;
  if (mantenimiento) {
    texto = "User-agent: *\nDisallow: /\n";
  } else {
    const bloques = ["*", ...RASTREADORES_IA].map(
      (agente) => `User-agent: ${agente}\nAllow: /\n`,
    );
    texto = `${bloques.join("\n")}\nSitemap: ${DOMINIO}/sitemap.xml\n`;
  }
  fs.writeFileSync(path.join(dirDist, "robots.txt"), texto);
}

/** Solo la carátula, con los archivos de assets/ que ella misma referencia. */
function construirCaratula() {
  const origen = path.join(dirSrc, CARATULA);
  if (!fs.existsSync(origen)) {
    throw new Error(`falta src/${CARATULA}, que es la carátula de mantenimiento`);
  }

  const html = fs.readFileSync(origen, "utf8");
  fs.mkdirSync(dirDist, { recursive: true });
  fs.writeFileSync(path.join(dirDist, "index.html"), html);

  const recursos = new Set();
  for (const coincidencia of html.matchAll(RECURSO)) {
    recursos.add(coincidencia[1]);
  }

  for (const recurso of recursos) {
    const desde = path.join(raiz, recurso);
    if (!fs.existsSync(desde)) {
      throw new Error(`la carátula pide ${recurso}, que no existe`);
    }

    const hasta = path.join(dirDist, recurso);
    fs.mkdirSync(path.dirname(hasta), { recursive: true });
    fs.copyFileSync(desde, hasta);
  }

  escribirRobots(true);
  return recursos.size;
}

/** El sitio completo. */
function construirSitio() {
  // src/ se publica en la raíz; los partials son fragmentos, no páginas, y la
  // carátula solo sale en modo mantenimiento.
  fs.cpSync(dirSrc, dirDist, {
    recursive: true,
    filter: (origen) =>
      origen !== dirPartials &&
      origen !== path.join(dirSrc, CARATULA) &&
      sePublica(origen),
  });

  fs.cpSync(dirAssets, path.join(dirDist, "assets"), {
    recursive: true,
    filter: sePublica,
  });

  procesarHtml(dirDist);
  escribirRobots(false);
  return generarSitemap();
}

function construir() {
  fs.rmSync(dirDist, { recursive: true, force: true });

  if (MODO_MANTENIMIENTO) return construirCaratula();
  return construirSitio();
}

try {
  const recursos = construir();

  if (MODO_MANTENIMIENTO) {
    console.log("──────────────────────────────────────────────");
    console.log("  MODO MANTENIMIENTO: solo la carátula");
    console.log(`  dist/index.html + ${recursos} archivo(s) de assets/`);
    console.log("  El resto del sitio NO se publicó. robots.txt bloquea todo.");
    console.log("  Se apaga en la constante MODO_MANTENIMIENTO de build.js.");
    console.log("──────────────────────────────────────────────");
  } else {
    console.log("──────────────────────────────────────────────");
    console.log("  SITIO COMPLETO");
    console.log(`  sitemap.xml con ${recursos} página(s) · robots.txt abierto`);
    console.log("──────────────────────────────────────────────");
  }
} catch (error) {
  console.error(`Build fallido: ${error.message}`);
  process.exit(1);
}
