/** Enlace al punto exacto en Google Maps (no requiere API key ni cuesta dinero). */
export function googleMapsPlaceUrl(place: { latitude: number; longitude: number }): string {
  const query = `${place.latitude},${place.longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Búsqueda general (sin coordenadas) en Google Maps. */
export function googleMapsSearchUrl(text: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
}

/** Ruta de varios puntos en Google Maps (la última parada es el destino). */
export function googleMapsRouteUrl(
  places: readonly { latitude: number; longitude: number }[]
): string {
  if (places.length === 0) return googleMapsSearchUrl("Maracaibo, Zulia, Venezuela");
  const coords = places.map((place) => `${place.latitude},${place.longitude}`);
  const destination = coords[coords.length - 1] ?? coords[0]!;
  const waypoints = coords.slice(0, -1);
  const params = new URLSearchParams({
    api: "1",
    destination,
    travelmode: "driving",
  });
  if (waypoints.length > 0) params.set("waypoints", waypoints.join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
