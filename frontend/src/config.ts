import type { Bounds } from "./lib/projection";

/** URL del backend. Vacío = mismo origen (en desarrollo Vite redirige /api al backend). */
export const API_URL: string = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/** Consulta general que se abre en Google Maps desde la barra del mapa. */
export const MAPS_GENERAL_QUERY = "Maracaibo, Zulia, Venezuela";

/**
 * Mapa real (idea del equipo: una imagen del mapa en lugar de la API de Google Maps).
 * 1. Guarda una captura del mapa en frontend/public/img/mapa-maracaibo.png
 * 2. Pon aquí su ruta y las coordenadas de sus cuatro bordes (norte, sur, oeste, este).
 * Con `image: null` se usa el mapa ilustrativo dibujado en SVG.
 */
export const MAP_IMAGE: { image: string; bounds: Bounds } | null = null;
