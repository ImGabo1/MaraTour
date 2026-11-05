import type { Place } from "../types";
import type { CategorySlug } from "./categories";

/**
 * Catálogo curado de la fachada.
 *
 * La API trae seis lugares base; aquí se suman los puntos confirmados por el
 * equipo para que cada tema tenga al menos tres opciones. Las coordenadas son
 * aproximadas (`coordsVerified: false`) hasta la revisión final en campo.
 * Las fotos, galerías y panoramas se conectan por slug desde `data/media.ts`.
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
  tags: string[],
  sector?: "publico" | "privado"
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
    media: [],
    ...(sector ? { sector } : {}),
  };
}

export const EXTRA_PLACES: readonly Place[] = [
  // ===== Plazas =====
  place(
    "plaza-baralt",
    "Plaza Baralt",
    "plazas",
    "La plaza recoleta frente al Teatro Baralt, en pleno corazón del casco histórico.",
    "Desde el siglo XIX la Plaza Baralt acompaña la vida del centro: es punto de encuentro, sombra para el café y antesala del teatro. Su entorno reúne edificios patrimoniales y el movimiento cotidiano del comercio maracucho.",
    "Plaza Baralt, casco histórico de Maracaibo",
    10.6668,
    -71.6128,
    ["plaza", "centro", "teatro", "patrimonio", "café"]
  ),
  place(
    "plaza-republica",
    "Plaza de la República",
    "plazas",
    "Un espacio abierto con árboles añosos, ideal para una pausa mientras recorres la ciudad.",
    "La Plaza de la República es uno de los espacios tradicionales del centro maracucho. Sus árboles y bancos la convierten en una parada tranquila para descansar entre una visita y la siguiente.",
    "Centro de Maracaibo, Zulia",
    10.6706,
    -71.6106,
    ["plaza", "centro", "sombra", "caminata", "descanso"]
  ),
  place(
    "plaza-monumento-chinita",
    "Plaza Monumento a la Chinita",
    "plazas",
    "La silueta de la Virgen que recibe a quienes llegan a la ciudad por la autopista.",
    "Este espacio rinde homenaje a Nuestra Señora de Chiquinquirá, patrona del Zulia. Es una postal moderna de Maracaibo y un punto de encuentro para la fe, la fotografía y las actividades familiares.",
    "Avenida Bella Vista, Maracaibo",
    10.682,
    -71.613,
    ["plaza", "monumento", "chinita", "fe", "fotografía"]
  ),

  // ===== Historia =====
  place(
    "palacio-gobierno-zulia",
    "Palacio de Gobierno del Zulia",
    "historia",
    "Sede del gobierno regional, con una fachada de aire republicano en el centro.",
    "El Palacio de Gobierno del Zulia forma parte del conjunto patrimonial del casco histórico. Su arquitectura y su valor simbólico lo han convertido en una referencia de la vida política del estado.",
    "Casco histórico de Maracaibo",
    10.6657,
    -71.6138,
    ["gobierno", "arquitectura", "historia", "centro"]
  ),

  // ===== Cultura =====
  place(
    "biblioteca-publica-zulia",
    "Biblioteca Pública del Zulia",
    "cultura",
    "Un refugio tranquilo para leer, estudiar y conocer el acervo regional.",
    "La red de bibliotecas públicas del Zulia conserva parte de la memoria documental de la región. Es un buen plan para una pausa cultural, especialmente en días de calor.",
    "Centro de Maracaibo, Zulia",
    10.6689,
    -71.6157,
    ["biblioteca", "lectura", "estudio", "cultura", "silencio"]
  ),

  // ===== Fe =====
  place(
    "catedral-maracaibo",
    "Catedral de Maracaibo",
    "fe",
    "Templo histórico del centro, punto de referencia de la vida religiosa zuliana.",
    "La Catedral de Maracaibo integra el conjunto patrimonial del centro histórico. Su presencia acompaña la vida de la ciudad desde la época colonial y sigue siendo un espacio de encuentro para la fe.",
    "Casco histórico de Maracaibo",
    10.6672,
    -71.6124,
    ["catedral", "iglesia", "patrimonio", "centro", "fe"]
  ),
  place(
    "iglesia-san-francisco",
    "Iglesia San Francisco",
    "fe",
    "Una iglesia de escala humana en el centro, con misas y actividad comunitaria.",
    "La Iglesia San Francisco es parte de la vida cotidiana del centro de Maracaibo. Su comunidad mantiene una agenda de misas y actividades que invita a conocerla con respeto y calma.",
    "Sector centro, Maracaibo",
    10.6642,
    -71.6219,
    ["iglesia", "comunidad", "centro", "fe", "patrimonio"]
  ),

  // ===== Museos =====
  place(
    "centro-arte-lia-bermudez",
    "Centro de Arte de Maracaibo Lía Bermúdez",
    "museos",
    "Antiguo mercado convertido en centro cultural con exposiciones y actividades.",
    "El CAMLB ocupa un edificio patrimonial que antes fue mercado y hoy es uno de los espacios culturales más activos de la ciudad. Su programación combina artes visuales, música y actividades para toda la familia.",
    "Avenida 2, casco histórico de Maracaibo",
    10.6661,
    -71.6118,
    ["arte", "centro cultural", "exposición", "centro", "museo"]
  ),
  place(
    "maczul",
    "Museo de Arte Contemporáneo del Zulia",
    "museos",
    "El MACZUL reúne arte contemporáneo y una de las colecciones más importantes de la región.",
    "El MACZUL es un museo universitario de arte contemporáneo. Su colección y sus salas acercan al público al trabajo de artistas venezolanos y latinoamericanos.",
    "Avenida Universidad, Maracaibo",
    10.6753,
    -71.6114,
    ["museo", "arte", "contemporáneo", "universidad", "cultura"]
  ),
  place(
    "casa-capitulacion",
    "Casa de la Capitulación",
    "museos",
    "Casona colonial convertida en museo, testimonio del pasado político de la ciudad.",
    "En esta casona colonial se reunieron autoridades y se firmaron documentos clave de la historia zuliana. Hoy funciona como museo y permite asomarse a la Maracaibo de siglos pasados.",
    "Casco histórico de Maracaibo",
    10.6671,
    -71.6133,
    ["museo", "colonial", "historia", "centro", "patrimonio"]
  ),

  // ===== Naturaleza =====
  place(
    "parque-urdaneta",
    "Parque Urdaneta",
    "naturaleza",
    "Zona verde del centro con caminerías y sombra para descansar entre visitas.",
    "El Parque Urdaneta es un pulmón tradicional del centro de Maracaibo. Sus caminerías y árboles ofrecen una pausa verde en medio del recorrido urbano.",
    "Sector centro, Maracaibo",
    10.6724,
    -71.6152,
    ["parque", "verde", "descanso", "familia", "sombra"]
  ),
  place(
    "jardin-botanico-maracaibo",
    "Jardín Botánico de Maracaibo",
    "naturaleza",
    "Un pulmón verde para caminar entre árboles, aves y vegetación tropical.",
    "El Jardín Botánico reúne vegetación representativa de la región y ofrece un espacio para caminar, observar aves y aprender sobre el entorno natural del Zulia.",
    "Sector norte de Maracaibo",
    10.681,
    -71.639,
    ["jardín", "plantas", "aves", "caminata", "naturaleza"]
  ),
  place(
    "parque-universitario-luz",
    "Parque Universitario",
    "naturaleza",
    "Zona verde junto a la universidad, frecuentada por estudiantes y vecinos.",
    "El Parque Universitario acompaña la vida de la Ciudad Universitaria. Es un espacio de recreación y deporte que también permite apreciar el patrimonio arquitectónico de la zona.",
    "Ciudad Universitaria, Maracaibo",
    10.6795,
    -71.632,
    ["parque", "universidad", "verde", "deporte", "familia"]
  ),

  // ===== Lago y malecón =====
  place(
    "vereda-del-lago",
    "Vereda del Lago",
    "lago",
    "El paseo favorito para ver el atardecer sobre el Lago de Maracaibo.",
    "La Vereda del Lago es uno de los espacios públicos más queridos de Maracaibo. Su malecón, sus áreas verdes y sus vistas al lago la vuelven una parada obligatoria para caminar, hacer deporte y ver caer el sol.",
    "Vereda del Lago, Maracaibo",
    10.678,
    -71.603,
    ["lago", "atardecer", "malecón", "caminata", "familia"]
  ),
  place(
    "malecon-maracaibo",
    "Malecón de Maracaibo",
    "lago",
    "Orilla del lago para caminar al atardecer y sentir la brisa de Maracaibo.",
    "El malecón junto al Lago de Maracaibo es un espacio tradicional para la caminata y la contemplación. La brisa y la luz del atardecer son parte de la experiencia.",
    "Orilla del Lago de Maracaibo",
    10.6656,
    -71.6051,
    ["malecón", "lago", "atardecer", "brisa", "caminata"]
  ),

  // ===== Gastronomía =====
  place(
    "sabor-zuliano",
    "Sabor Zuliano",
    "gastronomia",
    "Cocina zuliana casera: arepas, patacones y platos que saben a casa.",
    "Sabor Zuliano es una parada para probar la cocina de todos los días con sazón local. Ideal para almorzar sin prisa y compartir varios platos en familia.",
    "Avenida Bella Vista, Maracaibo",
    10.6788,
    -71.6155,
    ["comida", "zuliano", "arepas", "patacones", "familia"]
  ),
  place(
    "rincon-zuliano",
    "El Rincón Zuliano",
    "gastronomia",
    "Un rincón de sabores tradicionales para entrar en confianza con la ciudad.",
    "El Rincón Zuliano reúne recetas de la región en un ambiente cercano. Es una buena primera parada para entender por qué la cocina maracucha se disfruta tanto.",
    "Bella Vista, Maracaibo",
    10.6763,
    -71.6198,
    ["comida", "tradición", "zuliano", "almuerzo", "sabores"]
  ),
  place(
    "mi-vaquita",
    "Mi Vaquita Steak House & Bar",
    "gastronomia",
    "Carnes a la parrilla, buena mesa y un plan tranquilo para cerrar el día.",
    "Mi Vaquita Steak House & Bar propone una experiencia de parrilla y coctelería en un ambiente relajado. Una opción para celebrar o darse un gusto después de recorrer la ciudad.",
    "Avenida Bella Vista, Maracaibo",
    10.6804,
    -71.6142,
    ["parrilla", "carne", "bar", "cena", "celebraciones"]
  ),

  // ===== Compras =====
  place(
    "galerias-mall",
    "Galerías Mall",
    "compras",
    "Opciones de moda, tecnología y entretenimiento en un solo lugar.",
    "Galerías Mall es uno de los centros comerciales de referencia de Maracaibo. Reúne tiendas, cines y opciones de comida en un espacio cómodo para toda la familia.",
    "Avenida Universidad, Maracaibo",
    10.6702,
    -71.6408,
    ["compras", "moda", "cine", "familia", "tecnología"]
  ),
  place(
    "sambil-maracaibo",
    "Sambil Maracaibo",
    "compras",
    "Centro comercial amplio con tiendas, cines y opciones para toda la familia.",
    "Sambil Maracaibo es un centro comercial de gran formato con tiendas, entretenimiento y restaurantes. Su cúpula y sus espacios abiertos lo hacen fácil de recorrer.",
    "Avenida Bella Vista, Maracaibo",
    10.6905,
    -71.6302,
    ["compras", "cine", "familia", "comida", "entretenimiento"]
  ),
  place(
    "doral-center",
    "Doral Center",
    "compras",
    "Un centro comercial cómodo para compras rápidas y una pausa de café.",
    "Doral Center es una opción práctica para compras puntuales, servicios y una pausa de café en la zona de Bella Vista.",
    "Sector Bella Vista, Maracaibo",
    10.6843,
    -71.6247,
    ["compras", "café", "familia", "bella vista", "servicios"]
  ),

  // ===== Salud (públicos y privado) =====
  place(
    "hospital-universitario-maracaibo",
    "Hospital Universitario de Maracaibo",
    "salud",
    "Principal hospital universitario de la región, junto a la Ciudad Universitaria.",
    "El Hospital Universitario de Maracaibo es un centro de referencia para la formación médica y la atención de la región. Antes de acudir conviene confirmar servicios y horarios por los canales oficiales.",
    "Avenida Universidad, Maracaibo",
    10.6762,
    -71.6361,
    ["hospital", "salud", "universidad", "emergencias", "público"],
    "publico"
  ),
  place(
    "hospital-central-maracaibo",
    "Hospital Central de Maracaibo",
    "salud",
    "Hospital público de referencia en la zona de Bella Vista.",
    "El Hospital Central de Maracaibo atiende a la población de la ciudad y forma parte de la red pública de salud del estado. Verifica siempre los servicios disponibles y los canales de contacto oficiales.",
    "Avenida 20, Bella Vista, Maracaibo",
    10.6772,
    -71.6276,
    ["hospital", "salud", "emergencias", "bella vista", "público"],
    "publico"
  ),
  place(
    "hospital-clinico-maracaibo",
    "Hospital Clínico de Maracaibo",
    "salud",
    "Centro hospitalario público con servicios de atención médica general.",
    "El Hospital Clínico de Maracaibo forma parte de la red de atención de la ciudad. Es recomendable confirmar la disponibilidad de cada servicio antes de la visita.",
    "Avenida 20, Maracaibo",
    10.6718,
    -71.6288,
    ["hospital", "salud", "consulta", "público", "atención"]
  ),
  place(
    "clinica-paraiso",
    "Clínica Paraíso",
    "salud",
    "Clínica privada con atención médica y servicios de hospitalización.",
    "La Clínica Paraíso es una opción privada de atención médica en Maracaibo. Para visitas o emergencias conviene llamar antes y confirmar disponibilidad y cobertura.",
    "Sector Las Delicias, Maracaibo",
    10.6812,
    -71.6024,
    ["clínica", "salud", "privado", "consulta", "hospitalización"],
    "privado"
  ),

  // ===== Educación =====
  place(
    "universidad-del-zulia",
    "Universidad del Zulia (LUZ)",
    "educacion",
    "La Ciudad Universitaria es un ícono educativo y arquitectónico del Zulia.",
    "La Universidad del Zulia es la principal universidad pública de la región. Su Ciudad Universitaria reúne patrimonio arquitectónico, vida estudiantil y espacios culturales.",
    "Ciudad Universitaria, Maracaibo",
    10.679,
    -71.6337,
    ["universidad", "luz", "educación", "arquitectura", "cultura"]
  ),
  place(
    "unica",
    "Universidad Católica Cecilio Acosta",
    "educacion",
    "Universidad privada de inspiración católica, con actividad cultural y académica.",
    "La UNICA es una universidad privada de Maracaibo con una propuesta académica vinculada a la formación humanista y católica.",
    "Maracaibo, Zulia",
    10.6705,
    -71.6243,
    ["universidad", "educación", "católica", "unica", "campus"]
  ),
  place(
    "urbe",
    "Universidad Rafael Belloso Chacín",
    "educacion",
    "Campus universitario de gran extensión, con oferta académica en varias áreas.",
    "La Universidad Rafael Belloso Chacín (URBE) es una universidad privada de Maracaibo con un campus amplio y una oferta académica que abarca distintas disciplinas.",
    "Sector norte de Maracaibo",
    10.6912,
    -71.648,
    ["universidad", "educación", "urbe", "campus", "tecnología"]
  ),

  // ===== Deportes =====
  place(
    "estadio-pachencho-romero",
    "Estadio José Encarnación «Pachencho» Romero",
    "deportes",
    "El gran estadio de fútbol de Maracaibo y escenario de la selección nacional.",
    "El estadio Pachencho Romero es el principal escenario del fútbol zuliano. Ha recibido partidos de la selección de Venezuela y eventos deportivos de gran convocatoria.",
    "Sector norte de Maracaibo",
    10.6789,
    -71.6585,
    ["estadio", "fútbol", "deporte", "eventos", "familia"]
  ),
  place(
    "estadio-luis-aparicio",
    "Estadio Luis Aparicio «El Grande»",
    "deportes",
    "Casa del béisbol zuliano y uno de los escenarios deportivos más queridos.",
    "El estadio Luis Aparicio es la casa de las Águilas del Zulia y una parada obligatoria para quienes siguen el béisbol venezolano.",
    "Maracaibo, Zulia",
    10.6707,
    -71.6182,
    ["estadio", "béisbol", "deporte", "zulia", "ágilas"]
  ),
  place(
    "estadio-alejandro-borges",
    "Estadio Alejandro Borges",
    "deportes",
    "Escenario histórico del deporte maracaibero, hoy parte de la memoria de la ciudad.",
    "El estadio Alejandro Borges conserva valor histórico para el deporte de Maracaibo. Es un punto de referencia para entender la tradición deportiva de la ciudad.",
    "Centro de Maracaibo",
    10.6649,
    -71.6176,
    ["estadio", "deporte", "historia", "centro", "memoria"]
  ),

  // ===== Noche =====
  place(
    "calle-72-bella-vista",
    "Calle 72 y Bella Vista",
    "noche",
    "La zona de restaurantes, terrazas y vida nocturna más conocida de la ciudad.",
    "La Calle 72 y el sector Bella Vista concentran restaurantes, terrazas y propuestas para salir de noche. Es una zona animada para cenar y compartir sin alejarse del centro.",
    "Bella Vista, Maracaibo",
    10.6784,
    -71.6126,
    ["restaurantes", "noche", "terrazas", "bella vista", "cena"]
  ),
  place(
    "zona-rosa-bella-vista",
    "Zona Rosa de Bella Vista",
    "noche",
    "Restaurantes, música y terrazas para cerrar el día con sabor maracaibero.",
    "La Zona Rosa de Bella Vista reúne propuestas gastronómicas y de entretenimiento para la noche. Ideal para una cena tranquila o una salida con amigos.",
    "Bella Vista, Maracaibo",
    10.679,
    -71.6145,
    ["noche", "restaurantes", "música", "bella vista", "amigos"]
  ),
  place(
    "ruta-dulces-santa-lucia",
    "Ruta de los dulces de Santa Lucía",
    "noche",
    "Un recorrido dulce por las casas y tradiciones del barrio Santa Lucía.",
    "La ruta de los dulces de Santa Lucía es una experiencia de barrio para probar postres tradicionales y conocer a las familias que mantienen las recetas. Suele disfrutarse mejor al caer la tarde.",
    "Barrio Santa Lucía, Maracaibo",
    10.6558,
    -71.6193,
    ["dulces", "gastronomía", "barrio", "tradición", "tarde"]
  ),

  // ===== Transporte =====
  place(
    "aeropuerto-la-chinita",
    "Aeropuerto Internacional La Chinita",
    "transporte",
    "La puerta aérea de Maracaibo, nombrada en honor a la Virgen de Chiquinquirá.",
    "El Aeropuerto Internacional La Chinita conecta a Maracaibo con el resto del país y con destinos internacionales. Conviene confirmar vuelos y transporte terrestre antes de salir.",
    "Avenida La Chinita, Maracaibo",
    10.5583,
    -71.7279,
    ["aeropuerto", "vuelos", "transporte", "la chinita", "llegada"]
  ),
  place(
    "terminal-pasajeros-maracaibo",
    "Terminal de Pasajeros de Maracaibo",
    "transporte",
    "Punto de salida y llegada de rutas interurbanas del occidente del país.",
    "La terminal de pasajeros de Maracaibo concentra rutas hacia distintos destinos del Zulia y del occidente venezolano. Llega con tiempo y confirma horarios con la línea que vayas a usar.",
    "Maracaibo, Zulia",
    10.6661,
    -71.6405,
    ["terminal", "autobuses", "transporte", "viajes", "rutas"]
  ),
  place(
    "puente-rafael-urdaneta",
    "Puente General Rafael Urdaneta",
    "transporte",
    "El gran puente sobre el Lago de Maracaibo, una obra que cambió la conexión del Zulia.",
    "Inaugurado en 1962, el Puente General Rafael Urdaneta es una de las obras de ingeniería más importantes de Venezuela. Une Maracaibo con la costa oriental del lago y se ha convertido en símbolo de la ciudad.",
    "Sobre el Lago de Maracaibo, al sur de la ciudad",
    10.5767,
    -71.5835,
    ["puente", "lago", "obra", "panorámica", "ingeniería"]
  ),
];

/**
 * Categorías de cada lugar. El primer elemento es la categoría principal que
 * se muestra en tarjetas y fichas. Se mantienen tres lugares por tema, salvo
 * salud, que suma los cuatro centros confirmados por el equipo.
 */
export const PLACE_GROUPS: Record<string, readonly CategorySlug[]> = {
  // API
  "basilica-chiquinquira": ["fe"],
  "teatro-baralt": ["cultura", "arquitectura"],
  "plaza-bolivar": ["historia"],
  "calle-carabobo": ["historia"],
  "santa-lucia": ["cultura"],
  "paseo-del-lago": ["lago"],

  // Plazas
  "plaza-baralt": ["plazas"],
  "plaza-republica": ["plazas"],
  "plaza-monumento-chinita": ["plazas"],

  // Historia y arquitectura
  "palacio-gobierno-zulia": ["historia", "arquitectura"],
  "casa-capitulacion": ["museos", "arquitectura"],

  // Cultura
  "biblioteca-publica-zulia": ["cultura"],

  // Fe
  "catedral-maracaibo": ["fe"],
  "iglesia-san-francisco": ["fe"],

  // Museos
  "centro-arte-lia-bermudez": ["museos"],
  maczul: ["museos"],

  // Naturaleza
  "parque-urdaneta": ["naturaleza"],
  "jardin-botanico-maracaibo": ["naturaleza"],
  "parque-universitario-luz": ["naturaleza"],

  // Lago
  "vereda-del-lago": ["lago"],
  "malecon-maracaibo": ["lago"],

  // Gastronomía
  "sabor-zuliano": ["gastronomia"],
  "rincon-zuliano": ["gastronomia"],
  "mi-vaquita": ["gastronomia"],

  // Compras
  "galerias-mall": ["compras"],
  "sambil-maracaibo": ["compras"],
  "doral-center": ["compras"],

  // Salud
  "hospital-universitario-maracaibo": ["salud"],
  "hospital-central-maracaibo": ["salud"],
  "hospital-clinico-maracaibo": ["salud"],
  "clinica-paraiso": ["salud"],

  // Educación
  "universidad-del-zulia": ["educacion"],
  unica: ["educacion"],
  urbe: ["educacion"],

  // Deportes
  "estadio-pachencho-romero": ["deportes"],
  "estadio-luis-aparicio": ["deportes"],
  "estadio-alejandro-borges": ["deportes"],

  // Noche
  "calle-72-bella-vista": ["noche"],
  "zona-rosa-bella-vista": ["noche"],
  "ruta-dulces-santa-lucia": ["noche"],

  // Transporte
  "aeropuerto-la-chinita": ["transporte"],
  "terminal-pasajeros-maracaibo": ["transporte"],
  "puente-rafael-urdaneta": ["transporte"],
};

/** Los lugares extra son contenido curado de la fachada. */
export const EXTRA_SLUGS = new Set(EXTRA_PLACES.map((p) => p.slug));
