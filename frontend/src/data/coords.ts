import raw from "./coords.json";
import type { Place } from "../types";

/**
 * Coordenadas verificadas por slug. `sync-data` las genera desde
 * `database/seed/places.json`, que es la fuente de verdad.
 */
const VERIFIED = raw as unknown as Record<string, [number, number, number]>;

/** Devuelve el lugar con las coordenadas de la semilla si existen. */
export function withVerifiedCoords(place: Place): Place {
  const hit = VERIFIED[place.slug];
  if (!hit) return place;
  return { ...place, latitude: hit[0], longitude: hit[1], coordsVerified: hit[2] === 1 };
}

export function verifiedCoords(slug: string): [number, number] | null {
  const hit = VERIFIED[slug];
  return hit ? [hit[0], hit[1]] : null;
}
