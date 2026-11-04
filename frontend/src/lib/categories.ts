import { CATEGORIES, categoryBySlug, type CategoryDef } from "../data/categories";
import type { Place } from "../types";
import { primaryCategory } from "./places";

const FALLBACK: CategoryDef =
  CATEGORIES[0] ?? {
    slug: "plazas",
    nameKey: "category.plazas",
    icon: "landmark",
    from: "#F4A63A",
    to: "#E4683C",
    soft: "#FDF0DC",
    blurb: "Plazas para caminar y encontrarse con la ciudad.",
    group: "ciudad",
  };

/** Aspecto de la categoría principal de un lugar (portadas generadas, pines, burbujas). */
export function categoryStyleForPlace(place: Place): CategoryDef {
  return categoryBySlug(primaryCategory(place)) ?? FALLBACK;
}
