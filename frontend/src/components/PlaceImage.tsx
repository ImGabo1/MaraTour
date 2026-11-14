import { useEffect, useRef, useState } from "react";
import { getMedia, PLACEHOLDER_COVER } from "../config/media";
import type { Place } from "../types";
import "./PlaceImage.css";

/** card 3:4 · hero 4:5 (3:4 en escritorio) · thumb 3:4 · reel 9:16 */
export type PhotoRatio = "card" | "hero" | "thumb" | "reel";

interface Props {
  place: Pick<Place, "slug" | "name" | "imageUrl">;
  ratio?: PhotoRatio;
  /** Primer viewport: carga inmediata. El resto va con loading="lazy". */
  eager?: boolean;
  /** Foto decorativa (el texto cercano ya nombra el lugar): alt vacío. */
  decorative?: boolean;
  /** Otra imagen del mismo lugar (galería). Si no se da, se usa la portada. */
  src?: string;
  className?: string;
}

/**
 * Foto de un lugar dentro de un contenedor con aspect-ratio (nunca alto fijo).
 * - Skeleton celeste con brillo mientras carga y fundido al terminar (onLoad).
 * - Si el archivo no existe o falla (p. ej. sin conexión y sin caché),
 *   muestra el placeholder local en vez de una imagen rota.
 */
export function PlaceImage({
  place,
  ratio = "card",
  eager = false,
  decorative = false,
  src,
  className = "",
}: Props) {
  const wanted = src ?? place.imageUrl ?? getMedia(place.slug).cover;
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const shown = failed ? PLACEHOLDER_COVER : wanted;

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [wanted]);

  // Una imagen en caché puede terminar de cargar antes de que React escuche onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [shown]);

  return (
    <span className={`mt-photo mt-photo--${ratio}${loaded ? "" : " mt-skeleton"} ${className}`.trim()}>
      <img
        ref={imgRef}
        className={`mt-fade-img${loaded ? " is-loaded" : ""}`}
        src={shown}
        alt={decorative ? "" : place.name}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed) setFailed(true);
        }}
      />
    </span>
  );
}
