/**
 * Fotos y medios por lugar.
 *
 * Cada lugar tiene su carpeta en `frontend/public/media/sitios/<slug>/`:
 *   - `portada.jpg`            → foto principal (1600 × 1000 recomendado)
 *   - `360.jpg`, `360-2.jpg`   → panoramas 360° equirectangulares (2:1)
 *   - `video.mp4`              → video corto del lugar
 *   - `foto-01.jpg`, …         → galería
 *
 * `scripts/sync-data.mjs` recorre esas carpetas y genera `media-manifest.json`,
 * así que basta con soltar el archivo con el nombre correcto y recargar.
 * Aquí solo quedan los créditos y las fotos referenciales de respaldo.
 */
import { MEDIA_MAP } from "../config/media";
import type { Place } from "../types";
import coords from "./coords.json";
import manifest from "./media-manifest.json";

export interface PlaceMedia {
  /** Ruta local de la foto de portada. */
  image?: string;
  /** Texto corto de crédito que se muestra en la ficha. */
  credit?: string;
  /** Enlace a la fuente original (Wikimedia Commons, banco propio, etc.). */
  source?: string;
  /** Galería adicional; la primera imagen suele ser la portada. */
  gallery?: string[];
  /** Panorama 360° equirectangular. */
  pano?: string;
  /** Video corto del lugar. */
  video?: string;
}

const photo = (slug: string): string => `/media/sitios/${slug}/portada.jpg`;

export const PLACE_MEDIA: Record<string, PlaceMedia> = {
  "basilica-chiquinquira": {
    image: photo("basilica-chiquinquira"),
    video: "/media/sitios/basilica-chiquinquira/video.mp4",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Bas%C3%ADlica_de_nuestra_se%C3%B1ora_de_la_Chiquinquira.jpg",
  },
  "teatro-baralt": {
    image: photo("teatro-baralt"),
    video: "/media/sitios/teatro-baralt/video.mp4",
    credit: "Foto: Béria Lima de Rodríguez · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Teatro_Baralt_by_Beria.jpg",
  },
  "plaza-bolivar": {
    image: photo("plaza-bolivar"),
    credit: "Foto: Zerojosefer · CC BY-SA 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Plaza_Bol%C3%ADvar_(Maracaibo).jpg",
  },
  "calle-carabobo": {
    image: photo("calle-carabobo"),
    credit: "Foto: Rjcastillo · CC BY 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Calle_Carabobo,_Maracaibo_MG_484420250831.jpg",
  },
  "santa-lucia": {
    image: photo("santa-lucia"),
    video: "/media/sitios/santa-lucia/video.mp4",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Blue_tower_of_Iglesia_de_Santa_Luc%C3%ADa_above_an_evening_street_gathering_in_Maracaibo,_Venezuela.jpg",
  },
  "paseo-del-lago": {
    image: photo("paseo-del-lago"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Ca%C3%B1ada_del_Paseo_del_Lago,_Maracaibo,_Estado_Zulia,_Venezuela_2.jpg",
  },
  "plaza-baralt": {
    image: photo("plaza-baralt"),
    credit: "Foto: Aledussa · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Plaza_Baralt_Maracaibo,_Venezuela..jpg",
  },
  "plaza-republica": {
    image: photo("plaza-republica"),
    video: "/media/sitios/plaza-republica/video.mp4",
    credit: "Foto: Jarrypalomino · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Plaza_de_la_Rep%C3%BAblica,_Maracaibo.jpg",
  },
  "plaza-monumento-chinita": {
    image: photo("plaza-monumento-chinita"),
    credit: "Foto: Loreina Velandia · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Plaza_monumento_a_la_virgen_del_Chiquinquira._Maracaibo_estado_Zulia.JPG",
  },
  "catedral-maracaibo": {
    image: photo("catedral-maracaibo"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Catedral_de_Maracaibo_I.JPG",
  },
  "palacio-gobierno-zulia": {
    image: photo("palacio-gobierno-zulia"),
    credit: "Foto: Anata08 · CC BY 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Palacio_de_Gobierno_del_Estado_Zulia.jpg",
  },
  "casa-capitulacion": {
    image: photo("casa-capitulacion"),
    credit: "Foto: Vzerpaquintero · CC BY-SA 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Casa_de_la_Capitulaci%C3%B3n_oct_2026.jpg",
  },
  "centro-arte-lia-bermudez": {
    image: photo("centro-arte-lia-bermudez"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Art_Center_Maracaibo_Lia_Bermudez.jpg",
  },
  maczul: {
    image: photo("maczul"),
    credit: "Foto: HumbRios · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:El_Museo_de_Arte_Contempor%C3%A1neo_del_Zulia.jpg",
  },
  "parque-urdaneta": {
    image: photo("parque-urdaneta"),
    video: "/media/sitios/parque-urdaneta/video.mp4",
    credit: "Foto: Zerojosefer · CC BY-SA 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Parque_Rafael_Urdaneta_005.jpg",
  },
  "parque-universitario-luz": {
    image: photo("parque-universitario-luz"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Monumento_LUZ_(Universidad_del_Zulia).jpg",
  },
  "universidad-del-zulia": {
    image: photo("universidad-del-zulia"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Monumento_LUZ_(Universidad_del_Zulia).jpg",
  },
  unica: {
    image: photo("unica"),
    credit: "Foto: Zerojosefer · CC BY-SA 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Universidad_Cat%C3%B3lica_Cecilio_Acosta_(2025).jpg",
  },
  urbe: {
    image: photo("urbe"),
    credit: "Foto: Orlando Ortega · CC BY-SA 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Plaza_Dr._Rafael_Belloso_Chac%C3%ADn.jpg",
  },
  "estadio-pachencho-romero": {
    image: photo("estadio-pachencho-romero"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Estadio_Pachencho_Romero.jpg",
  },
  "estadio-luis-aparicio": {
    image: photo("estadio-luis-aparicio"),
    credit: "Foto: EliasDML · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Estadio_Luis_Aparicio_Maracaibo.jpg",
  },
  "estadio-alejandro-borges": {
    image: photo("estadio-alejandro-borges"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Estadio_Alejandro_Borges.jpg",
  },
  "monumento-indio-mara": {
    image: photo("monumento-indio-mara"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Plaza_Indio_Mara_I.jpg",
  },
  "puente-rafael-urdaneta": {
    image: photo("puente-rafael-urdaneta"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:General_Rafael_Urdaneta_Bridge_view_from_the_lake_to_Cabimas_side.jpg",
  },
  "vereda-del-lago": {
    image: photo("vereda-del-lago"),
    video: "/media/sitios/vereda-del-lago/video.mp4",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Sunrise_on_Vereda_del_Lago_and_Eagle_Austin_Ship_in_Maracaibo_lake.jpg",
  },
  "galerias-mall": {
    image: photo("galerias-mall"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Galerias_Mall.JPG",
  },
  "sambil-maracaibo": {
    image: photo("sambil-maracaibo"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Cupula_SAMBIL_Maracaibo.JPG",
  },
  "aeropuerto-la-chinita": {
    image: photo("aeropuerto-la-chinita"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:La_Chinita,_International_Airport,_Maracaibo,_Zulia,_Venezuela.jpg",
  },
  "biblioteca-publica-zulia": {
    image: photo("biblioteca-publica-zulia"),
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Biblioteca_P%C3%BAblica_del_Estado_Zulia.JPG",
  },
  "iglesia-san-francisco": {
    image: photo("iglesia-san-francisco"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Iglesia_San_Francisco_de_Maracaibo.jpg",
  },
  "jardin-botanico-maracaibo": {
    image: photo("jardin-botanico-maracaibo"),
    credit: "Foto referencial de naturaleza · Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Bismarckia_nobilis_-_Maracaibo_I.jpg",
  },
  "malecon-maracaibo": {
    image: photo("paseo-del-lago"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Ca%C3%B1ada_del_Paseo_del_Lago,_Maracaibo,_Estado_Zulia,_Venezuela_2.jpg",
  },
  "sabor-zuliano": {
    image: photo("sabor-zuliano"),
    credit: "Foto: George Miquilena · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Restaurante_Saz%C3%B3n_Zuliano,_Maracaibo,_Venezuela.jpg",
  },
  "rincon-zuliano": {
    image: "/media/categorias/gastronomia.jpg",
    credit: "Foto referencial de gastronomía zuliana · Jdvillalobos · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Patacones.JPG",
  },
  "mi-vaquita": {
    image: "/media/categorias/gastronomia.jpg",
    credit: "Foto referencial de gastronomía zuliana · Jdvillalobos · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Patacones.JPG",
  },
  "hospital-universitario-maracaibo": {
    image: "/media/categorias/salud.jpg",
    credit: "Foto referencial de salud en Maracaibo · Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Central_Hospital_of_Maracaibo.jpg",
  },
  "hospital-central-maracaibo": {
    image: "/media/categorias/salud.jpg",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Central_Hospital_of_Maracaibo.jpg",
  },
  "hospital-clinico-maracaibo": {
    image: "/media/categorias/salud.jpg",
    credit: "Foto referencial de salud en Maracaibo · Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Central_Hospital_of_Maracaibo.jpg",
  },
  "clinica-paraiso": {
    image: "/media/categorias/salud.jpg",
    credit: "Foto referencial de salud en Maracaibo · Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Central_Hospital_of_Maracaibo.jpg",
  },
  "calle-72-bella-vista": {
    image: "/media/categorias/noche.jpg",
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Maracaibo_-_Av._4_Bella_Vista_-_Long_exposure_I.JPG",
  },
  "zona-rosa-bella-vista": {
    image: photo("zona-rosa-bella-vista"),
    credit: "Foto: Ddrriivvee · Dominio público · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Maracaibo_at_night.jpg",
  },
  "ruta-dulces-santa-lucia": {
    image: photo("ruta-dulces-santa-lucia"),
    credit: "Foto: HumbRios · CC BY-SA 3.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Parroquia_Santa_Luc%C3%ADa_de_noche..jpg",
  },
  "doral-center": {
    image: photo("sambil-maracaibo"),
    credit: "Foto referencial de compras en Maracaibo · Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Cupula_SAMBIL_Maracaibo.JPG",
  },
  "terminal-pasajeros-maracaibo": {
    image: photo("puente-rafael-urdaneta"),
    credit: "Foto referencial de transporte · Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:General_Rafael_Urdaneta_Bridge_view_from_the_lake_to_Cabimas_side.jpg",
  },
};

/** Quita notas internas de borrador que todavía pueda traer la API. */
function cleanCopy(text: string): string {
  return text
    .replace(/\s*\[BORRADOR[^\]]*\]\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

interface SiteMedia {
  cover?: string;
  panos?: string[];
  video?: string;
  photos?: string[];
}

const SITE_MEDIA = manifest as Record<string, SiteMedia>;
const COORDS = coords as unknown as Record<string, [number, number, number]>;

/** Rutas de la estructura anterior que todavía pueda devolver la API o la caché. */
function legacyUrl(url: string): string {
  return url
    .replace(/^\/media\/lugares\/parque-universitario\.jpg$/, "/media/sitios/parque-universitario-luz/portada.jpg")
    .replace(/^\/media\/lugares\/([a-z0-9-]+)\.jpg$/, "/media/sitios/$1/portada.jpg")
    .replace(/^\/media\/video\/([a-z0-9-]+)\.mp4$/, "/media/sitios/$1/video.mp4");
}

function unique(list: (string | null | undefined)[]): string[] {
  return [...new Set(list.filter((item): item is string => Boolean(item)))];
}

/**
 * Aplica al lugar sus medios y sus coordenadas sin tocar los datos editoriales.
 * Prioridad de la foto: `MEDIA_MAP` (config/media.ts) → carpeta
 * `media/sitios/<slug>/` → ajuste manual de PLACE_MEDIA → lo que diga la API.
 */
export function withMedia(place: Place): Place {
  const media = PLACE_MEDIA[place.slug];
  const site = SITE_MEDIA[place.slug];
  const manual = MEDIA_MAP[place.slug];
  const fixed = COORDS[place.slug];
  const apiImage = place.imageUrl ? legacyUrl(place.imageUrl) : null;
  const imageUrl = manual?.cover ?? site?.cover ?? media?.image ?? site?.photos?.[0] ?? apiImage;
  // Los panoramas de marcador de posición (SVG) no cuentan como vista 360° real.
  const apiPano = place.panoUrl && !place.panoUrl.includes("placeholder") ? place.panoUrl : null;
  // El crédito de PLACE_MEDIA describe la portada, no las fotos propias de la galería.
  const credited = Boolean(imageUrl) && (imageUrl === site?.cover || imageUrl === media?.image);
  const gallery = unique([imageUrl, ...(manual?.gallery ?? site?.photos ?? []), ...(media?.gallery ?? [])]);

  return {
    ...place,
    history: cleanCopy(place.history),
    shortDescription: cleanCopy(place.shortDescription),
    ...(fixed ? { latitude: fixed[0], longitude: fixed[1], coordsVerified: fixed[2] === 1 } : {}),
    media: place.media.map((item) => ({ ...item, url: legacyUrl(item.url) })),
    imageUrl,
    panoUrl: manual?.pano ?? site?.panos?.[0] ?? media?.pano ?? apiPano,
    imageCredit: credited ? media?.credit : undefined,
    imageSource: credited ? media?.source : undefined,
    gallery: gallery.length > 0 ? gallery : place.gallery,
    videoUrl: manual?.video ?? site?.video ?? media?.video ?? place.videoUrl,
  };
}
