import type { Place } from "../types";

export interface PlaceRepository {
  /** Nombre de la fuente de datos, para /api/health */
  readonly source: "postgres" | "memory";
  list(filter?: { category?: string }): Promise<Place[]>;
  getBySlug(slug: string): Promise<Place | null>;
  ping(): Promise<boolean>;
}
