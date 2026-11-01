import type { Place } from "../types";

export interface PlaceFilter {
  category?: string;
  /** Búsqueda de texto libre (nombre, descripción, etiquetas, historia, dirección). */
  q?: string;
}

export interface PlaceRepository {
  /** Nombre de la fuente de datos, para /api/health */
  readonly source: "postgres" | "memory";
  list(filter?: PlaceFilter): Promise<Place[]>;
  getBySlug(slug: string): Promise<Place | null>;
  ping(): Promise<boolean>;
}
