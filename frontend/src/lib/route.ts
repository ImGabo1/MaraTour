import type { Place } from "../types";

/** Distancia aproximada en kilómetros entre dos coordenadas (haversine simplificada). */
function distanceKm(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const dLat = (b.latitude - a.latitude) * 111;
  const dLon = (b.longitude - a.longitude) * 111 * Math.cos((a.latitude * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

/**
 * Reordena una ruta por cercanía. Mantiene la primera parada como punto de partida
 * y elige siempre el lugar más cercano que quede sin visitar.
 */
export function optimizeRoute(places: readonly Place[]): string[] {
  if (places.length < 3) return places.map((place) => place.slug);
  const remaining = [...places];
  const ordered: Place[] = [];
  const first = remaining.shift();
  if (first) ordered.push(first);

  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    if (!last) break;
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    remaining.forEach((place, index) => {
      const distance = distanceKm(last, place);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    const [next] = remaining.splice(bestIndex, 1);
    if (next) ordered.push(next);
  }

  return ordered.map((place) => place.slug);
}

/** Tiempo estimado de visita, en minutos, para mostrar un resumen útil. */
export function estimateVisitMinutes(place: Place): number {
  return place.panoUrl ? 75 : 55;
}
