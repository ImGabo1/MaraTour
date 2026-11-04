// Contrato de la API. Mantener sincronizado con frontend/src/types.ts y docs/API.md.

/** Foto o panorama asociado a un lugar (tabla place_media). */
export interface PlaceMedia {
  kind: "photo" | "pano";
  url: string;
  caption: string | null;
  credit: string | null;
}

export interface Place {
  slug: string;
  name: string;
  /** slug de la categoría (historia, cultura, religioso, naturaleza...) */
  category: string;
  categoryName: string;
  shortDescription: string;
  history: string;
  address: string;
  latitude: number;
  longitude: number;
  /** false hasta confirmar el punto en Google Maps */
  coordsVerified: boolean;
  /** foto 2D; null = el frontend muestra una portada generada */
  imageUrl: string | null;
  /** imagen panorámica 360°; null = el lugar no tiene vista 360° */
  panoUrl: string | null;
  tags: string[];
  /**
   * Galería. Siempre incluye `imageUrl`/`panoUrl` si no están repetidos en
   * place_media, así la portada y el 360° no se pierden al añadir fotos.
   */
  media: PlaceMedia[];
}
