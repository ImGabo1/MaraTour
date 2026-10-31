// Contrato de la API. Mantener sincronizado con frontend/src/types.ts y docs/API.md.

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
}
