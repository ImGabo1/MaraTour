import fs from "node:fs";
import path from "node:path";
import type { Place, PlaceMedia } from "../types";
import type { PlaceFilter, PlaceRepository } from "./types";

interface SeedCategory {
  slug: string;
  name: string;
  sortOrder: number;
}

interface SeedMedia {
  kind: "photo" | "pano";
  url: string;
  caption?: string | null;
  credit?: string | null;
}

type SeedPlace = Omit<Place, "categoryName" | "media"> & { media?: SeedMedia[] };

const DEFAULT_SEED_DIR = path.resolve(__dirname, "../../../database/seed");

function mediaFor(seed: SeedPlace): PlaceMedia[] {
  const media: PlaceMedia[] = (seed.media ?? []).map((m) => ({
    kind: m.kind,
    url: m.url,
    caption: m.caption ?? null,
    credit: m.credit ?? null,
  }));
  const has = (url: string) => media.some((m) => m.url === url);
  if (seed.imageUrl && !has(seed.imageUrl)) {
    media.unshift({ kind: "photo", url: seed.imageUrl, caption: null, credit: null });
  }
  if (seed.panoUrl && !has(seed.panoUrl)) {
    media.push({ kind: "pano", url: seed.panoUrl, caption: null, credit: null });
  }
  return media;
}

/** Minúsculas y sin acentos, para que «basilica» encuentre «Basílica». */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Repositorio sin base de datos: lee database/seed/*.json.
 * Sirve para desarrollar el front sin instalar Postgres y para los tests.
 */
export class MemoryPlaceRepository implements PlaceRepository {
  readonly source = "memory" as const;
  private readonly places: (Place & { searchText: string })[];

  constructor(seedDir: string = process.env.SEED_DIR ?? DEFAULT_SEED_DIR) {
    const categories: SeedCategory[] = JSON.parse(
      fs.readFileSync(path.join(seedDir, "categories.json"), "utf8")
    );
    const seeds: SeedPlace[] = JSON.parse(
      fs.readFileSync(path.join(seedDir, "places.json"), "utf8")
    );
    const names = new Map(categories.map((c) => [c.slug, c.name]));
    this.places = seeds.map((p) => {
      const categoryName = names.get(p.category) ?? p.category;
      const place: Place = { ...p, categoryName, media: mediaFor(p) };
      const searchText = normalize(
        [place.name, place.shortDescription, place.history, place.address, place.categoryName, ...place.tags].join(" ")
      );
      return { ...place, searchText };
    });
  }

  async list(filter: PlaceFilter = {}): Promise<Place[]> {
    const term = filter.q ? normalize(filter.q).trim() : "";
    // Todas las palabras deben aparecer (mismo comportamiento que websearch_to_tsquery).
    const words = term.split(/\s+/).filter(Boolean);

    return this.places
      .filter((p) => !filter.category || p.category === filter.category)
      .filter((p) => words.every((w) => p.searchText.includes(w)))
      .map(({ searchText: _searchText, ...place }) => place);
  }

  async getBySlug(slug: string): Promise<Place | null> {
    const place = this.places.find((p) => p.slug === slug);
    if (!place) return null;
    const { searchText: _searchText, ...rest } = place;
    return rest;
  }

  async ping(): Promise<boolean> {
    return true;
  }
}
