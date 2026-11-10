export interface TouristReel {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  video?: string;
  badge?: string;
  isPopular?: boolean;
}

export const TOURIST_REELS: readonly TouristReel[] = [
  {
    id: "plaza-republica",
    slug: "plaza-republica",
    title: "Plaza de la República",
    subtitle: "Fuentes danzantes, obelisco y atardecer en Bella Vista",
    tag: "Plazas y Parques",
    image: "/media/lugares/plaza-republica.jpg",
    video: "/media/video/plaza-republica.mp4",
    badge: "Video Reel",
    isPopular: true,
  },
  {
    id: "vereda-del-lago",
    slug: "vereda-del-lago",
    title: "Vereda del Lago",
    subtitle: "Brisa del Coquivacoa, caminatas y vista frontal al lago",
    tag: "Lago y Malecón",
    image: "/media/lugares/vereda-del-lago.jpg",
    video: "/media/video/vereda-del-lago.mp4",
    badge: "Video Reel",
    isPopular: true,
  },
  {
    id: "puente-rafael-urdaneta",
    slug: "puente-rafael-urdaneta",
    title: "Puente sobre el Lago",
    subtitle: "El coloso de concreto que une orillas y abraza al Zulia",
    tag: "Ícono Zuliano",
    image: "/media/lugares/puente-rafael-urdaneta.jpg",
    badge: "Monumento Nacional",
    isPopular: true,
  },
  {
    id: "basilica-chiquinquira",
    slug: "basilica-chiquinquira",
    title: "Basílica de la Chinita",
    subtitle: "Templo mariano y corazón espiritual de todos los zulianos",
    tag: "Fe y Tradición",
    image: "/media/lugares/basilica-chiquinquira.jpg",
    video: "/media/video/basilica-chiquinquira.mp4",
    badge: "Video Reel",
    isPopular: true,
  },
  {
    id: "parque-urdaneta",
    slug: "parque-urdaneta",
    title: "Parque Urdaneta",
    subtitle: "Monumento ecuestre al prócer zuliano y fuentes monumentales",
    tag: "Historia y Patrimonio",
    image: "/media/lugares/parque-urdaneta.jpg",
    video: "/media/video/parque-urdaneta.mp4",
    badge: "Video Reel",
    isPopular: false,
  },
  {
    id: "teatro-baralt",
    slug: "teatro-baralt",
    title: "Teatro Baralt",
    subtitle: "Cuna del cine nacional, arte escénico y arquitectura patrimonial",
    tag: "Cultura y Arte",
    image: "/media/lugares/teatro-baralt.jpg",
    video: "/media/video/teatro-baralt.mp4",
    badge: "Video Reel",
    isPopular: false,
  },
  {
    id: "calle-carabobo",
    slug: "calle-carabobo",
    title: "Calle Carabobo",
    subtitle: "Fachadas coloniales llenas de color, historia y gaitas",
    tag: "Casco Histórico",
    image: "/media/lugares/calle-carabobo.jpg",
    badge: "Color Colonial",
    isPopular: true,
  },
  {
    id: "santa-lucia",
    slug: "santa-lucia",
    title: "Barrio Santa Lucía",
    subtitle: "Tradición marabina, calles empedradas y dulcería típica",
    tag: "Barrio Tradicional",
    image: "/media/lugares/santa-lucia.jpg",
    video: "/media/video/santa-lucia.mp4",
    badge: "Video Reel",
    isPopular: false,
  },
];
