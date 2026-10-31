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

const data = places.map((p) => ({ ...p, categoryName: names.get(p.category) ?? p.category }));
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ data, meta: { count: data.length } }, null, 2) + "\n");
console.log(`sync-data: ${data.length} lugares -> public/data/places.json`);
