import { EXTRA_PLACES, PLACE_GROUPS } from "../data/catalog";
import { isCategorySlug, type CategorySlug } from "../data/categories";
import { popularityScore } from "./popularity";
import type { Place } from "../types";

/** Un tema activo o `null` cuando no hay filtro (vista general). */
export type CategoryFilter = CategorySlug | null;
export type SortMode = "popular" | "az";

/** Categorías originales de la API que no existen en el catálogo nuevo. */
const LEGACY_CATEGORY: Record<string, CategorySlug> = {
  historia: "historia",
  cultura: "cultura",
  religioso: "fe",
  naturaleza: "naturaleza",
};

/** Une la respuesta de la API con el catálogo provisional, sin repetir slugs. */
export function mergePlaces(apiPlaces: readonly Place[]): Place[] {
  const seen = new Set(apiPlaces.map((place) => place.slug));
  return [...apiPlaces, ...EXTRA_PLACES.filter((place) => !seen.has(place.slug))];
}

/** Categorías de un lugar; la primera es la principal. */
export function groupsFor(place: Place): readonly CategorySlug[] {
  const configured = PLACE_GROUPS[place.slug];
  if (configured && configured.length > 0) return configured;
  if (isCategorySlug(place.category)) return [place.category];
  return [LEGACY_CATEGORY[place.category] ?? "historia"];
}

export function primaryCategory(place: Place): CategorySlug {
  return groupsFor(place)[0] ?? "historia";
}

/** Cuántos lugares hay en cada categoría (sin contar el filtro «todos»). */
export function countByCategory(places: readonly Place[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const place of places) {
    for (const group of groupsFor(place)) {
      counts[group] = (counts[group] ?? 0) + 1;
    }
  }
  return counts;
}

/** Quita acentos y mayúsculas para que «basilica» encuentre «Basílica». */
export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesQuery(place: Place, query: string): boolean {
  if (!query) return true;
  const haystack = normalizeText(
    [place.name, place.shortDescription, place.address, ...place.tags].join(" ")
  );
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(normalizeText(word)));
}

export function filterPlaces(
  places: readonly Place[],
  category: CategoryFilter,
  query = ""
): Place[] {
  const trimmed = query.trim();
  return places.filter((place) => {
    const inCategory = category === null || groupsFor(place).includes(category);
    return inCategory && matchesQuery(place, trimmed);
  });
}

export function sortPlaces(places: readonly Place[], mode: SortMode, lang = "es"): Place[] {
  const copy = [...places];
  if (mode === "az") {
    copy.sort((a, b) => a.name.localeCompare(b.name, lang, { sensitivity: "base" }));
    return copy;
  }
  copy.sort((a, b) => {
    const diff = popularityScore(b.slug) - popularityScore(a.slug);
    return diff !== 0 ? diff : a.name.localeCompare(b.name, lang, { sensitivity: "base" });
  });
  return copy;
}

/** Lugares que se muestran en el mapa: el filtro activo o, en la vista general, los más populares. */
export function mapPlaces(places: readonly Place[], category: CategoryFilter, limit = 16): Place[] {
  if (category !== null) return [...places];
  return [...places].sort((a, b) => popularityScore(b.slug) - popularityScore(a.slug)).slice(0, limit);
}
