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
    image: "/media/sitios/plaza-republica/portada.jpg",
    video: "/media/sitios/plaza-republica/video.mp4",
    badge: "Video Reel",
    isPopular: true,
  },
  {
    id: "vereda-del-lago",
    slug: "vereda-del-lago",
    title: "Vereda del Lago",
    subtitle: "Brisa del Coquivacoa, caminatas y vista frontal al lago",
    tag: "Lago y Malecón",
    image: "/media/sitios/vereda-del-lago/portada.jpg",
    video: "/media/sitios/vereda-del-lago/video.mp4",
    badge: "Video Reel",
    isPopular: true,
  },
  {
    id: "puente-rafael-urdaneta",
    slug: "puente-rafael-urdaneta",
    title: "Puente sobre el Lago",
    subtitle: "El coloso de concreto que une orillas y abraza al Zulia",
    tag: "Ícono Zuliano",
    image: "/media/sitios/puente-rafael-urdaneta/portada.jpg",
    badge: "Monumento Nacional",
    isPopular: true,
  },
  {
    id: "basilica-chiquinquira",
    slug: "basilica-chiquinquira",
    title: "Basílica de la Chinita",
    subtitle: "Templo mariano y corazón espiritual de todos los zulianos",
    tag: "Fe y Tradición",
    image: "/media/sitios/basilica-chiquinquira/portada.jpg",
    video: "/media/sitios/basilica-chiquinquira/video.mp4",
    badge: "Video Reel",
    isPopular: true,
  },
  {
    id: "parque-urdaneta",
    slug: "parque-urdaneta",
    title: "Parque Urdaneta",
    subtitle: "Monumento ecuestre al prócer zuliano y fuentes monumentales",
    tag: "Historia y Patrimonio",
    image: "/media/sitios/parque-urdaneta/portada.jpg",
    video: "/media/sitios/parque-urdaneta/video.mp4",
    badge: "Video Reel",
    isPopular: false,
  },
  {
    id: "teatro-baralt",
    slug: "teatro-baralt",
    title: "Teatro Baralt",
    subtitle: "Cuna del cine nacional, arte escénico y arquitectura patrimonial",
    tag: "Cultura y Arte",
    image: "/media/sitios/teatro-baralt/portada.jpg",
    video: "/media/sitios/teatro-baralt/video.mp4",
    badge: "Video Reel",
    isPopular: false,
  },
  {
    id: "calle-carabobo",
    slug: "calle-carabobo",
    title: "Calle Carabobo",
    subtitle: "Fachadas coloniales llenas de color, historia y gaitas",
    tag: "Casco Histórico",
    image: "/media/sitios/calle-carabobo/portada.jpg",
    badge: "Color Colonial",
    isPopular: true,
  },
  {
    id: "santa-lucia",
    slug: "santa-lucia",
    title: "Barrio Santa Lucía",
    subtitle: "Tradición marabina, calles empedradas y dulcería típica",
    tag: "Barrio Tradicional",
    image: "/media/sitios/santa-lucia/portada.jpg",
    video: "/media/sitios/santa-lucia/video.mp4",
    badge: "Video Reel",
    isPopular: false,
  },
];
