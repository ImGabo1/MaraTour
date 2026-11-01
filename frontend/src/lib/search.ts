import type { Place } from "../types";

/** Minúsculas y sin acentos, para que «basilica» encuentre «Basílica». */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Búsqueda local sobre el catálogo ya descargado (la app debe funcionar sin
 * conexión). El backend ofrece la misma búsqueda en `GET /api/places?q=`.
 */
export function matchesQuery(place: Place, query: string): boolean {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(
    [place.name, place.shortDescription, place.history, place.address, place.categoryName, ...place.tags].join(" ")
  );
  return words.every((word) => haystack.includes(word));
}
