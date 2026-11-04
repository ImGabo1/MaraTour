// Contrato de la API. Mantener sincronizado con backend/src/types.ts y docs/API.md.

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
  category: string;
  categoryName: string;
  shortDescription: string;
  history: string;
  address: string;
  latitude: number;
  longitude: number;
  coordsVerified: boolean;
  imageUrl: string | null;
  panoUrl: string | null;
  tags: string[];
  media: PlaceMedia[];
}

export interface PlacesResponse {
  data: Place[];
  meta?: { count: number };
}
