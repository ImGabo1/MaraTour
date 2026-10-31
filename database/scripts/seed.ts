import fs from "node:fs";
import path from "node:path";
import { createPool } from "./db";

interface SeedCategory {
  slug: string;
  name: string;
  sortOrder: number;
}

interface SeedPlace {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  history: string;
  address: string;
  latitude: number;
  longitude: number;
  coordsVerified: boolean;
  imageUrl: string | null;
  panoUrl: string | null;
  tags: string[];
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, "../seed", file), "utf8")) as T;
}

// Idempotente: se puede correr varias veces (hace upsert por slug).
async function main(): Promise<void> {
  const categories = readJson<SeedCategory[]>("categories.json");
  const places = readJson<SeedPlace[]>("places.json");
  const pool = createPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    for (const c of categories) {
      await client.query(
        `INSERT INTO categories (slug, name, sort_order) VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order`,
        [c.slug, c.name, c.sortOrder]
      );
    }
    for (const p of places) {
      await client.query(
        `INSERT INTO places
           (slug, name, category_slug, short_description, history, address,
            latitude, longitude, coords_verified, image_url, pano_url, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           category_slug = EXCLUDED.category_slug,
           short_description = EXCLUDED.short_description,
           history = EXCLUDED.history,
           address = EXCLUDED.address,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           coords_verified = EXCLUDED.coords_verified,
           image_url = EXCLUDED.image_url,
           pano_url = EXCLUDED.pano_url,
           tags = EXCLUDED.tags,
           updated_at = now()`,
        [
          p.slug, p.name, p.category, p.shortDescription, p.history, p.address,
          p.latitude, p.longitude, p.coordsVerified, p.imageUrl, p.panoUrl, p.tags,
        ]
      );
    }
    await client.query("COMMIT");
    console.log(`✔ ${categories.length} categorías y ${places.length} lugares cargados.`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
