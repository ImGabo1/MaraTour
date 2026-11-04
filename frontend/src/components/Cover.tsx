import { categoryStyleForPlace } from "../lib/categories";
import type { Place } from "../types";
import { CategoryIcon } from "./icons";

/** Foto 2D del lugar; si aún no hay, una portada generada según la categoría. */
export function Cover({ place, className = "" }: { place: Place; className?: string }) {
  // Primero la foto principal; si no hay, la primera de la galería.
  const src = place.imageUrl ?? place.media.find((m) => m.kind === "photo")?.url ?? null;

  if (src) {
    return (
      <img
        className={`cover cover--photo ${className}`}
        src={src}
        alt={`Foto de ${place.name}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  const category = categoryStyleForPlace(place);
  return (
    <div
      className={`cover cover--generated ${className}`}
      style={{
        background: `radial-gradient(circle at 82% 16%, rgba(255,255,255,.34), transparent 42%), linear-gradient(145deg, ${category.from}, ${category.to})`,
      }}
      role="img"
      aria-label={`Portada de ${place.name}`}
    >
      <CategoryIcon name={category.icon} className="cover__icon" />
    </div>
  );
}
