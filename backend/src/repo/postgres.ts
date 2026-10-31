import { Pool } from "pg";
import type { Place } from "../types";
import type { PlaceRepository } from "./types";

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
         p.tags
    FROM places p
    JOIN categories c ON c.slug = p.category_slug
   WHERE p.published`;

export class PostgresPlaceRepository implements PlaceRepository {
  readonly source = "postgres" as const;

  constructor(private readonly pool: Pool) {}

  async list(filter: { category?: string } = {}): Promise<Place[]> {
    if (filter.category) {
      const { rows } = await this.pool.query<Place>(
        `${SELECT} AND p.category_slug = $1 ORDER BY c.sort_order, p.name`,
        [filter.category]
      );
      return rows;
    }
    const { rows } = await this.pool.query<Place>(`${SELECT} ORDER BY c.sort_order, p.name`);
    return rows;
  }

  async getBySlug(slug: string): Promise<Place | null> {
    const { rows } = await this.pool.query<Place>(`${SELECT} AND p.slug = $1`, [slug]);
    return rows[0] ?? null;
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
