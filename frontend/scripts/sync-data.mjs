// Copia database/seed/*.json -> frontend/public/data/places.json (respaldo sin conexión).
// Se ejecuta solo antes de `dev` y `build`. Si no encuentra la carpeta database (p. ej. el front
// se despliega solo), conserva el archivo ya commiteado.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const seedDir = path.resolve(here, "../../database/seed");
const outFile = path.resolve(here, "../public/data/places.json");

if (!fs.existsSync(path.join(seedDir, "places.json"))) {
  console.log("sync-data: no hay database/seed; se conserva public/data/places.json");
  process.exit(0);
}

const categories = JSON.parse(fs.readFileSync(path.join(seedDir, "categories.json"), "utf8"));
const places = JSON.parse(fs.readFileSync(path.join(seedDir, "places.json"), "utf8"));
const names = new Map(categories.map((c) => [c.slug, c.name]));

// Misma forma que devuelve la API (contrato Place): si el JSON no trae `media`,
// se arma con imageUrl/panoUrl para que la galería funcione también sin conexión.
function mediaOf(p) {
  const media = (p.media ?? []).map((m) => ({
    kind: m.kind,
    url: m.url,
    caption: m.caption ?? null,
    credit: m.credit ?? null,
  }));
  const has = (url) => media.some((m) => m.url === url);
  if (p.imageUrl && !has(p.imageUrl)) media.unshift({ kind: "photo", url: p.imageUrl, caption: null, credit: null });
  if (p.panoUrl && !has(p.panoUrl)) media.push({ kind: "pano", url: p.panoUrl, caption: null, credit: null });
  return media;
}

const data = places.map((p) => ({
  ...p,
  categoryName: names.get(p.category) ?? p.category,
  media: mediaOf(p),
}));
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ data, meta: { count: data.length } }, null, 2) + "\n");
console.log(`sync-data: ${data.length} lugares -> public/data/places.json`);
