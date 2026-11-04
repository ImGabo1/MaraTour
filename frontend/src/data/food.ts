/** Sabores que el planificador recomienda según el momento del día y el presupuesto. */

export type FoodMoment = "desayuno" | "almuerzo" | "cena" | "dulce" | "bebida";
export type Diet = "todos" | "vegetariano" | "mariscos";

export interface FoodSpot {
  id: string;
  dish: string;
  description: string;
  where: string;
  price: "$" | "$$" | "$$$";
  moments: FoodMoment[];
  diets: Diet[];
  tags: string[];
}

export const FOOD_SPOTS: readonly FoodSpot[] = [
  {
    id: "arepa-queso",
    dish: "Arepa con queso",
    description: "La reina del desayuno: maíz, queso fresco y café bien caliente.",
    where: "Areperas del centro y de Santa Lucía",
    price: "$",
    moments: ["desayuno"],
    diets: ["todos", "vegetariano"],
    tags: ["desayuno", "típico", "rápido"],
  },
  {
    id: "mandoca",
    dish: "Mandoca con queso",
    description: "Rosquita de maíz y queso, crujiente por fuera y tierna por dentro.",
    where: "Panaderías y desayunaderas del Zulia",
    price: "$",
    moments: ["desayuno"],
    diets: ["todos", "vegetariano"],
    tags: ["desayuno", "zulia", "dulce"],
  },
  {
    id: "patacon",
    dish: "Patacón zuliano",
    description: "Plátano verde frito y relleno de queso, carne o pollo. Un clásico de calle.",
    where: "Mercado Guajiro y puestos de comida",
    price: "$",
    moments: ["almuerzo", "cena"],
    diets: ["todos"],
    tags: ["calle", "típico", "contundente"],
  },
  {
    id: "tequenos",
    dish: "Tequeños",
    description: "Deditos de queso envueltos en masa y fritos. Perfectos para compartir.",
    where: "Cafés y terrazas de Bella Vista",
    price: "$",
    moments: ["cena"],
    diets: ["todos", "vegetariano"],
    tags: ["pasapalo", "compartir"],
  },
  {
    id: "cocada",
    dish: "Cocada",
    description: "Dulce de coco de la costa, intenso y aromático.",
    where: "Mercados y dulcerías del centro",
    price: "$",
    moments: ["dulce"],
    diets: ["todos", "vegetariano"],
    tags: ["dulce", "coco"],
  },
  {
    id: "chicha",
    dish: "Chicha",
    description: "Bebida dulce de arroz o maíz con canela, servida bien fría.",
    where: "Carritos y kioscos de toda la ciudad",
    price: "$",
    moments: ["bebida"],
    diets: ["todos", "vegetariano"],
    tags: ["bebida", "dulce"],
  },
  {
    id: "pescado-lago",
    dish: "Pescado frito con tostones",
    description: "Pescado fresco del lago, arroz, ensalada y plátano. Ideal frente al agua.",
    where: "Paseo del Lago y malecones",
    price: "$$",
    moments: ["almuerzo"],
    diets: ["todos", "mariscos"],
    tags: ["lago", "almuerzo", "fresco"],
  },
  {
    id: "cazuela",
    dish: "Cazuela de mariscos",
    description: "Guiso espeso de mariscos y coco, para una comida sin prisa.",
    where: "Restaurantes de la costa y Bella Vista",
    price: "$$$",
    moments: ["almuerzo", "cena"],
    diets: ["todos", "mariscos"],
    tags: ["mariscos", "especial"],
  },
  {
    id: "mondongo",
    dish: "Sopa de mondongo",
    description: "Sopa contundente de la cocina venezolana, con verduras y especias.",
    where: "Fondas y mercados populares",
    price: "$",
    moments: ["almuerzo"],
    diets: ["todos"],
    tags: ["sopa", "tradicional"],
  },
  {
    id: "shawarma",
    dish: "Shawarma y kibbeh",
    description: "La huella árabe de Maracaibo: carne, pan, especias y limón.",
    where: "Bella Vista y el centro",
    price: "$",
    moments: ["cena"],
    diets: ["todos"],
    tags: ["árabe", "cena", "rápido"],
  },
  {
    id: "parrilla",
    dish: "Parrilla con yuca",
    description: "Carne a la parrilla, yuca frita y un buen chimichurri.",
    where: "Calle 72 y zona rosa de Bella Vista",
    price: "$$",
    moments: ["cena"],
    diets: ["todos"],
    tags: ["cena", "carne", "noche"],
  },
  {
    id: "dulces-santa-lucia",
    dish: "Ruta de dulces de Santa Lucía",
    description: "Un recorrido por casas de dulcería tradicional: cocadas, jaleas y conservas.",
    where: "Barrio Santa Lucía",
    price: "$",
    moments: ["dulce"],
    diets: ["todos", "vegetariano"],
    tags: ["dulce", "cultura", "barrio"],
  },
  {
    id: "cafe-maracucho",
    dish: "Café maracucho",
    description: "Café fuerte y pequeño, para arrancar la mañana como un local.",
    where: "Panaderías y cafés del centro",
    price: "$",
    moments: ["desayuno", "bebida"],
    diets: ["todos", "vegetariano"],
    tags: ["café", "mañana"],
  },
  {
    id: "helado-coco",
    dish: "Helado de coco",
    description: "Frío, cremoso y perfecto para el calor de Maracaibo.",
    where: "Heladerías y paseos del lago",
    price: "$",
    moments: ["dulce"],
    diets: ["todos", "vegetariano"],
    tags: ["dulce", "fresco"],
  },
];

export function foodForMoment(
  moment: FoodMoment,
  diet: Diet,
  budget: "$" | "$$" | "$$$",
  seed = 0
): FoodSpot {
  const pool = FOOD_SPOTS.filter(
    (spot) =>
      spot.moments.includes(moment) &&
      spot.diets.includes(diet) &&
      (budget === "$$$" ? true : spot.price !== "$$$")
  );
  const fallback = FOOD_SPOTS.filter((spot) => spot.moments.includes(moment));
  const options = pool.length > 0 ? pool : fallback;
  const index = (seed + moment.length + budget.length) % Math.max(options.length, 1);
  return options[index] ?? FOOD_SPOTS[0]!;
}
