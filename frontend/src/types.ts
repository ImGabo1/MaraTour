// Contrato de la API. Mantener sincronizado con backend/src/types.ts y docs/API.md.

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
}

export interface PlacesResponse {
  data: Place[];
  meta?: { count: number };
}
