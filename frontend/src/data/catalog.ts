import type { Place } from "../types";
import type { CategorySlug } from "./categories";

/**
 * Catálogo provisional de la fachada.
 *
 * La API solo trae 6 lugares y 4 categorías; para que la sección «Explorar» tenga
 * vida (plazas, hospitales, escuelas, museos…) el frontend añade estos puntos de
 * Maracaibo. Son datos de demostración: las coordenadas son aproximadas y deben
 * verificarse antes de publicar. Cuando el equipo de contenido cargue todo en la
 * base de datos, basta con vaciar EXTRA_PLACES y PLACE_GROUPS.
 */

const NAMES: Record<CategorySlug, string> = {
  plazas: "Plazas y parques",
  historia: "Historia y patrimonio",
  cultura: "Cultura y arte",
  fe: "Fe y tradición",
  museos: "Museos",
  naturaleza: "Naturaleza",
  lago: "Lago y malecón",
  gastronomia: "Gastronomía",
  compras: "Compras y mercados",
  salud: "Hospitales y salud",
  educacion: "Escuelas y universidades",
  deportes: "Deportes",
  noche: "Vida nocturna",
  transporte: "Transporte",
  arquitectura: "Arquitectura",
};

function place(
  slug: string,
  name: string,
  primary: CategorySlug,
  shortDescription: string,
  history: string,
  address: string,
  latitude: number,
  longitude: number,
  tags: string[]
): Place {
  return {
    slug,
    name,
    category: primary,
    categoryName: NAMES[primary],
    shortDescription,
    history,
    address,
    latitude,
    longitude,
    coordsVerified: false,
    imageUrl: null,
    panoUrl: null,
    tags,
  };
}

export const EXTRA_PLACES: readonly Place[] = [
  place(
    "plaza-baralt",
    "Plaza Baralt",
    "plazas",
    "Una plaza recoleta frente al Teatro Baralt, en pleno corazón del casco histórico.",
    "Ficha provisional: la plaza acompaña al teatro desde el siglo XIX y es uno de los puntos de encuentro más queridos del centro. Falta confirmar fechas y remodelaciones con fuentes.",
    "Plaza Baralt, casco histórico de Maracaibo",
    10.6668,
    -71.6128,
    ["plaza", "centro", "teatro", "patrimonio"]
  ),
  place(
    "plaza-republica",
    "Plaza de la República",
    "plazas",
    "Un espacio abierto con árboles añosos, ideal para una pausa mientras recorres la ciudad.",
    "Ficha provisional: plaza tradicional de Maracaibo. El equipo de contenido debe verificar su origen, monumentos y estado actual.",
    "Centro de Maracaibo (punto por confirmar)",
    10.6706,
    -71.6106,
    ["plaza", "centro", "sombra", "caminata"]
  ),
  place(
    "parque-urdaneta",
    "Parque Urdaneta",
    "plazas",
    "Zona verde del centro con caminerías y sombra para descansar entre visitas.",
    "Ficha provisional: parque histórico de la ciudad. Pendiente confirmar su historia, servicios y horarios.",
    "Sector centro, Maracaibo",
    10.6724,
    -71.6152,
    ["parque", "verde", "descanso", "familia"]
  ),
  place(
    "monumento-indio-mara",
    "Monumento Indio Mara",
    "plazas",
    "Una escultura emblemática que recuerda el origen indígena de la región.",
    "Ficha provisional: el monumento es uno de los íconos modernos de Maracaibo. Falta verificar autoría, año y ubicación exacta.",
    "Avenida Bella Vista, Maracaibo",
    10.6795,
    -71.6215,
    ["monumento", "fotografía", "cultura", "bella vista"]
  ),
  place(
    "casa-capitulacion",
    "Casa de la Capitulación",
    "museos",
    "Casona colonial convertida en museo, testimonio del pasado político de la ciudad.",
    "Ficha provisional: aquí se reunieron autoridades coloniales y se firmaron documentos clave de la historia zuliana. Confirmar fechas y colecciones con el museo.",
    "Casco histórico de Maracaibo",
    10.6671,
    -71.6133,
    ["museo", "colonial", "historia", "centro"]
  ),
  place(
    "palacio-gobierno-zulia",
    "Palacio de Gobierno del Zulia",
    "historia",
    "Edificio sede del gobierno regional, con una fachada de aire republicano.",
    "Ficha provisional: palacio de gobierno del estado Zulia. Falta confirmar su arquitecto, año de construcción y visitas guiadas.",
    "Casco histórico de Maracaibo",
    10.6657,
    -71.6138,
    ["gobierno", "arquitectura", "historia", "centro"]
  ),
  place(
    "mercado-las-pulgas",
    "Mercado Las Pulgas",
    "compras",
    "Mercado popular donde se mezclan colores, aromas y el ritmo cotidiano de la ciudad.",
    "Ficha provisional: mercado tradicional del centro de Maracaibo. Verificar horarios, accesos y recomendaciones de seguridad antes de publicar.",
    "Centro de Maracaibo (sector Las Pulgas)",
    10.6629,
    -71.6162,
    ["mercado", "compras", "comida", "centro"]
  ),
  place(
    "puente-rafael-urdaneta",
    "Puente General Rafael Urdaneta",
    "lago",
    "El gran puente sobre el Lago de Maracaibo, una obra que cambió la conexión del Zulia.",
    "Ficha provisional: inaugurado en 1962, es uno de los puentes más largos de Latinoamérica. Confirmar datos técnicos y miradores seguros.",
    "Sobre el Lago de Maracaibo, al sur de la ciudad",
    10.5767,
    -71.5835,
    ["puente", "lago", "obra", "panorámica"]
  ),
  place(
    "centro-arte-lia-bermudez",
    "Centro de Arte de Maracaibo Lía Bermúdez",
    "cultura",
    "Antiguo mercado convertido en centro cultural con exposiciones y actividades.",
    "Ficha provisional: el CAMLB ocupa un edificio patrimonial y programa arte contemporáneo. Confirmar horarios y cartelera.",
    "Avenida 2, casco histórico de Maracaibo",
    10.6661,
    -71.6118,
    ["arte", "centro cultural", "exposición", "centro"]
  ),
  place(
    "biblioteca-publica-zulia",
    "Biblioteca Pública del Zulia",
    "cultura",
    "Un refugio tranquilo para leer, estudiar y conocer el acervo regional.",
    "Ficha provisional: biblioteca pública de referencia en Maracaibo. Verificar sedes, horarios y servicios disponibles.",
    "Centro de Maracaibo (dirección por confirmar)",
    10.6689,
    -71.6157,
    ["biblioteca", "lectura", "estudio", "cultura"]
  ),
  place(
    "catedral-maracaibo",
    "Catedral de Maracaibo",
    "fe",
    "Templo histórico del centro, punto de referencia de la vida religiosa zuliana.",
    "Ficha provisional: la catedral forma parte del conjunto patrimonial del casco histórico. Confirmar su historia y horarios de visita.",
    "Casco histórico de Maracaibo",
    10.6672,
    -71.6124,
    ["catedral", "iglesia", "patrimonio", "centro"]
  ),
  place(
    "iglesia-santa-lucia",
    "Iglesia Santa Lucía",
    "fe",
    "Pequeña iglesia de barrio, ligada a la vida cotidiana y a las fiestas de Santa Lucía.",
    "Ficha provisional: templo del barrio Santa Lucía. Verificar su construcción y celebraciones patronales.",
    "Barrio Santa Lucía, Maracaibo",
    10.6562,
    -71.6187,
    ["iglesia", "barrio", "tradición", "santa lucía"]
  ),
  place(
    "iglesia-san-francisco",
    "Iglesia San Francisco",
    "fe",
    "Una iglesia de escala humana en el centro, con misas y actividad comunitaria.",
    "Ficha provisional: templo católico del centro de Maracaibo. Confirmar datos históricos y horarios.",
    "Sector centro, Maracaibo",
    10.6642,
    -71.6219,
    ["iglesia", "comunidad", "centro", "fe"]
  ),
  place(
    "maczul",
    "Museo de Arte Contemporáneo del Zulia",
    "museos",
    "El MACZUL reúne arte contemporáneo y una de las colecciones más importantes de la región.",
    "Ficha provisional: museo universitario de arte contemporáneo. Verificar horarios, salas abiertas y programación.",
    "Avenida Universidad, Maracaibo",
    10.6753,
    -71.6114,
    ["museo", "arte", "contemporáneo", "universidad"]
  ),
  place(
    "jardin-botanico-maracaibo",
    "Jardín Botánico de Maracaibo",
    "naturaleza",
    "Un pulmón verde para caminar entre árboles, aves y vegetación tropical.",
    "Ficha provisional: jardín botánico de la ciudad. Confirmar horarios, entradas y recorridos guiados.",
    "Sector norte de Maracaibo (acceso por confirmar)",
    10.681,
    -71.639,
    ["jardín", "plantas", "aves", "caminata"]
  ),
  place(
    "parque-universitario-luz",
    "Parque Universitario",
    "naturaleza",
    "Zona verde junto a la universidad, frecuentada por estudiantes y vecinos.",
    "Ficha provisional: espacio recreativo del área universitaria. Verificar accesos y estado actual.",
    "Ciudad Universitaria, Maracaibo",
    10.6795,
    -71.632,
    ["parque", "universidad", "verde", "deporte"]
  ),
  place(
    "malecon-maracaibo",
    "Malecón de Maracaibo",
    "lago",
    "Orilla del lago para caminar al atardecer y sentir la brisa de Maracaibo.",
    "Ficha provisional: paseo junto al Lago de Maracaibo. Confirmar el tramo habilitado y los horarios recomendados.",
    "Orilla del Lago de Maracaibo",
    10.6656,
    -71.6051,
    ["malecón", "lago", "atardecer", "brisa"]
  ),
  place(
    "mercado-guajiro",
    "Mercado Guajiro",
    "gastronomia",
    "Sabores del Zulia, artesanía y productos frescos en un mercado con carácter.",
    "Ficha provisional: mercado popular de Maracaibo. Verificar horarios, ubicación exacta y recomendaciones.",
    "Centro de Maracaibo (sector por confirmar)",
    10.6647,
    -71.6205,
    ["mercado", "comida", "artesanía", "zulia"]
  ),
  place(
    "ruta-dulces-santa-lucia",
    "Ruta de los dulces de Santa Lucía",
    "gastronomia",
    "Un recorrido dulce por las casas y tradiciones del barrio Santa Lucía.",
    "Ficha provisional: experiencia gastronómica barrial. Confirmar participantes, días y reservas.",
    "Barrio Santa Lucía, Maracaibo",
    10.6558,
    -71.6193,
    ["dulces", "gastronomía", "barrio", "tradición"]
  ),
  place(
    "calle-72-bella-vista",
    "Calle 72 y Bella Vista",
    "noche",
    "La zona de restaurantes, terrazas y vida nocturna más conocida de la ciudad.",
    "Ficha provisional: corredor gastronómico y nocturno. Verificar locales vigentes y recomendaciones de seguridad.",
    "Bella Vista, Maracaibo",
    10.6784,
    -71.6126,
    ["restaurantes", "noche", "terrazas", "bella vista"]
  ),
  place(
    "sambil-maracaibo",
    "Sambil Maracaibo",
    "compras",
    "Centro comercial amplio con tiendas, cines y opciones para toda la familia.",
    "Ficha provisional: centro comercial de referencia. Confirmar horarios y tiendas vigentes.",
    "Avenida Bella Vista, Maracaibo",
    10.6905,
    -71.6302,
    ["compras", "cine", "familia", "comida"]
  ),
  place(
    "doral-center",
    "Doral Center",
    "compras",
    "Un centro comercial cómodo para compras rápidas y una pausa de café.",
    "Ficha provisional: centro comercial de Maracaibo. Verificar horarios y servicios.",
    "Sector Bella Vista, Maracaibo",
    10.6843,
    -71.6247,
    ["compras", "café", "familia", "bella vista"]
  ),
  place(
    "galerias-mall",
    "Galerías Mall",
    "compras",
    "Opciones de moda, tecnología y entretenimiento en un solo lugar.",
    "Ficha provisional: centro comercial de la ciudad. Confirmar horarios y tiendas.",
    "Avenida Universidad, Maracaibo",
    10.6702,
    -71.6408,
    ["compras", "moda", "cine", "familia"]
  ),
  place(
    "hospital-universitario-maracaibo",
    "Hospital Universitario de Maracaibo",
    "salud",
    "Principal hospital universitario de la región, junto a la Ciudad Universitaria.",
    "Ficha provisional: centro hospitalario de referencia. Verificar servicios, horarios y contactos oficiales antes de publicar.",
    "Avenida Universidad, Maracaibo",
    10.6762,
    -71.6361,
    ["hospital", "salud", "universidad", "emergencias"]
  ),
  place(
    "hospital-especialidades-pediatricas",
    "Hospital de Especialidades Pediátricas",
    "salud",
    "Centro especializado en atención médica para niños y adolescentes.",
    "Ficha provisional: hospital pediátrico de referencia en el Zulia. Confirmar servicios y contactos.",
    "Sector norte de Maracaibo (dirección por confirmar)",
    10.6812,
    -71.6428,
    ["hospital", "pediatría", "salud", "niños"]
  ),
  place(
    "maternidad-del-zulia",
    "Maternidad del Zulia",
    "salud",
    "Institución dedicada a la atención materno-infantil en Maracaibo.",
    "Ficha provisional: centro de salud materno-infantil. Verificar nombre oficial, dirección y servicios.",
    "Maracaibo (dirección por confirmar)",
    10.6698,
    -71.6315,
    ["maternidad", "salud", "familia", "mujeres"]
  ),
  place(
    "hospital-general-del-sur",
    "Hospital General del Sur",
    "salud",
    "Hospital general que atiende a la zona sur de la ciudad.",
    "Ficha provisional: centro hospitalario del sur de Maracaibo. Confirmar servicios y contactos oficiales.",
    "Zona sur de Maracaibo (dirección por confirmar)",
    10.6524,
    -71.6396,
    ["hospital", "salud", "emergencias", "sur"]
  ),
  place(
    "cruz-roja-zulia",
    "Cruz Roja Venezolana · Filial Zulia",
    "salud",
    "Sede regional de la Cruz Roja, con servicios de salud y primeros auxilios.",
    "Ficha provisional: filial zuliana de la Cruz Roja. Verificar dirección, horarios y servicios.",
    "Maracaibo (dirección por confirmar)",
    10.6741,
    -71.6208,
    ["cruz roja", "salud", "primeros auxilios", "ayuda"]
  ),
  place(
    "universidad-del-zulia",
    "Universidad del Zulia (LUZ)",
    "educacion",
    "La Ciudad Universitaria es un ícono educativo y arquitectónico del Zulia.",
    "Ficha provisional: principal universidad pública de la región. Confirmar datos históricos, accesos y recorridos.",
    "Ciudad Universitaria, Maracaibo",
    10.679,
    -71.6337,
    ["universidad", "luz", "educación", "arquitectura"]
  ),
  place(
    "unica",
    "Universidad Católica Cecilio Acosta",
    "educacion",
    "Universidad privada de inspiración católica, con actividad cultural y académica.",
    "Ficha provisional: universidad de Maracaibo. Verificar sedes, carreras y horarios de visita.",
    "Maracaibo (sede por confirmar)",
    10.6705,
    -71.6243,
    ["universidad", "educación", "católica", "unica"]
  ),
  place(
    "urbe",
    "Universidad Rafael Belloso Chacín",
    "educacion",
    "Campus universitario de gran extensión, con oferta académica en varias áreas.",
    "Ficha provisional: universidad privada de Maracaibo. Confirmar datos de sedes y carreras.",
    "Sector norte de Maracaibo (dirección por confirmar)",
    10.6912,
    -71.648,
    ["universidad", "educación", "urbe", "campus"]
  ),
  place(
    "colegio-bellas-artes",
    "Colegio Bellas Artes",
    "educacion",
    "Institución educativa con tradición artística en el centro de la ciudad.",
    "Ficha provisional: colegio de Maracaibo. Verificar historia, dirección y actividades culturales.",
    "Centro de Maracaibo (dirección por confirmar)",
    10.6655,
    -71.6159,
    ["colegio", "educación", "arte", "centro"]
  ),
  place(
    "estadio-pachencho-romero",
    "Estadio José Encarnación «Pachencho» Romero",
    "deportes",
    "El gran estadio de fútbol de Maracaibo y escenario de la selección nacional.",
    "Ficha provisional: estadio principal de la ciudad. Confirmar aforo, eventos y accesos.",
    "Sector norte de Maracaibo (dirección por confirmar)",
    10.6789,
    -71.6585,
    ["estadio", "fútbol", "deporte", "eventos"]
  ),
  place(
    "estadio-luis-aparicio",
    "Estadio Luis Aparicio «El Grande»",
    "deportes",
    "Casa del béisbol zuliano y uno de los escenarios deportivos más queridos.",
    "Ficha provisional: estadio de béisbol de Maracaibo. Verificar calendario y accesos.",
    "Maracaibo (dirección por confirmar)",
    10.6707,
    -71.6182,
    ["estadio", "béisbol", "deporte", "zulia"]
  ),
  place(
    "estadio-alejandro-borges",
    "Estadio Alejandro Borges",
    "deportes",
    "Escenario histórico del deporte maracaibero, hoy parte de la memoria de la ciudad.",
    "Ficha provisional: estadio con historia en Maracaibo. Confirmar estado actual y uso.",
    "Centro de Maracaibo (dirección por confirmar)",
    10.6649,
    -71.6176,
    ["estadio", "deporte", "historia", "centro"]
  ),
  place(
    "zona-rosa-bella-vista",
    "Zona Rosa de Bella Vista",
    "noche",
    "Restaurantes, música y terrazas para cerrar el día con sabor maracaibero.",
    "Ficha provisional: zona de ocio y gastronomía. Verificar locales vigentes y recomendaciones.",
    "Bella Vista, Maracaibo",
    10.679,
    -71.6145,
    ["noche", "restaurantes", "música", "bella vista"]
  ),
  place(
    "aeropuerto-la-chinita",
    "Aeropuerto Internacional La Chinita",
    "transporte",
    "La puerta aérea de Maracaibo, nombrada en honor a la Virgen de Chiquinquirá.",
    "Ficha provisional: principal aeropuerto del Zulia. Confirmar vuelos, servicios y transporte al centro.",
    "Avenida La Chinita, Maracaibo",
    10.5583,
    -71.7279,
    ["aeropuerto", "vuelos", "transporte", "la chinita"]
  ),
  place(
    "terminal-pasajeros-maracaibo",
    "Terminal de Pasajeros de Maracaibo",
    "transporte",
    "Punto de salida y llegada de rutas interurbanas del occidente del país.",
    "Ficha provisional: terminal terrestre de Maracaibo. Verificar destinos, horarios y servicios.",
    "Maracaibo (dirección por confirmar)",
    10.6661,
    -71.6405,
    ["terminal", "autobuses", "transporte", "viajes"]
  ),
];

/**
 * Categorías de cada lugar. Un lugar puede pertenecer a varias (una plaza también
 * es historia; un mercado también es gastronomía). El primer elemento es la
 * categoría principal que se muestra en tarjetas y fichas.
 */
export const PLACE_GROUPS: Record<string, readonly CategorySlug[]> = {
  // Lugares que vienen de la API (sus categorías originales eran más generales).
  "basilica-chiquinquira": ["fe", "historia", "arquitectura"],
  "teatro-baralt": ["cultura", "historia", "arquitectura"],
  "plaza-bolivar": ["plazas", "historia"],
  "calle-carabobo": ["historia", "arquitectura", "compras"],
  "santa-lucia": ["cultura", "historia", "gastronomia"],
  "paseo-del-lago": ["lago", "naturaleza"],

  "plaza-baralt": ["plazas", "historia"],
  "plaza-republica": ["plazas"],
  "parque-urdaneta": ["plazas", "naturaleza"],
  "monumento-indio-mara": ["plazas", "arquitectura"],
  "casa-capitulacion": ["museos", "historia", "arquitectura"],
  "palacio-gobierno-zulia": ["historia", "arquitectura"],
  "mercado-las-pulgas": ["compras", "gastronomia", "historia"],
  "puente-rafael-urdaneta": ["lago", "arquitectura", "transporte"],
  "centro-arte-lia-bermudez": ["cultura", "museos"],
  "biblioteca-publica-zulia": ["cultura", "educacion"],
  "catedral-maracaibo": ["fe", "historia", "arquitectura"],
  "iglesia-santa-lucia": ["fe"],
  "iglesia-san-francisco": ["fe"],
  maczul: ["museos", "cultura"],
  "jardin-botanico-maracaibo": ["naturaleza", "educacion"],
  "parque-universitario-luz": ["naturaleza", "educacion"],
  "malecon-maracaibo": ["lago", "naturaleza"],
  "mercado-guajiro": ["gastronomia", "compras"],
  "ruta-dulces-santa-lucia": ["gastronomia", "cultura"],
  "calle-72-bella-vista": ["noche", "gastronomia"],
  "sambil-maracaibo": ["compras"],
  "doral-center": ["compras"],
  "galerias-mall": ["compras"],
  "hospital-universitario-maracaibo": ["salud", "educacion"],
  "hospital-especialidades-pediatricas": ["salud"],
  "maternidad-del-zulia": ["salud"],
  "hospital-general-del-sur": ["salud"],
  "cruz-roja-zulia": ["salud"],
  "universidad-del-zulia": ["educacion", "arquitectura"],
  unica: ["educacion"],
  urbe: ["educacion"],
  "colegio-bellas-artes": ["educacion", "cultura"],
  "estadio-pachencho-romero": ["deportes"],
  "estadio-luis-aparicio": ["deportes"],
  "estadio-alejandro-borges": ["deportes"],
  "zona-rosa-bella-vista": ["noche", "gastronomia"],
  "aeropuerto-la-chinita": ["transporte"],
  "terminal-pasajeros-maracaibo": ["transporte"],
};

/** Los lugares extra son contenido provisional de la fachada. */
export const EXTRA_SLUGS = new Set(EXTRA_PLACES.map((p) => p.slug));
