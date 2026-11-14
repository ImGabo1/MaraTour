/**
 * Medios por lugar: mapa `slug -> { cover, gallery[], pano }` y su resolución.
 *
 * Los archivos viven en `public/media/sitios/<slug>/` y `scripts/sync-data.mjs`
 * los indexa solo en `data/media-manifest.json` (portada, fotos, 360°, video).
 * Cuando el equipo defina los nombres definitivos de las fotos, basta con
 * escribir las rutas en `MEDIA_MAP`: lo que se declare aquí manda sobre el
 * manifiesto, sin tocar componentes ni renombrar carpetas.
 *
 * Si un lugar no tiene foto, `getMedia` devuelve un placeholder local
 * (funciona sin conexión) en lugar de una ruta rota.
 */
import manifest from "../data/media-manifest.json";

/** Imagen de respaldo (SVG local, 3:4) cuando un lugar aún no tiene foto. */
export const PLACEHOLDER_COVER = "/img/placeholder-lugar.svg";

export interface PlaceMediaEntry {
  /** Foto de portada (vertical 3:4 recomendada). */
  cover: string;
  /** Galería adicional (la portada se agrega sola al inicio). */
  gallery: string[];
  /** Panorama 360° equirectangular 2:1. */
  pano: string;
  /** Video corto del lugar. */
  video: string;
}

/**
 * Ajustes manuales por lugar. Vacío a propósito: se llena cuando se definan
 * los nombres reales de las fotos. Ejemplo:
 *
 *   "teatro-baralt": {
 *     cover: "/media/sitios/teatro-baralt/fachada.jpg",
 *     gallery: ["/media/sitios/teatro-baralt/sala.jpg", "/media/sitios/teatro-baralt/palco.jpg"],
 *     pano: "/media/sitios/teatro-baralt/360.jpg",
 *   },
 */
export const MEDIA_MAP: Record<string, Partial<PlaceMediaEntry>> = {};

interface ManifestEntry {
  cover?: string;
  panos?: string[];
  video?: string;
  photos?: string[];
}

const SITES = manifest as Record<string, ManifestEntry>;

export interface ResolvedMedia {
  /** Siempre es una ruta usable: la foto real o el placeholder. */
  cover: string;
  /** `false` cuando `cover` es el placeholder. */
  hasCover: boolean;
  gallery: string[];
  pano: string | null;
  video: string | null;
}

function unique(list: (string | null | undefined)[]): string[] {
  return [...new Set(list.filter((item): item is string => Boolean(item)))];
}

/** Medios de un lugar: `MEDIA_MAP` → carpeta del sitio → placeholder. */
export function getMedia(slug: string): ResolvedMedia {
  const manual = MEDIA_MAP[slug];
  const site = SITES[slug];
  const cover = manual?.cover ?? site?.cover ?? site?.photos?.[0] ?? null;

  return {
    cover: cover ?? PLACEHOLDER_COVER,
    hasCover: cover !== null,
    gallery: unique([cover, ...(manual?.gallery ?? site?.photos ?? [])]),
    pano: manual?.pano ?? site?.panos?.[0] ?? null,
    video: manual?.video ?? site?.video ?? null,
  };
}
