/** Enlace al punto exacto en Google Maps (no requiere API key ni cuesta dinero). */
export function googleMapsPlaceUrl(place: { latitude: number; longitude: number }): string {
  const query = `${place.latitude},${place.longitude}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Búsqueda general (sin coordenadas) en Google Maps. */
export function googleMapsSearchUrl(text: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}`;
}
