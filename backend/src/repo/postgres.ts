import { Pool } from "pg";
import type { Place, PlaceMedia } from "../types";
import type { PlaceFilter, PlaceRepository } from "./types";

/** Fila tal como la devuelve PostgreSQL (media puede venir null). */
type PlaceRow = Omit<Place, "media"> & { media: PlaceMedia[] | null };

const SELECT = `
  SELECT p.slug,
         p.name,
         p.category_slug      AS "category",
         c.name               AS "categoryName",
         p.short_description  AS "shortDescription",
         p.history,
         p.address,
         p.latitude,
         p.longitude,
         p.coords_verified    AS "coordsVerified",
         p.image_url          AS "imageUrl",
         p.pano_url           AS "panoUrl",
         p.tags,
         p.sector,
         pm.media
    FROM places p
    JOIN categories c ON c.slug = p.category_slug
    LEFT JOIN LATERAL (
      SELECT json_agg(
               json_build_object(
                 'kind', m.kind,
                 'url', m.url,
                 'caption', m.caption,
                 'credit', m.credit
               )
               ORDER BY m.sort_order, m.id
             ) AS media
        FROM place_media m
       WHERE m.place_slug = p.slug
    ) pm ON true
   WHERE p.published`;

export class PostgresPlaceRepository implements PlaceRepository {
  readonly source = "postgres" as const;

  constructor(private readonly pool: Pool) {}

  async list(filter: PlaceFilter = {}): Promise<Place[]> {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter.category) {
      params.push(filter.category);
      conditions.push(`p.category_slug = $${params.length}`);
    }

    let order = "ORDER BY c.sort_order, p.name";
    if (filter.q) {
      params.push(filter.q);
      const query = `websearch_to_tsquery('spanish', $${params.length})`;
      conditions.push(`p.search_vector @@ ${query}`);
      // Los resultados más relevantes primero; el resto mantiene el orden del catálogo.
      order = `ORDER BY ts_rank(p.search_vector, ${query}) DESC, c.sort_order, p.name`;
    }

    const where = conditions.length > 0 ? ` AND ${conditions.join(" AND ")}` : "";
    const { rows } = await this.pool.query<PlaceRow>(`${SELECT}${where} ${order}`, params);
    return rows.map((row) => toPlace(row));
  }

  async getBySlug(slug: string): Promise<Place | null> {
    const { rows } = await this.pool.query<PlaceRow>(`${SELECT} AND p.slug = $1`, [slug]);
    const row = rows[0];
    return row ? toPlace(row) : null;
  }

  async ping(): Promise<boolean> {
    try {
      await this.pool.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Combina la galería con la imagen principal del lugar: si `imageUrl`/`panoUrl`
 * no están ya en `place_media`, se agregan. Así una galería nueva no oculta
 * el panorama ni la portada.
 */
function toPlace(row: PlaceRow): Place {
  const media: PlaceMedia[] = row.media ? [...row.media] : [];
  const has = (url: string) => media.some((m) => m.url === url);
  if (row.imageUrl && !has(row.imageUrl)) {
    media.unshift({ kind: "photo", url: row.imageUrl, caption: null, credit: null });
  }
  if (row.panoUrl && !has(row.panoUrl)) {
    media.push({ kind: "pano", url: row.panoUrl, caption: null, credit: null });
  }
  return { ...row, sector: row.sector ?? undefined, media };
}
