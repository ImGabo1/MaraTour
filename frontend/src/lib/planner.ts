import type { CategorySlug } from "../data/categories";
import { foodForMoment, type Diet, type FoodMoment, type FoodSpot } from "../data/food";
import type { Place } from "../types";
import { groupsFor, primaryCategory } from "./places";
import { popularityScore } from "./popularity";

export type Companion = "solo" | "pareja" | "familia" | "amigos";
export type Budget = "$" | "$$" | "$$$";
export type Pace = "relajado" | "equilibrado" | "intenso";
export type Slot = "mañana" | "tarde" | "noche";

export interface PlannerInput {
  days: number;
  companion: Companion;
  pace: Pace;
  interests: CategorySlug[];
  budget: Budget;
  diet: Diet;
  want360: boolean;
  wantNightlife: boolean;
}

export interface PlanStop {
  place: Place;
  slot: Slot;
  reason: string;
}

export interface PlanDay {
  day: number;
  title: string;
  stops: PlanStop[];
  food: {
    breakfast: FoodSpot;
    lunch: FoodSpot;
    dinner: FoodSpot;
    sweet: FoodSpot;
  };
  tip: string;
}

export interface PlanResult {
  days: PlanDay[];
  score: number;
  summary: string;
  tags: CategorySlug[];
  totalStops: number;
}

const COMPANION_WEIGHTS: Record<Companion, Partial<Record<CategorySlug, number>>> = {
  solo: { cultura: 3, historia: 2, museos: 2, gastronomia: 2, plazas: 1, lago: 1, noche: 1 },
  pareja: { lago: 3, gastronomia: 3, cultura: 2, plazas: 2, noche: 2, historia: 1, fe: 1 },
  familia: {
    plazas: 3,
    naturaleza: 3,
    museos: 2,
    educacion: 2,
    deportes: 2,
    gastronomia: 1,
    compras: 1,
    noche: -4,
  },
  amigos: { noche: 3, gastronomia: 3, cultura: 2, plazas: 1, deportes: 1, lago: 1, historia: 1 },
};

const SLOT_WEIGHTS: Record<Slot, Partial<Record<CategorySlug, number>>> = {
  mañana: {
    plazas: 3,
    historia: 2,
    museos: 2,
    fe: 2,
    naturaleza: 2,
    arquitectura: 1,
    cultura: 1,
  },
  tarde: {
    cultura: 3,
    museos: 2,
    lago: 2,
    compras: 2,
    naturaleza: 2,
    historia: 1,
    arquitectura: 1,
  },
  noche: { noche: 4, gastronomia: 3, cultura: 1, plazas: 1, lago: 1 },
};

const TIPS = [
  "Lleva agua y protector solar: el sol de Maracaibo no negocia.",
  "Deja el auto lejos del centro y camina el casco histórico con calma.",
  "Pregunta siempre por el plato del día: suele ser más fresco y económico.",
  "Si vas al lago, calcula el atardecer: es el mejor momento para fotos.",
  "En los mercados, lleva billetes pequeños y pregunta el precio antes de pedir.",
  "La gaita no es solo navideña: pregunta por peñas y presentaciones locales.",
  "Usa ropa fresca y calzado cómodo; el calor sube rápido a mediodía.",
  "Reserva con tiempo si visitas en noviembre, mes de la Chinita.",
];

const SLOT_LABEL: Record<Slot, string> = {
  mañana: "Mañana",
  tarde: "Tarde",
  noche: "Noche",
};

function slotCount(pace: Pace): number {
  if (pace === "relajado") return 2;
  if (pace === "intenso") return 4;
  return 3;
}

function slotsFor(pace: Pace): Slot[] {
  const count = slotCount(pace);
  if (count <= 2) return ["mañana", "tarde"];
  if (count === 3) return ["mañana", "tarde", "noche"];
  return ["mañana", "mañana", "tarde", "noche"];
}

function placeScore(
  place: Place,
  input: PlannerInput,
  slot: Slot,
  usedCategories: Set<CategorySlug>
): number {
  const groups = groupsFor(place);
  const primary = primaryCategory(place);
  let score = popularityScore(place.slug) / 12;

  if (input.interests.includes(primary)) score += 9;
  else if (groups.some((group) => input.interests.includes(group))) score += 5;

  for (const [companion, weight] of Object.entries(COMPANION_WEIGHTS[input.companion])) {
    if (groups.includes(companion as CategorySlug)) score += weight * 1.4;
  }

  for (const [slotKey, weights] of Object.entries(SLOT_WEIGHTS)) {
    if (slotKey !== slot) continue;
    for (const [group, weight] of Object.entries(weights)) {
      if (groups.includes(group as CategorySlug)) score += weight * 1.1;
    }
  }

  if (input.want360 && place.panoUrl) score += 2.2;
  if (input.wantNightlife && groups.includes("noche")) score += 2;
  if (usedCategories.has(primary)) score -= 0.9;
  if (input.companion === "familia" && groups.includes("noche")) score -= 8;
  if (input.companion === "familia" && groups.includes("plazas")) score += 1;

  return score;
}

function reasonFor(place: Place, input: PlannerInput, slot: Slot): string {
  const groups = groupsFor(place);
  const primary = primaryCategory(place);
  if (input.interests.includes(primary)) {
    return `Va directo a tu interés por ${place.categoryName.toLowerCase()}.`;
  }
  if (input.want360 && place.panoUrl) {
    return "Tiene vista 360° para que lo conozcas antes de llegar.";
  }
  if (input.companion === "familia" && groups.includes("plazas")) {
    return "Un plan cómodo para compartir en familia.";
  }
  if (slot === "noche" && groups.includes("noche")) {
    return "La noche maracucho empieza aquí.";
  }
  if (groups.includes("lago")) return "Brisa, lago y uno de los mejores atardeceres de la ciudad.";
  if (groups.includes("gastronomia")) return "Para probar el sabor local sin prisa.";
  return "Uno de los lugares que mejor representan a Maracaibo.";
}

function dayTitle(stops: PlanStop[], day: number): string {
  const first = stops[0]?.place.categoryName ?? "Maracaibo";
  const second = stops[1]?.place.categoryName ?? "sabores locales";
  const short = (value: string) => value.split(" y ")[0] ?? value;
  return `Día ${day}: ${short(first)} + ${short(second)}`;
}

function summaryFor(input: PlannerInput, totalStops: number, score: number): string {
  const companion =
    input.companion === "solo"
      ? "a tu ritmo"
      : input.companion === "pareja"
        ? "en pareja"
        : input.companion === "familia"
          ? "en familia"
          : "con amigos";
  return `${input.days} ${input.days === 1 ? "día" : "días"} ${companion}, ${totalStops} paradas y sabores locales. Una ruta con ${score}% de afinidad con lo que te gusta.`;
}

/** Sistema experto local: puntúa lugares por intereses, compañía, momento y presupuesto. */
export function buildPlan(places: readonly Place[], input: PlannerInput): PlanResult {
  const days = Math.max(1, Math.min(5, input.days));
  const perDay = slotsFor(input.pace);
  const used = new Set<string>();
  const usedCategories = new Set<CategorySlug>();
  const planDays: PlanDay[] = [];
  let totalScore = 0;
  let totalStops = 0;

  const candidates = places.filter((place) => {
    if (input.companion === "familia" && primaryCategory(place) === "noche") return false;
    if (!input.wantNightlife && primaryCategory(place) === "noche" && input.companion !== "amigos") {
      return false;
    }
    return true;
  });

  for (let day = 1; day <= days; day += 1) {
    const stops: PlanStop[] = [];
    for (const slot of perDay) {
      const best = candidates
        .filter((place) => !used.has(place.slug))
        .map((place) => ({
          place,
          score: placeScore(place, input, slot, usedCategories),
        }))
        .sort((a, b) => b.score - a.score)[0];

      if (!best) break;
      used.add(best.place.slug);
      usedCategories.add(primaryCategory(best.place));
      totalScore += best.score;
      totalStops += 1;
      stops.push({
        place: best.place,
        slot,
        reason: reasonFor(best.place, input, slot),
      });
    }

    const seed = day - 1;
    planDays.push({
      day,
      title: dayTitle(stops, day),
      stops,
      food: {
        breakfast: foodForMoment("desayuno", input.diet, input.budget, seed),
        lunch: foodForMoment("almuerzo", input.diet, input.budget, seed),
        dinner: foodForMoment("cena", input.diet, input.budget, seed + 2),
        sweet: foodForMoment("dulce", input.diet, input.budget, seed + 4),
      },
      tip: TIPS[(day - 1) % TIPS.length] ?? TIPS[0]!,
    });
  }

  const maxScore = Math.max(totalStops, 1) * 18;
  const score = Math.max(
    68,
    Math.min(99, Math.round(62 + (totalScore / maxScore) * 42 + input.interests.length * 2))
  );

  return {
    days: planDays,
    score,
    summary: summaryFor(input, totalStops, score),
    tags: [...new Set(input.interests)].slice(0, 5),
    totalStops,
  };
}

export function planSlugs(plan: PlanResult): string[] {
  return plan.days.flatMap((day) => day.stops.map((stop) => stop.place.slug));
}

export function slotLabel(slot: Slot): string {
  return SLOT_LABEL[slot];
}

export function planFoodMomentLabel(moment: FoodMoment): string {
  switch (moment) {
    case "desayuno":
      return "Desayuno";
    case "almuerzo":
      return "Almuerzo";
    case "cena":
      return "Cena";
    case "dulce":
      return "Dulce";
    case "bebida":
      return "Bebida";
  }
}
