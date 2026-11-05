import { categoryBySlug, type CategorySlug } from "./categories";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";

/* ============================================================
   Perfiles editoriales por lugar
   ------------------------------------------------------------
   Cada ficha tiene su propia paleta pastel, emblema y datos
   útiles. El objetivo es que la Basílica no se sienta igual que
   un estadio o una arepera: cada rincón de Maracaibo tiene su
   carácter y aquí lo contamos.
   ============================================================ */

export type PlaceEmblemName =
  | "chinita"
  | "church"
  | "bridge"
  | "sun"
  | "waves"
  | "landmark"
  | "theater"
  | "palette"
  | "museum"
  | "bank"
  | "leaf"
  | "utensils"
  | "bag"
  | "cross"
  | "cap"
  | "ball"
  | "moon"
  | "bus"
  | "tower"
  | "coffee"
  | "cake"
  | "plane"
  | "music"
  | "camera"
  | "key"
  | "star"
  | "shield"
  | "boat"
  | "book";

export interface PlaceColors {
  /** Inicio del degradado pastel. */
  from: string;
  /** Final del degradado pastel. */
  to: string;
  /** Color de acento para títulos, iconos y detalles. */
  accent: string;
  /** Fondo suave para bloques y tarjetas. */
  soft: string;
  /** Tinta oscura que combine con la paleta. */
  ink: string;
}

export interface PlaceSuggestion {
  title: string;
  text: string;
}

export interface PlaceProfile {
  slug: string;
  emblem: PlaceEmblemName;
  colors: PlaceColors;
  /** Frase poética que resume el alma del lugar. */
  essence: string;
  /** Mejor momento del día o del año para ir. */
  bestTime: string;
  /** Cuánto tiempo dedicarle. */
  duration: string;
  /** Presupuesto orientativo. */
  budget: string;
  /** Con quién o para qué tipo de plan queda mejor. */
  idealFor: string;
  /** Segunda parte de la historia, para completar la ficha. */
  history: string;
  /** Lo que no deberías perderte. */
  highlights: string[];
  /** Consejos concretos de Zulmita. */
  suggestions: PlaceSuggestion[];
  /** Planes o lugares que combinan cerca. */
  nearby: string[];
  /** Comida o bebida cercana recomendada. */
  food: string;
  /** Un dato que sorprende y se comparte. */
  funFact: string;
  /** Cómo completar el paseo. */
  plan: string;
}

type Seed = Omit<PlaceProfile, "slug" | "suggestions"> & {
  suggestions: readonly (readonly [string, string])[];
};

/* Paletas pastel dentro de la familia celeste, blanco, amarillo y rojo. */
const SKY: PlaceColors = {
  from: "#C9ECFB",
  to: "#8FD4F3",
  accent: "#2E8FC4",
  soft: "#EFF9FE",
  ink: "#123A50",
};

const SUN: PlaceColors = {
  from: "#FFF1BF",
  to: "#FFD873",
  accent: "#D99A1B",
  soft: "#FFFAE4",
  ink: "#4B3808",
};

const CORAL: PlaceColors = {
  from: "#FFDCD5",
  to: "#FFA99C",
  accent: "#DE5A48",
  soft: "#FFF0ED",
  ink: "#4D1C16",
};

const ROSE: PlaceColors = {
  from: "#FFE2E8",
  to: "#FFB5C3",
  accent: "#D6536E",
  soft: "#FFF1F4",
  ink: "#4B1725",
};

const CREAM: PlaceColors = {
  from: "#FFF9EB",
  to: "#FFE8B6",
  accent: "#C98D22",
  soft: "#FFFCF3",
  ink: "#4A3510",
};

const MINT: PlaceColors = {
  from: "#E4F7EE",
  to: "#B7E8D4",
  accent: "#2F9573",
  soft: "#F1FBF7",
  ink: "#104233",
};

const LAVENDER: PlaceColors = {
  from: "#EAE6FE",
  to: "#CFC7F7",
  accent: "#6C5BC4",
  soft: "#F5F3FF",
  ink: "#2A2452",
};

const PEACH: PlaceColors = {
  from: "#FFEADB",
  to: "#FFC9A8",
  accent: "#D9772E",
  soft: "#FFF5EC",
  ink: "#4A2A12",
};

const GRAPE: PlaceColors = {
  from: "#F3E6FB",
  to: "#DFC4F2",
  accent: "#9A4DBB",
  soft: "#FAF3FE",
  ink: "#3E1B4D",
};

const DEEP: PlaceColors = {
  from: "#DDEFF6",
  to: "#AFD7E6",
  accent: "#246B88",
  soft: "#EEF8FB",
  ink: "#0F3545",
};

const RAW: Record<string, Seed> = {
  /* ===== Los seis lugares base ===== */
  "basilica-chiquinquira": {
    emblem: "chinita",
    colors: ROSE,
    essence: "El corazón rosa del Zulia",
    bestTime: "Mañanas tranquilas; noviembre es pura fiesta",
    duration: "45 – 60 min",
    budget: "Entrada gratuita",
    idealFor: "Fe, historia y fotos",
    history:
      "La devoción por la Virgen de Chiquinquirá nació junto al lago y creció hasta volverse el símbolo espiritual del estado. Cada 18 de noviembre la ciudad entera se organiza alrededor de la Basílica: hay misas, música, ferias y una marea de gente vestida de colores. El templo actual guarda esa memoria colectiva en sus vitrales, sus altares y en la plaza que lo abraza.",
    highlights: [
      "El altar mayor y el manto de la Virgen",
      "Los vitrales que cuentan la historia de la devoción",
      "La plaza y su movimiento de peregrinos",
      "La misa dominical y el ambiente de feria en noviembre",
    ],
    suggestions: [
      ["Viste con respeto", "Hombros y rodillas cubiertos si vas a entrar al templo. Es un espacio de fe antes que un atractivo turístico."],
      ["Ve temprano", "Entre 8 y 10 de la mañana hay menos gente, la luz entra bonita y puedes caminar la plaza sin prisa."],
      ["Prueba la feria", "Si vienes en noviembre, camina los alrededores: hay comida, artesanía y música zuliana por todas partes."],
    ],
    nearby: ["Calle Carabobo", "Plaza Baralt", "Santa Lucía"],
    food: "Un patacón con queso y un jugo natural en los alrededores de la Basílica.",
    funFact:
      "La imagen de la Chinita se encontró en la orilla del lago en 1749. Desde entonces, su fiesta es una de las celebraciones religiosas más grandes de Venezuela.",
    plan: "Combínala con Calle Carabobo y la Plaza Baralt para un recorrido de fe, historia y centro.",
  },
  "calle-carabobo": {
    emblem: "camera",
    colors: SUN,
    essence: "La calle que camina la historia",
    bestTime: "Temprano en la mañana o al caer la tarde",
    duration: "1 – 2 h",
    budget: "Gratis, con compras opcionales",
    idealFor: "Caminar, fotografiar y comprar",
    history:
      "La Calle Carabobo fue durante décadas el escenario del comercio y la vida social maracuchas. Sus casas de techos altos, balcones y patios interiores cuentan una ciudad que creció alrededor del puerto y del mercado. Hoy convive lo antiguo con lo nuevo: tiendas, cafés y fachadas restauradas que siguen invitando a caminar sin apuro.",
    highlights: [
      "Fachadas patrimoniales y balcones de colores",
      "El bullicio del comercio tradicional",
      "Cafés y panaderías de esquina",
      "Murales y rincones para fotografiar",
    ],
    suggestions: [
      ["Calza cómodo", "Es una caminata larga y el sol pega fuerte. Zapatillas, gorra y agua son tus mejores aliados."],
      ["Mira hacia arriba", "Los balcones y cornisas son la parte más fotogénica de la calle y pasan desapercibidos."],
      ["Pregunta antes de entrar", "No todos los comercios permiten fotos. Un saludo y una sonrisa abren más puertas que una cámara."],
    ],
    nearby: ["Plaza Baralt", "Teatro Baralt", "Casa de la Capitulación"],
    food: "Un café maracucho y un pastelito de queso en una panadería del centro.",
    funFact:
      "Su trazado forma parte del casco histórico fundacional y sigue siendo una de las calles más transitadas del centro.",
    plan: "Hazla a pie desde la Plaza Baralt hasta la Basílica y cierra con un café en el centro.",
  },
  "paseo-del-lago": {
    emblem: "waves",
    colors: DEEP,
    essence: "Donde la ciudad mira al lago",
    bestTime: "Atardecer, cuando baja la brisa",
    duration: "1 – 2 h",
    budget: "Gratis",
    idealFor: "Parejas, familias y caminatas",
    history:
      "El Paseo del Lago nació como una costura entre la ciudad y el agua. Durante años ha sido el lugar donde los maracuchos van a respirar, a hacer ejercicio y a mirar el horizonte. Su malecón, sus áreas verdes y sus vistas al Puente General Rafael Urdaneta lo convirtieron en una postal inevitable del atardecer zuliano.",
    highlights: [
      "El atardecer sobre el lago",
      "La silueta del puente a lo lejos",
      "El malecón para caminar o trotar",
      "Las áreas verdes para sentarse con calma",
    ],
    suggestions: [
      ["Llega antes del sol", "Calcula estar 30 minutos antes del atardecer para conseguir buen puesto y ver cómo cambia la luz."],
      ["Lleva repelente", "Al caer la tarde aparecen mosquitos cerca del agua. Un toque de repelente salva el plan."],
      ["Camina con compañía", "De noche temprano es más agradable y seguro caminar la zona acompañado y por las áreas iluminadas."],
    ],
    nearby: ["Vereda del Lago", "Malecón de Maracaibo", "Mi Vaquita"],
    food: "Un helado o una malta bien fría mientras cae el sol.",
    funFact:
      "El Lago de Maracaibo es el más grande de Sudamérica. Desde el paseo se entiende por qué la ciudad vive de cara al agua.",
    plan: "Termina aquí una tarde de centro histórico y remata con cena en Bella Vista.",
  },
  "plaza-bolivar": {
    emblem: "landmark",
    colors: SUN,
    essence: "El patio abierto del centro",
    bestTime: "Mañana o final de la tarde",
    duration: "20 – 40 min",
    budget: "Gratis",
    idealFor: "Pausas, fotos y vida de plaza",
    history:
      "La Plaza Bolívar es una de las plazas tradicionales del centro maracucho. Alrededor crecieron edificios públicos, comercios y cafés que convirtieron el lugar en un punto de encuentro obligado. Su estatua y sus árboles han sido testigos de discursos, conciertos y tardes de conversación.",
    highlights: [
      "La estatua del Libertador y su entorno",
      "La sombra de los árboles para descansar",
      "El ir y venir del centro",
      "Las fachadas que rodean la plaza",
    ],
    suggestions: [
      ["Úsala como pausa", "Es perfecta para sentarse 15 minutos entre una visita y otra. Lleva agua y disfruta la sombra."],
      ["Fotografía al atardecer", "La luz cálida sobre las fachadas le da un tono dorado muy bonito."],
      ["Cuida tus pertenencias", "Como en cualquier centro urbano concurrido, mantén el bolso cerca y evita distracciones."],
    ],
    nearby: ["Calle Carabobo", "Teatro Baralt", "Catedral de Maracaibo"],
    food: "Una raspado o un jugo natural de un kiosco cercano.",
    funFact:
      "Muchas de las plazas del centro conservan el trazado colonial y siguen funcionando como el living de la ciudad.",
    plan: "Visítala entre la Catedral y el Teatro Baralt, sin apuro.",
  },
  "santa-lucia": {
    emblem: "cake",
    colors: CORAL,
    essence: "El barrio que endulza a Maracaibo",
    bestTime: "Al caer la tarde, cuando abren los dulces",
    duration: "1 – 2 h",
    budget: "Desde $3 en adelante",
    idealFor: "Gastronomía, historia y compras dulces",
    history:
      "Santa Lucía es uno de los barrios con más alma de Maracaibo. Su iglesia, sus casas de colores y sus cocinas mantienen viva una tradición dulcera que pasa de generación en generación. Recorrerlo es entrar en una conversación entre vecinos, recetas antiguas y el olor de la panela.",
    highlights: [
      "La iglesia de Santa Lucía y su torre azul",
      "Las casas de dulces tradicionales",
      "Los callejones y fachadas de colores",
      "El ambiente de barrio al atardecer",
    ],
    suggestions: [
      ["Pregunta qué hay fresco", "Los dulces se hacen por tandas. Pregunta qué salió hoy y pide una muestra antes de llevar."],
      ["Lleva efectivo", "Muchos puestos pequeños no tienen punto de venta. Un billete pequeño siempre ayuda."],
      ["Déjate guiar", "Los vecinos son la mejor guía: te cuentan la historia de cada receta y te señalan la casa siguiente."],
    ],
    nearby: ["Calle Carabobo", "Basílica de la Chinita", "Ruta de los dulces"],
    food: "Dulce de lechosa, conserva de coco y un cafecito de olla.",
    funFact:
      "La tradición dulcera de Santa Lucía es tan querida que existe una ruta turística dedicada solo a probar sus postres.",
    plan: "Haz la ruta de dulces al atardecer y termina con una visita corta a la iglesia.",
  },
  "teatro-baralt": {
    emblem: "theater",
    colors: LAVENDER,
    essence: "Un siglo de aplausos en el centro",
    bestTime: "Cuando hay función o ensayo abierto",
    duration: "40 – 90 min",
    budget: "Variable según la función",
    idealFor: "Cultura, arquitectura y música",
    history:
      "El Teatro Baralt es uno de los escenarios más antiguos y queridos de Venezuela. Ha visto pasar ópera, teatro, cine y música, y su fachada neoclásica sigue siendo una de las más elegantes del casco histórico. Su sala principal conserva esa mezcla de solemnidad y calidez que solo tienen los teatros con memoria.",
    highlights: [
      "La fachada y el vestíbulo histórico",
      "La sala principal y su acústica",
      "La programación cultural de la ciudad",
      "La plaza Baralt justo enfrente",
    ],
    suggestions: [
      ["Revisa la cartelera", "Las funciones no son todos los días. Consulta antes de ir para no encontrar la sala cerrada."],
      ["Llega con tiempo", "El edificio merece una vuelta por el vestíbulo y las escaleras antes de entrar a la sala."],
      ["Pregunta por visitas", "Si no hay función, pregunta en la taquilla si hay recorridos guiados disponibles."],
    ],
    nearby: ["Plaza Baralt", "Calle Carabobo", "Casa de la Capitulación"],
    food: "Un café después de la función en los alrededores de la plaza.",
    funFact:
      "Su historia se remonta al siglo XIX y por su escenario han pasado artistas nacionales e internacionales.",
    plan: "Combina una función con una caminata nocturna por la Plaza Baralt.",
  },

  /* ===== Plazas ===== */
  "plaza-baralt": {
    emblem: "landmark",
    colors: SUN,
    essence: "La antesala de sombra del teatro",
    bestTime: "Tarde, cuando baja el sol",
    duration: "20 – 40 min",
    budget: "Gratis",
    idealFor: "Café, conversación y fotos",
    history:
      "La Plaza Baralt ha sido punto de encuentro desde el siglo XIX. Frente al teatro, sus bancos y árboles han acompañado conversaciones políticas, tardes de café y el movimiento diario del centro. Es una plaza recoleta, de escala humana, que invita a sentarse más que a atravesar.",
    highlights: [
      "La fachada del Teatro Baralt",
      "Los bancos bajo los árboles",
      "El café y la gente del centro",
      "La arquitectura patrimonial alrededor",
    ],
    suggestions: [
      ["Siéntate un rato", "La plaza está hecha para quedarse. Pide un café y observa el movimiento del centro."],
      ["Mira la fachada", "El Teatro Baralt se ve mejor desde el lado opuesto de la plaza, sobre todo con luz de tarde."],
      ["Ven de noche", "Cuando hay funciones, la plaza se llena de gente y el ambiente es más animado."],
    ],
    nearby: ["Teatro Baralt", "Calle Carabobo", "Casa de la Capitulación"],
    food: "Un café de esquina o un jugo natural.",
    funFact:
      "Su nombre honra a Rafael María Baralt, escritor y diplomático zuliano, y es una de las plazas más fotografiadas del centro.",
    plan: "Hazla parte de tu ruta de centro: teatro, café y calle Carabobo.",
  },
  "plaza-republica": {
    emblem: "leaf",
    colors: MINT,
    essence: "Una pausa verde en el centro",
    bestTime: "Mañana o media tarde",
    duration: "15 – 30 min",
    budget: "Gratis",
    idealFor: "Descanso y caminatas cortas",
    history:
      "La Plaza de la República es uno de esos espacios que parecen detener el tiempo dentro de la ciudad. Sus árboles añosos dan sombra generosa y sus bancos son refugio de oficinistas, estudiantes y vecinos. No es la plaza más famosa, y justamente por eso conserva un ritmo tranquilo.",
    highlights: [
      "Los árboles y la sombra",
      "Los bancos para descansar",
      "El entorno de edificios tradicionales",
      "El ritmo cotidiano del centro",
    ],
    suggestions: [
      ["Haz una pausa corta", "No necesitas más de 20 minutos. Es perfecta para bajar el ritmo entre dos visitas."],
      ["Lleva agua", "Las fuentes cercanas no siempre están activas. Carga tu botella antes de llegar."],
      ["Observa el entorno", "Las fachadas que la rodean cuentan la historia de una ciudad que creció por capas."],
    ],
    nearby: ["Catedral de Maracaibo", "Palacio de Gobierno", "Calle Carabobo"],
    food: "Un jugo natural o una fruta de un puesto cercano.",
    funFact:
      "Las plazas del centro funcionan como pequeños pulmones urbanos: bajan la temperatura y dan sombra en los días más calurosos.",
    plan: "Úsala como descanso entre la Catedral y el Palacio de Gobierno.",
  },
  "plaza-monumento-chinita": {
    emblem: "chinita",
    colors: ROSE,
    essence: "La postal que recibe a la ciudad",
    bestTime: "Atardecer y noche, cuando se ilumina",
    duration: "20 – 30 min",
    budget: "Gratis",
    idealFor: "Fotos, fe y llegadas a la ciudad",
    history:
      "El monumento a la Chinita se pensó como una bienvenida para quienes llegan a Maracaibo. Su silueta moderna se ha convertido en referencia urbana y en punto de encuentro para familias y peregrinos. En noviembre, la plaza se suma a la fiesta con actividades y visitas.",
    highlights: [
      "La silueta monumental de la Virgen",
      "La plaza abierta para fotos",
      "La iluminación nocturna",
      "El ambiente familiar",
    ],
    suggestions: [
      ["Ve al atardecer", "La luz baja y la iluminación artificial se encuentran; es el mejor momento para fotos."],
      ["Aparca con calma", "Es una zona de mucho tráfico. Busca estacionamiento legal y camina el resto."],
      ["Combínala con la Basílica", "Ver las dos te da una lectura completa de la devoción mariana en la ciudad."],
    ],
    nearby: ["Basílica de la Chinita", "Vereda del Lago", "Bella Vista"],
    food: "Un helado o una merienda en Bella Vista.",
    funFact:
      "Es uno de los puntos de referencia más reconocibles para quien entra a Maracaibo por la autopista.",
    plan: "Hazla en tu llegada a la ciudad y cierra con el atardecer en el lago.",
  },

  /* ===== Historia y patrimonio ===== */
  "palacio-gobierno-zulia": {
    emblem: "bank",
    colors: CREAM,
    essence: "La casa del poder zuliano",
    bestTime: "Días hábiles, en la mañana",
    duration: "20 – 40 min",
    budget: "Gratis desde el exterior",
    idealFor: "Arquitectura y fotos",
    history:
      "El Palacio de Gobierno del Zulia forma parte del conjunto patrimonial del centro. Su arquitectura republicana y su escala lo vuelven una pieza clave del paisaje urbano. Aunque su función es administrativa, su fachada y su entorno cuentan mucho de la historia política del estado.",
    highlights: [
      "La fachada y sus detalles republicanos",
      "El entorno patrimonial del centro",
      "La escala del edificio frente a la calle",
      "La arquitectura de los edificios vecinos",
    ],
    suggestions: [
      ["Fotografía desde la calle", "El acceso suele estar restringido a gestiones. La fachada se disfruta mejor desde la acera opuesta."],
      ["Ve en día hábil", "La zona tiene más movimiento y servicios abiertos de lunes a viernes."],
      ["Respeta el acceso", "Si hay actividad oficial, no insistas en entrar. La vista exterior ya vale la pena."],
    ],
    nearby: ["Catedral de Maracaibo", "Plaza Bolívar", "Calle Carabobo"],
    food: "Un café en el centro antes o después de la visita.",
    funFact:
      "El centro de Maracaibo conserva varios edificios públicos de valor patrimonial que se pueden recorrer a pie.",
    plan: "Inclúyelo en una caminata de arquitectura por el centro histórico.",
  },
  "biblioteca-publica-zulia": {
    emblem: "book",
    colors: SKY,
    essence: "Un refugio de papel y silencio",
    bestTime: "Mañana o primera tarde",
    duration: "30 – 60 min",
    budget: "Gratis",
    idealFor: "Lectura, estudio y calma",
    history:
      "La red de bibliotecas públicas del Zulia conserva parte de la memoria documental de la región. Sus salas son refugio para estudiantes, investigadores y lectores que buscan un espacio fresco y tranquilo en medio del calor. Muchas guardan colecciones locales que no se encuentran en librerías.",
    highlights: [
      "Las salas de lectura",
      "La colección zuliana",
      "El silencio y la frescura del espacio",
      "Las actividades culturales programadas",
    ],
    suggestions: [
      ["Pregunta por la colección local", "Ahí están los libros que cuentan la historia del Zulia y que no siempre están a la venta."],
      ["Lleva tu carnet", "Si vas a estudiar, pregunta por los requisitos para usar las salas y el wifi."],
      ["Ve con tiempo", "Es un plan tranquilo: elige una hora sin prisa y déjate acompañar por un buen libro."],
    ],
    nearby: ["Plaza Bolívar", "Catedral de Maracaibo", "Teatro Baralt"],
    food: "Un café o una merienda antes de entrar; dentro suele no estar permitido comer.",
    funFact:
      "Las bibliotecas públicas son también archivos vivos: muchas conservan periódicos y documentos que no están digitalizados.",
    plan: "Combínala con una visita al centro histórico y una tarde de café.",
  },

  /* ===== Fe ===== */
  "catedral-maracaibo": {
    emblem: "church",
    colors: CREAM,
    essence: "La campana antigua del centro",
    bestTime: "Mañana, antes del calor",
    duration: "20 – 40 min",
    budget: "Gratis",
    idealFor: "Fe, historia y arquitectura",
    history:
      "La Catedral de Maracaibo integra el conjunto patrimonial del centro desde la época colonial. Su presencia acompaña la vida religiosa de la ciudad y ha sido testigo de ceremonias, procesiones y cambios urbanos. Su interior, más sencillo que su fachada, invita a bajar la voz y mirar con calma.",
    highlights: [
      "La fachada histórica",
      "El interior y sus imágenes religiosas",
      "El entorno de plazas del centro",
      "Las campanas y la vida parroquial",
    ],
    suggestions: [
      ["Entra con respeto", "Es un templo activo. Evita flash y mantén silencio si hay celebración."],
      ["Ve de mañana", "La luz y el ambiente son más tranquilos; además evitas el calor fuerte del mediodía."],
      ["Combínala con la plaza", "Siéntate un momento en los alrededores y observa la vida del centro."],
    ],
    nearby: ["Plaza Bolívar", "Palacio de Gobierno", "Calle Carabobo"],
    food: "Un café y un pan dulce en una panadería del centro.",
    funFact:
      "La catedral es uno de los edificios religiosos más antiguos de la ciudad y parte del recorrido patrimonial del casco histórico.",
    plan: "Haz un recorrido de templos y plazas del centro en una sola mañana.",
  },
  "iglesia-san-francisco": {
    emblem: "church",
    colors: PEACH,
    essence: "La parroquia de todos los días",
    bestTime: "Mañana o tarde de misa",
    duration: "20 – 30 min",
    budget: "Gratis",
    idealFor: "Fe y vida de barrio",
    history:
      "La Iglesia San Francisco es parte de la vida cotidiana del centro. Su comunidad mantiene una agenda de misas y actividades que la convierten en un punto de encuentro más allá de la liturgia. Es una iglesia de escala humana, donde los vecinos se saludan por su nombre.",
    highlights: [
      "La fachada y el interior sencillo",
      "La comunidad parroquial",
      "La agenda de misas y actividades",
      "El entorno de calles tradicionales",
    ],
    suggestions: [
      ["Consulta horarios", "Las misas cambian según el día. Una llamada o una visita previa evita malos ratos."],
      ["Ve con calma", "Es un lugar de oración. Entra sin prisa y respeta las actividades de la comunidad."],
      ["Conversa con los vecinos", "La historia del barrio se cuenta mejor en la puerta que en un libro."],
    ],
    nearby: ["Calle Carabobo", "Plaza Baralt", "Catedral de Maracaibo"],
    food: "Un jugo natural en el mercado cercano.",
    funFact:
      "Las iglesias del centro siguen siendo espacios de encuentro social, no solo religioso.",
    plan: "Inclúyela en una caminata tranquila por las calles del centro.",
  },

  /* ===== Museos ===== */
  "centro-arte-lia-bermudez": {
    emblem: "palette",
    colors: LAVENDER,
    essence: "El mercado que se volvió arte",
    bestTime: "Mañana o primera tarde",
    duration: "1 – 2 h",
    budget: "Entrada gratuita o aporte voluntario",
    idealFor: "Arte, familia y exposiciones",
    history:
      "El CAMLB ocupa un edificio patrimonial que antes fue mercado y hoy es uno de los espacios culturales más activos de la ciudad. Su arquitectura de arcos y patios se mezcla con exposiciones de artes visuales, conciertos y talleres. Es un lugar donde el pasado comercial del edificio sigue presente en la forma.",
    highlights: [
      "Las exposiciones temporales",
      "La arquitectura de arcos y patios",
      "Las actividades para niños y familias",
      "La tienda de arte y diseño local",
    ],
    suggestions: [
      ["Revisa la agenda", "Las exposiciones cambian. Consulta qué hay antes de ir para elegir el día con más actividad."],
      ["Ve con niños", "Los talleres y espacios abiertos funcionan muy bien para familias."],
      ["Recorre el edificio", "No te quedes solo en la sala principal: los pasillos y patios también son parte de la obra."],
    ],
    nearby: ["Calle Carabobo", "Plaza Baralt", "Teatro Baralt"],
    food: "Un café en el centro cultural o en los alrededores de la plaza.",
    funFact:
      "Su nombre honra a Lía Bermúdez, una de las artistas plásticas más importantes del Zulia.",
    plan: "Combínalo con el Teatro Baralt y una caminata por el casco histórico.",
  },
  maczul: {
    emblem: "museum",
    colors: SKY,
    essence: "El arte contemporáneo del Zulia",
    bestTime: "Mañana o tarde de semana",
    duration: "1 – 2 h",
    budget: "Entrada gratuita o aporte",
    idealFor: "Arte, diseño y fotografía",
    history:
      "El MACZUL es un museo universitario de arte contemporáneo. Su colección y sus salas acercan al público al trabajo de artistas venezolanos y latinoamericanos, con una programación que dialoga con el presente. Es un plan perfecto para quienes quieren ver lo que se está creando, no solo lo que ya pasó.",
    highlights: [
      "La colección permanente",
      "Las exposiciones temporales",
      "El edificio y su entorno universitario",
      "Las actividades y conversatorios",
    ],
    suggestions: [
      ["Pregunta por las visitas guiadas", "Los mediadores suelen explicar las obras y el contexto; la experiencia cambia por completo."],
      ["Ve sin prisa", "El arte contemporáneo pide tiempo. Calcula al menos una hora para recorrer con calma."],
      ["Fotografía sin flash", "Respeta las indicaciones de cada sala; algunas obras no se pueden fotografiar."],
    ],
    nearby: ["Universidad del Zulia", "Parque Universitario", "Galerías Mall"],
    food: "Un café o un almuerzo ligero en la zona universitaria.",
    funFact:
      "El MACZUL forma parte del circuito universitario de arte más importante de la región.",
    plan: "Hazlo junto a la Ciudad Universitaria y el Parque Universitario.",
  },
  "casa-capitulacion": {
    emblem: "key",
    colors: CREAM,
    essence: "Una casona que firmó historia",
    bestTime: "Mañana o tarde temprana",
    duration: "30 – 60 min",
    budget: "Entrada gratuita o simbólica",
    idealFor: "Historia, arquitectura y museo",
    history:
      "En esta casona colonial se reunieron autoridades y se firmaron documentos clave de la historia zuliana. Hoy funciona como museo y permite asomarse a la Maracaibo de siglos pasados: patios, habitaciones, muebles y objetos que reconstruyen la vida de la época. Es una visita breve pero reveladora.",
    highlights: [
      "El patio colonial",
      "Las salas y objetos de época",
      "La arquitectura original",
      "Las exposiciones temporales",
    ],
    suggestions: [
      ["Pregunta por la historia", "El personal conoce detalles que no aparecen en los carteles. Pregunta y deja que te cuenten."],
      ["Ve de día", "La casa se disfruta mejor con luz natural y con tiempo para recorrer las salas."],
      ["Combínala con la plaza", "Está en pleno centro: úsala como parada entre una plaza y un café."],
    ],
    nearby: ["Plaza Baralt", "Teatro Baralt", "Calle Carabobo"],
    food: "Un café en los alrededores del centro histórico.",
    funFact:
      "El edificio conserva elementos originales de la arquitectura colonial zuliana, como patios interiores y techos altos.",
    plan: "Únela a una ruta de patrimonio por el casco histórico.",
  },

  /* ===== Naturaleza ===== */
  "parque-urdaneta": {
    emblem: "leaf",
    colors: MINT,
    essence: "Sombra tradicional del centro",
    bestTime: "Mañana o atardecer",
    duration: "30 – 60 min",
    budget: "Gratis",
    idealFor: "Caminar, descansar y leer",
    history:
      "El Parque Urdaneta es un pulmón tradicional del centro de Maracaibo. Sus caminerías y árboles ofrecen una pausa verde en medio del recorrido urbano. Ha sido escenario de conversaciones, juegos y siestas de generaciones de maracuchos.",
    highlights: [
      "Los árboles centenarios",
      "Las caminerías sombreadas",
      "El ambiente de barrio",
      "La conexión con el centro histórico",
    ],
    suggestions: [
      ["Lleva un libro", "Es uno de los mejores lugares del centro para sentarse a leer bajo la sombra."],
      ["Ve con agua", "Aunque hay sombra, el calor maracucho se siente. Carga tu botella."],
      ["Camina por los bordes", "Las calles que lo rodean tienen comercios y cafés que valen la pena."],
    ],
    nearby: ["Catedral de Maracaibo", "Calle Carabobo", "Plaza Baralt"],
    food: "Una fruta fresca o un jugo de un puesto cercano.",
    funFact:
      "Los parques del centro son refugios térmicos: la sombra de los árboles puede bajar varios grados la temperatura.",
    plan: "Haz una pausa verde entre dos visitas del centro histórico.",
  },
  "jardin-botanico-maracaibo": {
    emblem: "leaf",
    colors: MINT,
    essence: "El pulmón verde de la ciudad",
    bestTime: "Mañana temprano, cuando cantan las aves",
    duration: "1 – 2 h",
    budget: "Entrada gratuita o simbólica",
    idealFor: "Naturaleza, aves y caminatas",
    history:
      "El Jardín Botánico reúne vegetación representativa de la región y ofrece un espacio para caminar, observar aves y aprender sobre el entorno natural del Zulia. Es un lugar de investigación y conservación, pero también de paseo familiar y silencio.",
    highlights: [
      "La colección de plantas tropicales",
      "El avistamiento de aves",
      "Los senderos sombreados",
      "El silencio lejos del tráfico",
    ],
    suggestions: [
      ["Ve temprano", "Las aves están más activas al amanecer y el calor es menor."],
      ["Lleva binoculares", "Si te gusta observar aves, unos binoculares y una libreta hacen la diferencia."],
      ["Protege tu piel", "Repelente, gorra y protector solar son básicos en un espacio abierto."],
    ],
    nearby: ["Parque Universitario", "Universidad del Zulia", "Ciudad Universitaria"],
    food: "Lleva agua y una merienda ligera; los servicios dentro del jardín son limitados.",
    funFact:
      "Los jardines botánicos son también bancos de semillas y espacios de investigación sobre la flora local.",
    plan: "Combínalo con una visita a la Ciudad Universitaria.",
  },
  "parque-universitario-luz": {
    emblem: "leaf",
    colors: MINT,
    essence: "Verde y concreto universitario",
    bestTime: "Tarde, cuando baja el sol",
    duration: "30 – 60 min",
    budget: "Gratis",
    idealFor: "Deporte, caminata y arquitectura",
    history:
      "El Parque Universitario acompaña la vida de la Ciudad Universitaria. Es un espacio de recreación y deporte que también permite apreciar el patrimonio arquitectónico de la zona. Estudiantes, vecinos y deportistas comparten sus caminerías y canchas.",
    highlights: [
      "Las caminerías para trotar",
      "El entorno arquitectónico de LUZ",
      "El ambiente estudiantil",
      "Las áreas verdes para descansar",
    ],
    suggestions: [
      ["Ve a trotar", "Es uno de los espacios más usados para ejercicio en la zona. Lleva ropa cómoda y agua."],
      ["Mira la arquitectura", "La Ciudad Universitaria tiene edificios de valor patrimonial que se ven mejor caminando."],
      ["Evita las horas de sol", "Temprano o al atardecer son los mejores momentos para el deporte."],
    ],
    nearby: ["Universidad del Zulia", "Jardín Botánico", "MACZUL"],
    food: "Una merienda o un jugo en la zona universitaria.",
    funFact:
      "La Ciudad Universitaria de LUZ es uno de los conjuntos arquitectónicos más importantes del estado.",
    plan: "Haz ejercicio temprano y luego visita el Jardín Botánico.",
  },

  /* ===== Lago y malecón ===== */
  "vereda-del-lago": {
    emblem: "waves",
    colors: SKY,
    essence: "El atardecer favorito de la ciudad",
    bestTime: "Atardecer, sin discusión",
    duration: "1 – 2 h",
    budget: "Gratis",
    idealFor: "Parejas, familias y deporte",
    history:
      "La Vereda del Lago es uno de los espacios públicos más queridos de Maracaibo. Su malecón, sus áreas verdes y sus vistas al lago la vuelven una parada obligatoria para caminar, hacer deporte y ver caer el sol. Ha sido escenario de conciertos, ferias y tardes de familia.",
    highlights: [
      "El atardecer sobre el lago",
      "El malecón para caminar o trotar",
      "Las áreas verdes y juegos infantiles",
      "Las vistas al puente",
    ],
    suggestions: [
      ["Llega con tiempo", "30 minutos antes del atardecer es el momento ideal para caminar y buscar buen lugar."],
      ["Lleva repelente", "Al caer la tarde los mosquitos aparecen. Un poco de repelente evita incomodidades."],
      ["Haz picnic", "Lleva una manta y una merienda ligera; hay espacios para sentarse frente al agua."],
    ],
    nearby: ["Malecón de Maracaibo", "Paseo del Lago", "Mi Vaquita"],
    food: "Helados, maltas y comida de kioscos frente al lago.",
    funFact:
      "Desde la Vereda se ve el Puente General Rafael Urdaneta, una de las obras de ingeniería más importantes de Venezuela.",
    plan: "Termina aquí una tarde de ciudad y cena en Bella Vista.",
  },
  "malecon-maracaibo": {
    emblem: "boat",
    colors: SKY,
    essence: "La brisa que cuenta historias",
    bestTime: "Atardecer y noche temprana",
    duration: "30 – 60 min",
    budget: "Gratis",
    idealFor: "Caminatas y conversaciones",
    history:
      "El malecón junto al Lago de Maracaibo es un espacio tradicional para la caminata y la contemplación. La brisa y la luz del atardecer son parte de la experiencia. Durante décadas fue el lugar donde la ciudad se encontraba con el agua y con los barcos que llegaban al puerto.",
    highlights: [
      "La brisa del lago",
      "Las vistas del atardecer",
      "El paseo junto al agua",
      "El ambiente de la noche temprana",
    ],
    suggestions: [
      ["Camina sin prisa", "El malecón se disfruta despacio. Deja el teléfono un rato y mira el horizonte."],
      ["Ve acompañado", "De noche es más agradable caminar en grupo y por las zonas iluminadas."],
      ["Lleva una chaqueta ligera", "La brisa puede ser fresca después del atardecer, sobre todo si vienes del calor del día."],
    ],
    nearby: ["Vereda del Lago", "Paseo del Lago", "Centro histórico"],
    food: "Una malta bien fría o un helado de kiosco.",
    funFact:
      "El lago ha sido históricamente la salida al mundo de Maracaibo: por sus aguas entró y salió buena parte del comercio zuliano.",
    plan: "Combínalo con la Vereda del Lago para una tarde completa frente al agua.",
  },

  /* ===== Gastronomía ===== */
  "sabor-zuliano": {
    emblem: "utensils",
    colors: PEACH,
    essence: "La cocina de casa, con sazón zuliano",
    bestTime: "Almuerzo, de 12 a 3 pm",
    duration: "45 – 90 min",
    budget: "Económico a moderado",
    idealFor: "Familias y comidas sin prisa",
    history:
      "Sabor Zuliano es una parada para probar la cocina de todos los días con sazón local. Ideal para almorzar sin prisa y compartir varios platos en familia. Su propuesta se apoya en recetas caseras: arepas, patacones, carnes y guisos que saben a domingo.",
    highlights: [
      "Las arepas y los patacones",
      "Los guisos de cocina casera",
      "El ambiente familiar",
      "Los jugos naturales",
    ],
    suggestions: [
      ["Pide para compartir", "Varios platos al centro permiten probar más sabores y sale mejor por persona."],
      ["Ve al mediodía", "El almuerzo es el momento fuerte. Llega temprano para evitar la fila."],
      ["Pregunta por el plato del día", "Suele ser lo más fresco y lo que mejor representa la cocina de la casa."],
    ],
    nearby: ["Bella Vista", "Calle 72", "Mi Vaquita"],
    food: "Patacón con queso, arepa de queso y un jugo de parchita.",
    funFact:
      "El patacón es uno de los emblemas de la cocina zuliana: plátano verde frito y aplastado, casi siempre con queso.",
    plan: "Almuerza aquí y sigue con una caminata por Bella Vista.",
  },
  "rincon-zuliano": {
    emblem: "utensils",
    colors: SUN,
    essence: "Sabores tradicionales en confianza",
    bestTime: "Almuerzo o cena temprana",
    duration: "45 – 90 min",
    budget: "Moderado",
    idealFor: "Primera visita a la cocina local",
    history:
      "El Rincón Zuliano reúne recetas de la región en un ambiente cercano. Es una buena primera parada para entender por qué la cocina maracucha se disfruta tanto. Aquí lo tradicional no se presenta como museo, sino como comida viva, servida con orgullo.",
    highlights: [
      "Los platos tradicionales",
      "El ambiente cálido",
      "La atención cercana",
      "Los postres zulianos",
    ],
    suggestions: [
      ["Pide recomendación", "El personal sabe qué plato representa mejor la casa. Déjate aconsejar."],
      ["Deja espacio para el postre", "Los dulces zulianos merecen su propio momento."],
      ["Reserva si es fin de semana", "Los fines de semana se llena; una llamada antes te ahorra espera."],
    ],
    nearby: ["Bella Vista", "Calle 72", "Zona Rosa"],
    food: "Un plato combinado de guiso, arroz y plátano, con postre de la casa.",
    funFact:
      "La cocina zuliana mezcla influencias indígenas, africanas y europeas, y eso se siente en cada plato.",
    plan: "Cena temprano y luego camina por la Zona Rosa de Bella Vista.",
  },
  "mi-vaquita": {
    emblem: "utensils",
    colors: CORAL,
    essence: "Parrilla y buena mesa para celebrar",
    bestTime: "Cena, a partir de las 7 pm",
    duration: "1.5 – 2.5 h",
    budget: "Moderado a alto",
    idealFor: "Parejas, celebraciones y amigos",
    history:
      "Mi Vaquita Steak House & Bar propone una experiencia de parrilla y coctelería en un ambiente relajado. Una opción para celebrar o darse un gusto después de recorrer la ciudad. La carne y los cócteles son los protagonistas, con un servicio pensado para quedarse.",
    highlights: [
      "Los cortes a la parrilla",
      "La coctelería del bar",
      "El ambiente para celebrar",
      "Los acompañamientos y postres",
    ],
    suggestions: [
      ["Reserva", "Es un lugar popular para cenas y celebraciones. Reserva con anticipación, sobre todo el fin de semana."],
      ["Pregunta el término", "Si te gusta la carne, conversa con el mesonero sobre el punto y el corte antes de pedir."],
      ["Ve sin prisa", "Es un plan de cena larga. No lo pongas justo después de una jornada agotadora."],
    ],
    nearby: ["Calle 72", "Zona Rosa", "Vereda del Lago"],
    food: "Un corte a la parrilla con acompañamientos y un cóctel de la casa.",
    funFact:
      "La zona de Bella Vista concentra algunas de las mejores propuestas de parrilla y coctelería de la ciudad.",
    plan: "Cena aquí después del atardecer en la Vereda del Lago.",
  },

  /* ===== Compras ===== */
  "galerias-mall": {
    emblem: "bag",
    colors: LAVENDER,
    essence: "Todo en un solo lugar",
    bestTime: "Tarde, cuando baja el sol",
    duration: "1 – 3 h",
    budget: "Variable",
    idealFor: "Compras, cine y familia",
    history:
      "Galerías Mall es uno de los centros comerciales de referencia de Maracaibo. Reúne tiendas, cines y opciones de comida en un espacio cómodo para toda la familia. Es el plan práctico para un día de calor o para completar la compra que faltaba.",
    highlights: [
      "Las tiendas de moda y tecnología",
      "El cine",
      "La plaza de comidas",
      "El ambiente familiar",
    ],
    suggestions: [
      ["Ve en la tarde", "Evitas el calor fuerte y encuentras más movimiento en tiendas y cines."],
      ["Revisa la cartelera", "Si vas por cine, compra o reserva con tiempo los fines de semana."],
      ["Aprovecha el estacionamiento", "Llega temprano si vas en carro; el estacionamiento se llena en horas pico."],
    ],
    nearby: ["Sambil Maracaibo", "Doral Center", "Bella Vista"],
    food: "Comida de plaza o un café después de las compras.",
    funFact:
      "Los centros comerciales de Maracaibo funcionan también como refugio climático en los días de calor intenso.",
    plan: "Combínalo con una película y una cena en Bella Vista.",
  },
  "sambil-maracaibo": {
    emblem: "bag",
    colors: GRAPE,
    essence: "La cúpula que se ve desde lejos",
    bestTime: "Tarde o noche temprana",
    duration: "1 – 3 h",
    budget: "Variable",
    idealFor: "Compras, cine y paseo familiar",
    history:
      "Sambil Maracaibo es un centro comercial de gran formato con tiendas, entretenimiento y restaurantes. Su cúpula y sus espacios abiertos lo hacen fácil de recorrer. Es una parada segura para días de lluvia o para completar un plan familiar.",
    highlights: [
      "La cúpula y la arquitectura del centro",
      "Las tiendas y el cine",
      "La oferta gastronómica",
      "Los espacios para niños",
    ],
    suggestions: [
      ["Ve con tiempo", "Es grande. Si vas por algo específico, revisa el directorio antes de entrar."],
      ["Planifica la comida", "La plaza de comidas se llena a la hora del almuerzo y de la cena."],
      ["Combínalo con el cine", "Una película y una cena hacen un plan completo para la tarde."],
    ],
    nearby: ["Galerías Mall", "Bella Vista", "Doral Center"],
    food: "Plaza de comidas, cafés y restaurantes dentro del centro.",
    funFact:
      "Su cúpula es uno de los elementos arquitectónicos más reconocibles de la zona comercial de Maracaibo.",
    plan: "Hazlo parte de un día de compras y cine en familia.",
  },
  "doral-center": {
    emblem: "bag",
    colors: SKY,
    essence: "Compras rápidas y café",
    bestTime: "Tarde de semana",
    duration: "30 – 90 min",
    budget: "Variable",
    idealFor: "Compras puntuales y pausas",
    history:
      "Doral Center es una opción práctica para compras puntuales, servicios y una pausa de café en la zona de Bella Vista. No compite con los grandes centros comerciales: su encanto está en la comodidad y en la cercanía.",
    highlights: [
      "Las tiendas de servicios",
      "Las cafeterías",
      "La ubicación en Bella Vista",
      "El ambiente tranquilo",
    ],
    suggestions: [
      ["Úsalo para lo puntual", "Si necesitas un servicio o una compra rápida, aquí vas directo al punto."],
      ["Toma un café", "Es una buena pausa en medio de un día de diligencias por Bella Vista."],
      ["Revisa horarios", "Algunos locales abren solo en horario de oficina."],
    ],
    nearby: ["Bella Vista", "Calle 72", "Galerías Mall"],
    food: "Un café y un postre en una de sus cafeterías.",
    funFact:
      "La zona de Bella Vista concentra comercios, consultorios y restaurantes, y es una de las más activas de la ciudad.",
    plan: "Haz una pausa de café aquí entre dos diligencias.",
  },

  /* ===== Salud ===== */
  "hospital-universitario-maracaibo": {
    emblem: "cross",
    colors: SKY,
    essence: "Referencia médica y académica",
    bestTime: "Solo si necesitas atención",
    duration: "Según el servicio",
    budget: "Consulta pública",
    idealFor: "Atención médica y emergencias",
    history:
      "El Hospital Universitario de Maracaibo es un centro de referencia para la formación médica y la atención de la región. Antes de acudir conviene confirmar servicios y horarios por los canales oficiales. Su vínculo con la universidad lo convierte en un espacio clave para la salud y la enseñanza.",
    highlights: [
      "La atención de emergencias",
      "Los servicios de especialidades",
      "El vínculo con la Universidad del Zulia",
      "La red de formación médica",
    ],
    suggestions: [
      ["Llama antes", "Confirma disponibilidad de especialidades y horarios por los canales oficiales."],
      ["Lleva recaudos", "Documento de identidad, récipes y estudios previos ahorran tiempo en la consulta."],
      ["Ve acompañado", "En emergencias, alguien que ayude con trámites y traslados hace la diferencia."],
    ],
    nearby: ["Universidad del Zulia", "Parque Universitario", "MACZUL"],
    food: "Lleva agua y una merienda ligera para la espera.",
    funFact:
      "Es uno de los principales hospitales universitarios del estado y forma parte de la red pública de salud.",
    plan: "Solo como parada de servicio; no es un atractivo turístico.",
  },
  "hospital-central-maracaibo": {
    emblem: "cross",
    colors: ROSE,
    essence: "Atención pública en Bella Vista",
    bestTime: "Solo si necesitas atención",
    duration: "Según el servicio",
    budget: "Consulta pública",
    idealFor: "Emergencias y consulta",
    history:
      "El Hospital Central de Maracaibo atiende a la población de la ciudad y forma parte de la red pública de salud del estado. Verifica siempre los servicios disponibles y los canales de contacto oficiales. Su ubicación en Bella Vista lo hace accesible desde buena parte de la ciudad.",
    highlights: [
      "Las emergencias",
      "Los servicios de hospitalización",
      "La ubicación accesible",
      "La red pública de salud",
    ],
    suggestions: [
      ["Confirma el servicio", "No todos los servicios están disponibles todo el tiempo. Llama antes de trasladarte."],
      ["Lleva documentos", "Identificación, récipes y estudios agilizan la atención."],
      ["Pregunta por el flujo", "En emergencias, pregunta en admisión cuál es el paso siguiente para no perder tiempo."],
    ],
    nearby: ["Bella Vista", "Calle 72", "Galerías Mall"],
    food: "Lleva agua y algo ligero para la espera.",
    funFact:
      "Forma parte de la red de atención pública y es uno de los centros de referencia de la ciudad.",
    plan: "Solo como parada de servicio; no es un atractivo turístico.",
  },
  "hospital-clinico-maracaibo": {
    emblem: "cross",
    colors: CORAL,
    essence: "Atención médica de la ciudad",
    bestTime: "Solo si necesitas atención",
    duration: "Según el servicio",
    budget: "Consulta pública",
    idealFor: "Consulta y atención general",
    history:
      "El Hospital Clínico de Maracaibo forma parte de la red de atención de la ciudad. Es recomendable confirmar la disponibilidad de cada servicio antes de la visita. Su equipo atiende consultas y emergencias dentro de la red pública.",
    highlights: [
      "La consulta general",
      "Los servicios de apoyo",
      "La atención de emergencias",
      "La red pública",
    ],
    suggestions: [
      ["Confirma horarios", "Los servicios cambian según el día. Una llamada previa evita viajes en vano."],
      ["Lleva tus récipes", "El historial y los estudios previos ayudan al médico a decidir mejor."],
      ["Ve temprano", "Las consultas suelen atenderse por orden de llegada."],
    ],
    nearby: ["Bella Vista", "Calle 72", "Hospital Central"],
    food: "Lleva agua y una merienda ligera.",
    funFact:
      "La red pública de salud de Maracaibo articula hospitales, ambulatorios y centros de diagnóstico.",
    plan: "Solo como parada de servicio; no es un atractivo turístico.",
  },
  "clinica-paraiso": {
    emblem: "shield",
    colors: MINT,
    essence: "Atención privada con calma",
    bestTime: "Solo si necesitas atención",
    duration: "Según el servicio",
    budget: "Privado, según cobertura",
    idealFor: "Consulta, hospitalización y emergencias",
    history:
      "La Clínica Paraíso es una opción privada de atención médica en Maracaibo. Para visitas o emergencias conviene llamar antes y confirmar disponibilidad y cobertura. Su enfoque está en la atención programada y en la comodidad del paciente.",
    highlights: [
      "La atención de emergencias",
      "Las consultas especializadas",
      "La hospitalización",
      "La comodidad de las instalaciones",
    ],
    suggestions: [
      ["Confirma tu cobertura", "Pregunta por seguros y convenios antes de la consulta para evitar sorpresas."],
      ["Llama antes", "En emergencias, avisa que vas en camino para agilizar la admisión."],
      ["Lleva tus estudios", "El historial completo ayuda a que la atención sea más rápida y precisa."],
    ],
    nearby: ["Las Delicias", "Bella Vista", "Vereda del Lago"],
    food: "Lleva agua y una merienda ligera para la espera.",
    funFact:
      "Es la opción privada del catálogo, separada de los hospitales públicos para que el visitante sepa qué esperar.",
    plan: "Solo como parada de servicio; no es un atractivo turístico.",
  },

  /* ===== Educación ===== */
  "universidad-del-zulia": {
    emblem: "cap",
    colors: SKY,
    essence: "La casa de los universitarios",
    bestTime: "Días hábiles, en la mañana",
    duration: "1 – 2 h",
    budget: "Gratis desde el exterior",
    idealFor: "Arquitectura, historia y cultura",
    history:
      "La Universidad del Zulia es la principal universidad pública de la región. Su Ciudad Universitaria reúne patrimonio arquitectónico, vida estudiantil y espacios culturales. Caminarla es entender una parte central de la historia moderna de Maracaibo.",
    highlights: [
      "La arquitectura de la Ciudad Universitaria",
      "El ambiente estudiantil",
      "Los espacios culturales",
      "El patrimonio moderno del conjunto",
    ],
    suggestions: [
      ["Ve en día hábil", "La vida universitaria se siente de lunes a viernes. Los fines de semana el campus es más silencioso."],
      ["Respeta las áreas", "No todas las instalaciones son de acceso público. Pregunta antes de entrar a edificios."],
      ["Combina con el jardín", "El Jardín Botánico y el Parque Universitario están cerca y completan el paseo."],
    ],
    nearby: ["Jardín Botánico", "Parque Universitario", "MACZUL"],
    food: "Un café o una merienda en la zona universitaria.",
    funFact:
      "La Ciudad Universitaria de LUZ es uno de los conjuntos arquitectónicos más importantes del Zulia.",
    plan: "Haz una caminata de arquitectura y termina en el Jardín Botánico.",
  },
  unica: {
    emblem: "cap",
    colors: CREAM,
    essence: "Formación humanista en Maracaibo",
    bestTime: "Días hábiles, con coordinación previa",
    duration: "45 – 90 min",
    budget: "Gratis desde el exterior",
    idealFor: "Arquitectura y vida académica",
    history:
      "La UNICA es una universidad privada de Maracaibo con una propuesta académica vinculada a la formación humanista y católica. Su campus y su actividad cultural la convierten en un punto de interés para quienes siguen la vida académica de la ciudad.",
    highlights: [
      "El campus y sus edificios",
      "La actividad cultural",
      "El ambiente académico",
      "La capilla y los espacios de encuentro",
    ],
    suggestions: [
      ["Coordina la visita", "Los campus privados suelen requerir autorización para recorridos. Llama antes."],
      ["Respeta la actividad", "Si hay clases o actos, evita interrumpir y pregunta dónde puedes caminar."],
      ["Pregunta por eventos", "Las universidades suelen tener charlas y actividades abiertas al público."],
    ],
    nearby: ["Bella Vista", "Calle 72", "Centro histórico"],
    food: "Un café en los alrededores del campus.",
    funFact:
      "Su nombre honra a Cecilio Acosta, uno de los humanistas más importantes de Venezuela.",
    plan: "Combínala con una tarde de café y librerías en Bella Vista.",
  },
  urbe: {
    emblem: "cap",
    colors: PEACH,
    essence: "Campus grande, mirada joven",
    bestTime: "Días hábiles, en la mañana",
    duration: "45 – 90 min",
    budget: "Gratis desde el exterior",
    idealFor: "Arquitectura y vida estudiantil",
    history:
      "La Universidad Rafael Belloso Chacín (URBE) es una universidad privada de Maracaibo con un campus amplio y una oferta académica que abarca distintas disciplinas. Su crecimiento acompaña la expansión de la ciudad hacia el norte.",
    highlights: [
      "El campus y sus plazas",
      "La vida estudiantil",
      "Los edificios de facultades",
      "Las actividades extracurriculares",
    ],
    suggestions: [
      ["Ve con coordinación", "Pregunta en recepción si hay visitas permitidas para recorrer el campus."],
      ["Busca eventos", "Las ferias y muestras académicas son una buena excusa para conocerlo."],
      ["Combina con el norte", "Está en la zona norte, cerca de otros puntos de interés de la ciudad."],
    ],
    nearby: ["Sambil Maracaibo", "Galerías Mall", "Ciudad Universitaria"],
    food: "Una merienda en las cafeterías del campus o en los alrededores.",
    funFact:
      "URBE es una de las universidades privadas con mayor presencia en la vida académica del Zulia.",
    plan: "Inclúyelo en un recorrido por la zona norte de la ciudad.",
  },

  /* ===== Deportes ===== */
  "estadio-pachencho-romero": {
    emblem: "ball",
    colors: MINT,
    essence: "El templo del fútbol zuliano",
    bestTime: "Día de partido",
    duration: "2 – 3 h",
    budget: "Según la taquilla",
    idealFor: "Fútbol, familia y eventos",
    history:
      "El estadio Pachencho Romero es el principal escenario del fútbol zuliano. Ha recibido partidos de la selección de Venezuela y eventos deportivos de gran convocatoria. Su graderío y su cancha han visto celebrar y sufrir a generaciones de aficionados.",
    highlights: [
      "La cancha y las gradas",
      "El ambiente de día de partido",
      "Los eventos deportivos",
      "La pasión de la afición zuliana",
    ],
    suggestions: [
      ["Compra con anticipación", "Si hay partido, asegura tu entrada y llega con tiempo para evitar filas."],
      ["Ve con lo necesario", "Lleva agua, gorra y protector solar. Los controles de entrada pueden ser estrictos."],
      ["Organiza el regreso", "Al terminar el partido el tráfico se complica. Define cómo vas a volver."],
    ],
    nearby: ["Ciudad Universitaria", "Jardín Botánico", "Sambil Maracaibo"],
    food: "Comida de estadio: perros calientes, tequeños y refrescos.",
    funFact:
      "Ha sido escenario de partidos de la selección nacional y de eventos deportivos de gran convocatoria.",
    plan: "Reserva el día completo si vas a un partido: llegada, previa y regreso.",
  },
  "estadio-luis-aparicio": {
    emblem: "ball",
    colors: CORAL,
    essence: "La casa de las Águilas del Zulia",
    bestTime: "Temporada de béisbol, de noche",
    duration: "2 – 3 h",
    budget: "Según la taquilla",
    idealFor: "Béisbol, familia y amigos",
    history:
      "El estadio Luis Aparicio es la casa de las Águilas del Zulia y una parada obligatoria para quienes siguen el béisbol venezolano. Su nombre honra a uno de los peloteros más importantes del país y su ambiente nocturno es parte de la tradición deportiva maracucha.",
    highlights: [
      "El diamante y las gradas",
      "El ambiente de la fanaticada",
      "La música y la fiesta del béisbol",
      "La historia de las Águilas",
    ],
    suggestions: [
      ["Ve en temporada", "El estadio cobra vida con la temporada de la LVBP. Revisa el calendario antes de ir."],
      ["Llega temprano", "La previa y el calentamiento son parte del espectáculo."],
      ["Prueba la comida del estadio", "Los tequeños y los perros calientes son parte de la experiencia."],
    ],
    nearby: ["Centro histórico", "Calle Carabobo", "Plaza Baralt"],
    food: "Tequeños, perros calientes y refrescos dentro del estadio.",
    funFact:
      "Su nombre honra a Luis Aparicio, el único venezolano en el Salón de la Fama del Béisbol de Grandes Ligas.",
    plan: "Haz una noche de béisbol y cena después del partido.",
  },
  "estadio-alejandro-borges": {
    emblem: "ball",
    colors: CREAM,
    essence: "Memoria del deporte maracaibero",
    bestTime: "Día de evento o visita exterior",
    duration: "30 – 60 min",
    budget: "Gratis desde el exterior",
    idealFor: "Historia deportiva y fotos",
    history:
      "El estadio Alejandro Borges conserva valor histórico para el deporte de Maracaibo. Es un punto de referencia para entender la tradición deportiva de la ciudad y ha sido escenario de eventos que marcaron época. Hoy su valor es tanto patrimonial como simbólico.",
    highlights: [
      "La fachada histórica",
      "El valor patrimonial del recinto",
      "La memoria del deporte local",
      "El entorno urbano del centro",
    ],
    suggestions: [
      ["Ve si hay evento", "El estadio no siempre está abierto. Consulta la programación antes de acercarte."],
      ["Fotografía el exterior", "La fachada y los detalles arquitectónicos cuentan la historia del recinto."],
      ["Combínalo con el centro", "Está cerca de otros puntos históricos que puedes sumar al paseo."],
    ],
    nearby: ["Plaza Baralt", "Calle Carabobo", "Teatro Baralt"],
    food: "Un café en el centro después de la visita.",
    funFact:
      "Su nombre recuerda a Alejandro Borges, figura vinculada al deporte y a la vida pública del Zulia.",
    plan: "Inclúyelo en una caminata por la memoria deportiva del centro.",
  },

  /* ===== Noche ===== */
  "calle-72-bella-vista": {
    emblem: "music",
    colors: CORAL,
    essence: "La noche que no se acaba temprano",
    bestTime: "Desde las 7 pm",
    duration: "2 – 4 h",
    budget: "Moderado a alto",
    idealFor: "Cenas, amigos y música",
    history:
      "La Calle 72 y el sector Bella Vista concentran restaurantes, terrazas y propuestas para salir de noche. Es una zona animada para cenar y compartir sin alejarse del centro. Con los años se ha convertido en el epicentro de la vida nocturna maracucha.",
    highlights: [
      "Los restaurantes y terrazas",
      "La música en vivo",
      "El ambiente de fin de semana",
      "La oferta de coctelería",
    ],
    suggestions: [
      ["Reserva", "Los fines de semana se llena. Una reserva evita caminar sin mesa."],
      ["Define el plan", "La zona tiene desde cenas tranquilas hasta bares animados. Elige el ambiente antes de salir."],
      ["Organiza el regreso", "Si vas a tomar, define conductor designado o transporte con anticipación."],
    ],
    nearby: ["Zona Rosa", "Mi Vaquita", "Vereda del Lago"],
    food: "Parrilla, comida de autor y cócteles en cualquiera de sus locales.",
    funFact:
      "Bella Vista es uno de los sectores con mayor concentración de restaurantes y vida nocturna de Maracaibo.",
    plan: "Cena en la 72 y termina con un cóctel en la Zona Rosa.",
  },
  "zona-rosa-bella-vista": {
    emblem: "moon",
    colors: GRAPE,
    essence: "Terrazas, música y luces",
    bestTime: "Noche, de jueves a sábado",
    duration: "2 – 4 h",
    budget: "Moderado",
    idealFor: "Salir con amigos o en pareja",
    history:
      "La Zona Rosa de Bella Vista reúne propuestas gastronómicas y de entretenimiento para la noche. Ideal para una cena tranquila o una salida con amigos. Su ambiente cambia según el local: desde terrazas íntimas hasta barras con música hasta tarde.",
    highlights: [
      "Las terrazas iluminadas",
      "La oferta gastronómica",
      "La música y los bares",
      "El ambiente de fin de semana",
    ],
    suggestions: [
      ["Ve con plan B", "Si un local está lleno, la zona tiene varias opciones a poca distancia."],
      ["Comparte el transporte", "Usa transporte seguro y acuerda el regreso antes de la primera ronda."],
      ["Prueba la coctelería local", "Pide una recomendación con frutas de la región; suelen ser las mejores."],
    ],
    nearby: ["Calle 72", "Mi Vaquita", "Vereda del Lago"],
    food: "Tapas, parrilla y cócteles de autor.",
    funFact:
      "El nombre «Zona Rosa» se usa en varias ciudades para señalar las áreas de restaurantes y vida nocturna.",
    plan: "Haz una noche de tapas y termina caminando por Bella Vista.",
  },
  "ruta-dulces-santa-lucia": {
    emblem: "cake",
    colors: ROSE,
    essence: "Un recorrido que sabe a tradición",
    bestTime: "Al caer la tarde",
    duration: "1.5 – 2.5 h",
    budget: "Desde $5 en adelante",
    idealFor: "Gastronomía, familias y dulces",
    history:
      "La ruta de los dulces de Santa Lucía es una experiencia de barrio para probar postres tradicionales y conocer a las familias que mantienen las recetas. Suele disfrutarse mejor al caer la tarde, cuando las cocinas están activas y el barrio se enciende.",
    highlights: [
      "Los dulces de lechosa y coco",
      "Las casas de recetas tradicionales",
      "La iglesia y las calles de colores",
      "La conversación con los vecinos",
    ],
    suggestions: [
      ["Ve con hambre", "Es una ruta de degustación. No almuerces pesado antes de salir."],
      ["Lleva efectivo", "Muchos puestos son pequeños y no tienen punto de venta."],
      ["Pregunta por la historia", "Cada receta tiene una familia detrás. Preguntar es parte del paseo."],
    ],
    nearby: ["Santa Lucía", "Calle Carabobo", "Basílica de la Chinita"],
    food: "Dulce de lechosa, conserva de coco, torta de auyama y café.",
    funFact:
      "Santa Lucía es conocida como uno de los barrios dulceros más importantes de Maracaibo.",
    plan: "Haz la ruta al atardecer y cierra con una visita a la iglesia del barrio.",
  },

  /* ===== Transporte ===== */
  "aeropuerto-la-chinita": {
    emblem: "plane",
    colors: SKY,
    essence: "La puerta aérea del Zulia",
    bestTime: "Según tu vuelo",
    duration: "2 h antes del vuelo",
    budget: "Según el vuelo",
    idealFor: "Llegadas, salidas y conexiones",
    history:
      "El Aeropuerto Internacional La Chinita conecta a Maracaibo con el resto del país y con destinos internacionales. Conviene confirmar vuelos y transporte terrestre antes de salir. Su nombre honra a la Virgen de Chiquinquirá y es la primera postal para muchos visitantes.",
    highlights: [
      "La terminal y sus servicios",
      "La conexión con la ciudad",
      "Los mostradores de transporte",
      "El ambiente de llegada",
    ],
    suggestions: [
      ["Llega con tiempo", "Dos horas antes para vuelos nacionales y tres para internacionales es una buena regla."],
      ["Confirma el transporte", "Acuerda el traslado antes de aterrizar; los taxis del aeropuerto pueden ser costosos."],
      ["Revisa tu vuelo", "Las aerolíneas cambian horarios con frecuencia. Confirma el día anterior."],
    ],
    nearby: ["Puente Rafael Urdaneta", "Centro histórico", "Vereda del Lago"],
    food: "Café y comida rápida en la terminal.",
    funFact:
      "Debe su nombre a la Virgen de Chiquinquirá, la patrona del Zulia.",
    plan: "Reserva tu traslado y deja margen para el tráfico de la ciudad.",
  },
  "terminal-pasajeros-maracaibo": {
    emblem: "bus",
    colors: PEACH,
    essence: "El punto de partida del occidente",
    bestTime: "Según tu salida",
    duration: "1 h antes de la salida",
    budget: "Según el pasaje",
    idealFor: "Viajes interurbanos",
    history:
      "La terminal de pasajeros de Maracaibo concentra rutas hacia distintos destinos del Zulia y del occidente venezolano. Llega con tiempo y confirma horarios con la línea que vayas a usar. Es un espacio de movimiento constante y despedidas.",
    highlights: [
      "Los mostradores de las líneas",
      "La oferta de transporte",
      "Los servicios de la terminal",
      "El movimiento de viajeros",
    ],
    suggestions: [
      ["Compra con anticipación", "Los pasajes de rutas largas se agotan, sobre todo en temporada alta."],
      ["Confirma la línea", "Los horarios cambian. Llama o revisa los canales oficiales de la empresa."],
      ["Cuida tus pertenencias", "Es una terminal concurrida. Mantén el equipaje cerca y no lo dejes solo."],
    ],
    nearby: ["Centro histórico", "Calle Carabobo", "Plaza Baralt"],
    food: "Una merienda rápida antes de abordar.",
    funFact:
      "Desde aquí salen rutas hacia buena parte del occidente del país, incluyendo destinos del Zulia y estados vecinos.",
    plan: "Llega con tiempo y confirma tu plataforma antes de comprar el pasaje.",
  },
  "puente-rafael-urdaneta": {
    emblem: "bridge",
    colors: SKY,
    essence: "La obra que unió dos orillas",
    bestTime: "Atardecer o noche, para verlo iluminado",
    duration: "20 – 40 min (vista)",
    budget: "Gratis",
    idealFor: "Fotos, ingeniería y atardeceres",
    history:
      "Inaugurado en 1962, el Puente General Rafael Urdaneta es una de las obras de ingeniería más importantes de Venezuela. Une Maracaibo con la costa oriental del lago y se ha convertido en símbolo de la ciudad. Verlo desde la orilla o cruzarlo es entender la escala del lago.",
    highlights: [
      "La estructura y sus cables",
      "La vista desde la orilla",
      "La iluminación nocturna",
      "El atardecer sobre el lago",
    ],
    suggestions: [
      ["Míralo desde tierra", "La mejor foto suele estar en la orilla, no sobre el puente. Busca un punto seguro."],
      ["Ve al atardecer", "La luz cálida sobre la estructura es el momento más fotogénico."],
      ["No te detengas en el puente", "Si lo cruzas en carro, evita paradas: es una vía de tránsito y no un mirador."],
    ],
    nearby: ["Vereda del Lago", "Paseo del Lago", "Aeropuerto La Chinita"],
    food: "Un café o una malta en la orilla mientras ves caer el sol.",
    funFact:
      "Es uno de los puentes más largos de Latinoamérica y su nombre honra al general Rafael Urdaneta.",
    plan: "Combínalo con el atardecer en la Vereda del Lago.",
  },
};

/** Todos los perfiles, construidos una sola vez. */
export const PLACE_PROFILES: Record<string, PlaceProfile> = Object.fromEntries(
  Object.entries(RAW).map(([slug, seed]) => [
    slug,
    {
      slug,
      ...seed,
      suggestions: seed.suggestions.map(([title, text]) => ({ title, text })),
    },
  ])
);

const CATEGORY_EMBLEM: Record<CategorySlug, PlaceEmblemName> = {
  plazas: "landmark",
  historia: "bank",
  cultura: "palette",
  fe: "church",
  museos: "museum",
  naturaleza: "leaf",
  lago: "waves",
  gastronomia: "utensils",
  compras: "bag",
  salud: "cross",
  educacion: "cap",
  deportes: "ball",
  noche: "moon",
  transporte: "bus",
  arquitectura: "tower",
};

function fallbackProfile(place: Place): PlaceProfile {
  const categorySlug = primaryCategory(place);
  const category = categoryBySlug(categorySlug);
  const palette: PlaceColors = category
    ? {
        from: category.soft,
        to: category.soft,
        accent: category.from,
        soft: category.soft,
        ink: "#17364A",
      }
    : SKY;
  return {
    slug: place.slug,
    emblem: CATEGORY_EMBLEM[categorySlug] ?? "star",
    colors: palette,
    essence: category?.blurb ?? "Un rincón de Maracaibo",
    bestTime: "Mañana o atardecer",
    duration: "30 – 60 min",
    budget: "Variable",
    idealFor: "Explorar la ciudad",
    history:
      "Este lugar forma parte del catálogo curado de Visita Maracaibo. Su historia se sigue completando con la comunidad: si conoces un dato, una anécdota o una foto antigua, escríbenos para sumarla a la ficha.",
    highlights: ["Su entorno", "El ambiente local", "Los detalles de su arquitectura"],
    suggestions: [
      {
        title: "Pregunta en el lugar",
        text: "Los vecinos y el personal suelen conocer historias que no aparecen en los libros.",
      },
      {
        title: "Ve con tiempo",
        text: "Calcula al menos una hora para recorrerlo sin prisa y sin el sol más fuerte.",
      },
    ],
    nearby: [],
    food: "Pregunta por la comida típica de la zona.",
    funFact: "Cada rincón de Maracaibo guarda una historia que merece contarse.",
    plan: "Combínalo con otros lugares de la misma zona para aprovechar el paseo.",
  };
}

/** Perfil editorial del lugar; si falta, uno generado a partir de su categoría. */
export function profileFor(place: Place): PlaceProfile {
  return PLACE_PROFILES[place.slug] ?? fallbackProfile(place);
}
