/**
 * Arma el sitio final en dist/.
 *
 * Borra dist/, copia src/ y assets/, y sustituye las marcas
 * <!-- @include nombre --> por el contenido de src/partials/nombre.html.
 * Sin dependencias externas.
 */

const fs = require("node:fs");
const path = require("node:path");

const raiz = __dirname;
const dirSrc = path.join(raiz, "src");
const dirAssets = path.join(raiz, "assets");
const dirPartials = path.join(dirSrc, "partials");
const dirDist = path.join(raiz, "dist");

const MARCA = /<!--\s*@include\s+([\w-]+)\s*-->/g;

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

/** Recorre dist/ y resuelve las marcas de cada .html. */
function resolverIncludes(dir) {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const ruta = path.join(dir, entrada.name);

    if (entrada.isDirectory()) {
      resolverIncludes(ruta);
      continue;
    }

    if (!entrada.name.endsWith(".html")) continue;

    const original = fs.readFileSync(ruta, "utf8");
    const final = original.replace(MARCA, (_, nombre) =>
      leerPartial(nombre, ruta),
    );

    if (final !== original) fs.writeFileSync(ruta, final);
  }
}

function construir() {
  fs.rmSync(dirDist, { recursive: true, force: true });

  // src/ se publica en la raíz; los partials son fragmentos, no páginas.
  fs.cpSync(dirSrc, dirDist, {
    recursive: true,
    filter: (origen) => origen !== dirPartials,
  });

  fs.cpSync(dirAssets, path.join(dirDist, "assets"), { recursive: true });

  resolverIncludes(dirDist);
}

try {
  construir();
  console.log("Build listo en dist/");
} catch (error) {
  console.error(`Build fallido: ${error.message}`);
  process.exit(1);
}
