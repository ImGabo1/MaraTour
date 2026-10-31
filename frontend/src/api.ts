import { API_URL } from "./config";
import type { Place, PlacesResponse } from "./types";

export type DataSource = "api" | "respaldo";

export interface PlacesResult {
  places: Place[];
  source: DataSource;
}

async function fetchJson(url: string): Promise<PlacesResponse> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as PlacesResponse;
}

/**
 * Pide los lugares a la API. Si falla (sin internet o servidor caído) usa el respaldo
 * incluido en la app (public/data/places.json), así la PWA sigue siendo útil sin conexión.
 */
export async function loadPlaces(): Promise<PlacesResult> {
  try {
    const body = await fetchJson(`${API_URL}/api/places`);
    return { places: body.data, source: "api" };
  } catch {
    const body = await fetchJson("/data/places.json");
    return { places: body.data, source: "respaldo" };
  }
}
