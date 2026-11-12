import { apiFetch } from "./config";
import { withVerifiedCoords } from "./data/coords";
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
    const res = await apiFetch("/api/places", { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as PlacesResponse;
    return { places: body.data.map(withVerifiedCoords), source: "api" };
  } catch {
    const body = await fetchJson("/data/places.json");
    return { places: body.data.map(withVerifiedCoords), source: "respaldo" };
  }
}
