import type { Bounds } from "./lib/projection";

/** URL del backend. Vacío = mismo origen (en desarrollo Vite redirige /api al backend). */
export const API_URL: string = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** Consulta general que se abre en Google Maps desde la barra del mapa. */
export const MAPS_GENERAL_QUERY = "Maracaibo, Zulia, Venezuela";

/**
 * Mapa base real de Maracaibo, renderizado una sola vez desde OpenStreetMap /
 * OpenFreeMap y guardado como imagen local. Así el mapa funciona sin conexión,
 * sin claves de API y sin depender de un servicio de teselas en producción.
 * Si se cambia la imagen hay que actualizar los cuatro bordes geográficos.
 */
export const MAP_IMAGE: { image: string; bounds: Bounds } | null = {
  image: "/img/mapa-maracaibo.jpg",
  bounds: { north: 10.705, south: 10.545, west: -71.762724, east: -71.512276 },
};
