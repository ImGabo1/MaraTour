import type { MessageKey } from "../i18n/messages";
import type { CategoryIconName } from "../components/icons";

/** Las categorías que puede explorar un visitante. El orden es el de la parrilla. */
export type CategorySlug =
  | "plazas"
  | "historia"
  | "cultura"
  | "fe"
  | "museos"
  | "naturaleza"
  | "lago"
  | "gastronomia"
  | "compras"
  | "salud"
  | "educacion"
  | "deportes"
  | "noche"
  | "transporte"
  | "arquitectura";

/** Familias para agrupar los temas en la exploración. */
export type CategoryGroup = "cultura" | "sabores" | "aire" | "ciudad";

export interface CategoryDef {
  slug: CategorySlug;
  nameKey: MessageKey;
  icon: CategoryIconName;
  /** Color principal (inicio del degradado). */
  from: string;
  /** Color final del degradado. */
  to: string;
  /** Tinte suave para fondos de burbujas y fichas. */
  soft: string;
  /** Una frase corta que invita a entrar. */
  blurb: string;
  group: CategoryGroup;
}

export const CATEGORY_GROUPS: readonly {
  slug: CategoryGroup;
  label: string;
  hint: string;
}[] = [
  { slug: "cultura", label: "Cultura e historia", hint: "Para caminar y entender la ciudad" },
  { slug: "sabores", label: "Sabores y vida", hint: "Para comer, comprar y salir de noche" },
  { slug: "aire", label: "Aire libre", hint: "Para respirar, caminar y ver el lago" },
  { slug: "ciudad", label: "La ciudad práctica", hint: "Servicios y datos para moverte" },
];

export const CATEGORIES: readonly CategoryDef[] = [
  {
    slug: "plazas",
    nameKey: "category.plazas",
    icon: "landmark",
    from: "#F4A63A",
    to: "#E4683C",
    soft: "#FDF0DC",
    blurb: "Puntos de encuentro, sombra y vida de barrio.",
    group: "cultura",
  },
  {
    slug: "historia",
    nameKey: "category.historia",
    icon: "bank",
    from: "#B07A4A",
    to: "#7A5236",
    soft: "#F5EADF",
    blurb: "Calles y edificios que cuentan cómo nació la ciudad.",
    group: "cultura",
  },
  {
    slug: "cultura",
    nameKey: "category.cultura",
    icon: "palette",
    from: "#8B7BD8",
    to: "#D96AA6",
    soft: "#F2EEFB",
    blurb: "Arte, teatro y espacios para sentir el Zulia.",
    group: "cultura",
  },
  {
    slug: "fe",
    nameKey: "category.fe",
    icon: "church",
    from: "#E688A8",
    to: "#B85C8A",
    soft: "#FBEBF1",
    blurb: "Templos y devociones que mueven a todo un pueblo.",
    group: "cultura",
  },
  {
    slug: "museos",
    nameKey: "category.museos",
    icon: "museum",
    from: "#5A8DE0",
    to: "#7657CE",
    soft: "#EAF0FB",
    blurb: "Colecciones y memoria para entender Maracaibo.",
    group: "cultura",
  },
  {
    slug: "naturaleza",
    nameKey: "category.naturaleza",
    icon: "leaf",
    from: "#57A96F",
    to: "#23775A",
    soft: "#E7F4EA",
    blurb: "Verde, brisa y rincones para respirar.",
    group: "aire",
  },
  {
    slug: "lago",
    nameKey: "category.lago",
    icon: "waves",
    from: "#2FAFBE",
    to: "#0A6572",
    soft: "#E0F3F5",
    blurb: "Atardeceres frente al lago más grande de Latinoamérica.",
    group: "aire",
  },
  {
    slug: "gastronomia",
    nameKey: "category.gastronomia",
    icon: "utensils",
    from: "#F08A3C",
    to: "#D4472F",
    soft: "#FDEBE0",
    blurb: "Arepas, patacones y sabores que se recuerdan.",
    group: "sabores",
  },
  {
    slug: "compras",
    nameKey: "category.compras",
    icon: "bag",
    from: "#E26AA8",
    to: "#9A49C2",
    soft: "#FAE9F3",
    blurb: "Mercados, artesanía y centros para llevar un recuerdo.",
    group: "sabores",
  },
  {
    slug: "salud",
    nameKey: "category.salud",
    icon: "cross",
    from: "#E05B5B",
    to: "#AE2F4A",
    soft: "#FBE8E8",
    blurb: "Centros de atención para viajar con tranquilidad.",
    group: "ciudad",
  },
  {
    slug: "educacion",
    nameKey: "category.educacion",
    icon: "cap",
    from: "#4C8BD6",
    to: "#2B5C9E",
    soft: "#E8F0FA",
    blurb: "Universidades y espacios de conocimiento.",
    group: "ciudad",
  },
  {
    slug: "deportes",
    nameKey: "category.deportes",
    icon: "ball",
    from: "#3FA672",
    to: "#1B7350",
    soft: "#E6F4EC",
    blurb: "Estadios y canchas donde late la pasión zuliana.",
    group: "aire",
  },
  {
    slug: "noche",
    nameKey: "category.noche",
    icon: "moon",
    from: "#565A9E",
    to: "#242A5C",
    soft: "#EAEAF6",
    blurb: "Música, terrazas y la energía de Bella Vista.",
    group: "sabores",
  },
  {
    slug: "transporte",
    nameKey: "category.transporte",
    icon: "bus",
    from: "#6A7C8C",
    to: "#33475A",
    soft: "#EBEFF2",
    blurb: "Cómo moverte y llegar a cada rincón.",
    group: "ciudad",
  },
  {
    slug: "arquitectura",
    nameKey: "category.arquitectura",
    icon: "tower",
    from: "#B48763",
    to: "#775538",
    soft: "#F5ECE3",
    blurb: "Fachadas, plazas y obras que marcaron época.",
    group: "cultura",
  },
];

/** Temas que aparecen primero en la portada: los más turísticos. */
export const FEATURED_CATEGORY_SLUGS: readonly CategorySlug[] = [
  "historia",
  "gastronomia",
  "lago",
  "cultura",
  "plazas",
  "fe",
  "naturaleza",
  "noche",
];

const BY_SLUG = new Map<string, CategoryDef>(CATEGORIES.map((category) => [category.slug, category]));

export function isCategorySlug(value: string): value is CategorySlug {
  return BY_SLUG.has(value);
}

export function categoryBySlug(slug: string): CategoryDef | undefined {
  return BY_SLUG.get(slug);
}

/** Traduce el nombre de una categoría; si no existe en el catálogo, devuelve `fallback`. */
export function categoryLabelKey(slug: string): MessageKey | null {
  return BY_SLUG.get(slug)?.nameKey ?? null;
}

export interface CategoryMedia {
  /** Foto de portada de la categoría. */
  image: string;
  /** Crédito visible para cumplir la licencia de la foto. */
  credit: string;
  /** Enlace a la ficha original de la imagen. */
  source?: string;
}

/**
 * Foto que representa cada categoría en la portada.
 *
 * Para cambiar una imagen, reemplaza el archivo o apunta `image` a la ruta
 * nueva. Cuando el equipo envíe las fotos definitivas, basta con editar este
 * mapa: no hay que tocar el diseño de las tarjetas.
 */
export const CATEGORY_MEDIA: Record<CategorySlug, CategoryMedia> = {
  plazas: {
    image: "/media/lugares/plaza-bolivar.jpg",
    credit: "Foto: Zerojosefer · CC BY-SA 4.0 · Wikimedia Commons",
  },
  historia: {
    image: "/media/lugares/palacio-gobierno-zulia.jpg",
    credit: "Foto: Anata08 · CC BY 4.0 · Wikimedia Commons",
  },
  cultura: {
    image: "/media/lugares/teatro-baralt.jpg",
    credit: "Foto: Béria Lima de Rodríguez · CC BY-SA 3.0 · Wikimedia Commons",
  },
  fe: {
    image: "/media/lugares/basilica-chiquinquira.jpg",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
  },
  museos: {
    image: "/media/lugares/maczul.jpg",
    credit: "Foto: HumbRios · CC BY-SA 3.0 · Wikimedia Commons",
  },
  naturaleza: {
    image: "/media/categorias/naturaleza.jpg",
    credit: "Foto: Rjcastillo · CC BY-SA 4.0 · Wikimedia Commons",
  },
  lago: {
    image: "/media/lugares/paseo-del-lago.jpg",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
  },
  gastronomia: {
    image: "/media/categorias/gastronomia.jpg",
    credit: "Foto: Jdvillalobos · CC BY-SA 3.0 · Wikimedia Commons",
  },
  compras: {
    image: "/media/lugares/sambil-maracaibo.jpg",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
  },
  salud: {
    image: "/media/categorias/salud.jpg",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
  },
  educacion: {
    image: "/media/lugares/universidad-del-zulia.jpg",
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
  },
  deportes: {
    image: "/media/lugares/estadio-pachencho-romero.jpg",
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
  },
  noche: {
    image: "/media/categorias/noche.jpg",
    credit: "Foto: Rjcastillo · CC BY-SA 3.0 · Wikimedia Commons",
  },
  transporte: {
    image: "/media/lugares/puente-rafael-urdaneta.jpg",
    credit: "Foto: Wilfredor · CC0 · Wikimedia Commons",
  },
  arquitectura: {
    image: "/media/lugares/casa-capitulacion.jpg",
    credit: "Foto: Vzerpaquintero · CC BY-SA 4.0 · Wikimedia Commons",
  },
};
