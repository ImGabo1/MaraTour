import { categoryStyle } from "../lib/categories";
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
  const style = categoryStyle(place.category);
  return (
    <div
      className={`cover ${className}`}
      style={{ background: `linear-gradient(150deg, ${style.from}, ${style.to})` }}
      role="img"
      aria-label={`Portada de ${place.name}`}
    >
      <CategoryIcon name={style.icon} className="cover__icon" />
    </div>
  );
}
