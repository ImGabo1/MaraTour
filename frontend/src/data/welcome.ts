export interface WelcomeSlide {
  src: string;
  kicker: string;
  title: string;
  caption: string;
  /** Slug del lugar para abrir la ficha desde el carrusel. */
  slug?: string;
}

/**
 * Carrusel de bienvenida.
 * Para usar fotos propias, guarda archivos en `frontend/public/media/carrusel/`
 * y cambia las rutas de esta lista. Recomendado: 1600 × 1000 px, JPG.
 */
export const WELCOME_SLIDES: readonly WelcomeSlide[] = [
  {
    src: "/media/galeria/optimized/IMG_20261103_090135.jpg",
    kicker: "Fe y tradición",
    title: "Basílica de la Chinita",
    slug: "basilica-chiquinquira",
    caption: "El corazón rosa del Zulia, donde la ciudad se encuentra cada noviembre.",
  },
  {
    src: "/media/galeria/optimized/IMG_20261102_160508.jpg",
    kicker: "Atardeceres",
    title: "Vereda del Lago",
    slug: "vereda-del-lago",
    caption: "Brisa, malecón y el sol cayendo sobre el lago más grande de Latinoamérica.",
  },
  {
    src: "/media/galeria/optimized/IMG_20261102_151725.jpg",
    kicker: "Ícono zuliano",
    title: "Puente sobre el Lago",
    slug: "puente-rafael-urdaneta",
    caption: "La obra que une orillas y se volvió postal obligatoria de Maracaibo.",
  },
  {
    src: "/media/galeria/optimized/IMG_20261103_090136.jpg",
    kicker: "Centro histórico",
    title: "Plaza Baralt",
    slug: "plaza-baralt",
    caption: "Gente, sombra y café en el corazón patrimonial de la ciudad.",
  },
  {
    src: "/media/galeria/optimized/IMG_20261102_151730.jpg",
    kicker: "Cultura",
    title: "Teatro Baralt",
    slug: "teatro-baralt",
    caption: "Un siglo de escenarios, música y memoria frente a la plaza.",
  },
  {
    src: "/media/galeria/optimized/IMG_20261103_091819.jpg",
    kicker: "Postal moderna",
    title: "Monumento a la Chinita",
    slug: "plaza-monumento-chinita",
    caption: "La silueta de la Virgen que recibe a quien llega por la autopista.",
  },
  {
    src: "/media/galeria/optimized/IMG_20261102_151730.jpg",
    kicker: "Compras",
    title: "Galerías Mall",
    slug: "galerias-mall",
    caption: "Un plan seguro para compartir en familia o con amigos.",
  },
];
