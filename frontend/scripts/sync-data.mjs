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

// ---------------------------------------------------------------------------
// Coordenadas: la semilla manda. El front las aplica por slug aunque la API o
// una copia en caché todavía tengan coordenadas antiguas.
// ---------------------------------------------------------------------------
const coords = Object.fromEntries(
  places.map((p) => [p.slug, [p.latitude, p.longitude, p.coordsVerified ? 1 : 0]])
);
fs.writeFileSync(
  path.resolve(here, "../src/data/coords.json"),
  JSON.stringify(coords, null, 2) + "\n"
);

// ---------------------------------------------------------------------------
// Medios por sitio: se detectan solos según el nombre del archivo dentro de
// public/media/sitios/<slug>/ (ver LEEME.md de esa carpeta).
//   portada.(jpg|webp|png)      → foto principal
//   360.jpg, 360-2.jpg…         → panorámicas 360° (2:1)
//   video.mp4                   → video corto
//   foto-01.jpg, foto-02.jpg…   → galería
// Las carpetas que empiezan con "_" (p. ej. _por-revisar) se ignoran.
// ---------------------------------------------------------------------------
const sitesDir = path.resolve(here, "../public/media/sitios");
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const MAX_GALLERY = 12;
const manifest = {};
const known = new Set(places.map((p) => p.slug));
const unknownFolders = [];

if (fs.existsSync(sitesDir)) {
  const byName = (a, b) => a.localeCompare(b, "en", { numeric: true });
  for (const entry of fs.readdirSync(sitesDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const slug = entry.name;
    if (!known.has(slug)) unknownFolders.push(slug);
    const files = fs
      .readdirSync(path.join(sitesDir, slug))
      .filter((file) => !file.startsWith("."))
      .sort(byName);
    const url = (file) => `/media/sitios/${slug}/${file}`;
    const cover = files.find((file) => /^portada\./i.test(file) && IMAGE.test(file));
    const panos = files.filter((file) => /^360(-\d+)?\./i.test(file) && IMAGE.test(file));
    const video = files.find((file) => /^video\.(mp4|webm)$/i.test(file));
    const photos = files.filter((file) => /^foto-/i.test(file) && IMAGE.test(file)).slice(0, MAX_GALLERY);
    const item = {};
    if (cover) item.cover = url(cover);
    if (panos.length) item.panos = panos.map(url);
    if (video) item.video = url(video);
    if (photos.length) item.photos = photos.map(url);
    if (Object.keys(item).length) manifest[slug] = item;
  }
}

fs.writeFileSync(
  path.resolve(here, "../src/data/media-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);
const totals = Object.values(manifest).reduce(
  (sum, item) => ({
    panos: sum.panos + (item.panos?.length ?? 0),
    photos: sum.photos + (item.photos?.length ?? 0),
    videos: sum.videos + (item.video ? 1 : 0),
  }),
  { panos: 0, photos: 0, videos: 0 }
);
console.log(
  `sync-data: medios de ${Object.keys(manifest).length} sitios (${totals.panos} panorámicas 360°, ${totals.photos} fotos, ${totals.videos} videos)`
);
if (unknownFolders.length) {
  console.warn(`sync-data: carpetas sin lugar en el catálogo (revisa el nombre): ${unknownFolders.join(", ")}`);
}
