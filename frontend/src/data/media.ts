/**
 * Fotos y medios por lugar.
 *
 * Cada lugar puede tener una carpeta en `frontend/public/media/lugares/` con:
 *   - `<slug>.jpg`  → foto de portada (1200 × 800 recomendado)
 *   - `../360/<slug>.jpg` → panorama 360° equirectangular (2:1)
 *   - `../video/<slug>.mp4` → video corto del lugar
 *
 * Para cambiar una foto basta con reemplazar el archivo y recargar. Si el lugar
 * todavía no tiene foto propia, la tarjeta usa una portada generada por categoría.
 */
import type { Place } from "../types";

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

const photo = (slug: string): string => `/media/lugares/${slug}.jpg`;

export const PLACE_MEDIA: Record<string, PlaceMedia> = {
  "basilica-chiquinquira": {
    image: photo("basilica-chiquinquira"),
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Bas%C3%ADlica_de_nuestra_se%C3%B1ora_de_la_Chiquinquira.jpg",
  },
  "teatro-baralt": {
    image: photo("teatro-baralt"),
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
    credit: "Foto: Zerojosefer · CC BY-SA 4.0 · Wikimedia Commons",
    source: "https://commons.wikimedia.org/wiki/File:Parque_Rafael_Urdaneta_005.jpg",
  },
  "parque-universitario-luz": {
    image: photo("parque-universitario"),
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
};

/** Aplica foto, galería y 360 al lugar sin tocar sus datos editoriales. */
export function withMedia(place: Place): Place {
  const media = PLACE_MEDIA[place.slug];
  if (!media) return place;
  return {
    ...place,
    imageUrl: media.image ?? place.imageUrl,
    panoUrl: media.pano ?? place.panoUrl,
    imageCredit: media.credit,
    imageSource: media.source,
    gallery: media.gallery ?? (media.image ? [media.image] : place.gallery),
    videoUrl: media.video ?? place.videoUrl,
  };
}
