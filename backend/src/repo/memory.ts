import fs from "node:fs";
import path from "node:path";
import type { Place } from "../types";
import type { PlaceRepository } from "./types";

interface SeedCategory {
  slug: string;
  name: string;
  sortOrder: number;
}

type SeedPlace = Omit<Place, "categoryName">;

const DEFAULT_SEED_DIR = path.resolve(__dirname, "../../../database/seed");

/**
 * Repositorio sin base de datos: lee database/seed/*.json.
 * Sirve para desarrollar el front sin instalar Postgres y para los tests.
 */
export class MemoryPlaceRepository implements PlaceRepository {
  readonly source = "memory" as const;
  private readonly places: Place[];

  constructor(seedDir: string = process.env.SEED_DIR ?? DEFAULT_SEED_DIR) {
    const categories: SeedCategory[] = JSON.parse(
      fs.readFileSync(path.join(seedDir, "categories.json"), "utf8")
    );
    const seeds: SeedPlace[] = JSON.parse(
      fs.readFileSync(path.join(seedDir, "places.json"), "utf8")
    );
    const names = new Map(categories.map((c) => [c.slug, c.name]));
    this.places = seeds.map((p) => ({ ...p, categoryName: names.get(p.category) ?? p.category }));
  }

  async list(filter: { category?: string } = {}): Promise<Place[]> {
    return filter.category
      ? this.places.filter((p) => p.category === filter.category)
      : [...this.places];
  }

  async getBySlug(slug: string): Promise<Place | null> {
    return this.places.find((p) => p.slug === slug) ?? null;
  }

  async ping(): Promise<boolean> {
    return true;
  }
}
