import type { Bounds } from "./lib/projection";

/** URL del backend. Vacío = mismo origen (Vite en local y Vercel/Netlify en producción redirigen /api al backend). */
export const API_URL: string = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

/**
 * Bases a probar en orden: primero la URL directa (si existe) y después el
 * mismo origen, que el hosting reenvía al backend. Así un CORS mal configurado
 * o una variable ausente no dejan a la gente sin registro ni login.
 */
export const API_BASES: readonly string[] = API_URL ? [API_URL, ""] : [""];

/** fetch contra la API con respaldo: pasa a la siguiente base si la red falla o no llega JSON. */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  let lastError: unknown = new Error("Sin respuesta de la API");
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, init);
      const type = res.headers.get("content-type") ?? "";
      if (type.includes("json")) return res;
      lastError = new Error(`Respuesta no JSON (HTTP ${res.status})`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

/** Consulta general que se abre en Google Maps desde la barra del mapa. */
export const MAPS_GENERAL_QUERY = "Maracaibo, Zulia, Venezuela";

/**
 * Fondo del mapa sin conexión: imagen local neutra (cuadrícula). Con internet, MapView dibuja encima las
 * teselas en vivo (MAP_TILES) para poder acercarse hasta nivel de calle.
 * Los bordes son los de las teselas; si se regenera la imagen hay que actualizarlos.
 */
export const MAP_IMAGE: { image: string; bounds: Bounds; width: number; height: number } | null = {
  image: "/img/mapa-maracaibo.jpg",
  // Proporción de la imagen (3328 × 2560 px) en unidades del minimapa.
  width: 832,
  height: 640,
  bounds: { north: 10.746969318459998, south: 10.531020008464983, west: -71.78466796875, east: -71.4990234375 },
};

/**
 * Teselas en vivo, en orden de preferencia, todas sin API key. Si un proveedor bloquea o falla
 * (403, red), MapView pasa al siguiente.
 * Ojo: CARTO (basemaps.cartocdn.com) ya NO sirve sin clave: dibuja la marca "API KEY REQUIRED" sobre
 * cada tesela y como la imagen sí carga, el respaldo nunca se activa. No volver a usarlo sin clave.
 * Esri, Mapbox y Stadia también piden clave. OSM exige Referer y atribución (MapView ya los envía).
 * Sin conexión queda visible la imagen local (cuadrícula neutra, sin geografía inventada).
 */
export const MAP_TILE_PROVIDERS = [
  {
    id: "osm",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "",
    maxNativeZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
  },
  {
    id: "osmfr",
    url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxNativeZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · <a href="https://www.openstreetmap.fr" target="_blank" rel="noreferrer">OSM France</a>',
  },
  {
    id: "hot",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxNativeZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> · <a href="https://www.hotosm.org" target="_blank" rel="noreferrer">HOT</a>',
  },
] as const;

/** Proveedor principal (compatibilidad). */
export const MAP_TILES = MAP_TILE_PROVIDERS[0];
