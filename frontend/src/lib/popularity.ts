/** Popularidad de los lugares.
 *
 * La API no trae un campo de popularidad, así que la fachada calcula una puntuación
 * estable por lugar (0–100): una base curada para los sitios más conocidos, un valor
 * determinista para el resto y un pequeño impulso cuando el visitante abre la ficha.
 * Es solo una ayuda visual para ordenar y dimensionar las burbujas.
 */

const BASE_SCORES: Record<string, number> = {
  "basilica-chiquinquira": 98,
  "puente-rafael-urdaneta": 96,
  "plaza-bolivar": 94,
  "paseo-del-lago": 93,
  "estadio-pachencho-romero": 91,
  "universidad-del-zulia": 90,
  "teatro-baralt": 89,
  "sambil-maracaibo": 88,
  "catedral-maracaibo": 87,
  "santa-lucia": 86,
  "aeropuerto-la-chinita": 85,
  "calle-carabobo": 84,
  "malecon-maracaibo": 83,
  "mercado-las-pulgas": 82,
  maczul: 81,
  "centro-arte-lia-bermudez": 80,
  "casa-capitulacion": 79,
  "plaza-baralt": 78,
  "palacio-gobierno-zulia": 77,
  "jardin-botanico-maracaibo": 76,
  "monumento-indio-mara": 75,
  "zona-rosa-bella-vista": 74,
  "calle-72-bella-vista": 73,
  "estadio-luis-aparicio": 72,
};

const VISITS_KEY = "maracaibo.visits";
const MAX_VISIT_BOOST = 16;
const BOOST_PER_VISIT = 4;

let visitsCache: Record<string, number> | null = null;

function loadVisits(): Record<string, number> {
  if (visitsCache) return visitsCache;
  try {
    const raw = window.localStorage.getItem(VISITS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    visitsCache = parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {};
  } catch {
    visitsCache = {};
  }
  return visitsCache;
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Puntuación 0–100. Estable entre sesiones salvo por las visitas guardadas. */
export function popularityScore(slug: string): number {
  const base = BASE_SCORES[slug] ?? 48 + (hashSlug(slug) % 30);
  let visits = 0;
  try {
    visits = loadVisits()[slug] ?? 0;
  } catch {
    visits = 0;
  }
  return Math.min(100, base + Math.min(visits * BOOST_PER_VISIT, MAX_VISIT_BOOST));
}

/** 1 (menos conocido) a 5 (imprescindible). Se usa para el tamaño de las burbujas. */
export function popularityTier(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score >= 90) return 5;
  if (score >= 80) return 4;
  if (score >= 70) return 3;
  if (score >= 60) return 2;
  return 1;
}

export function isPopular(score: number): boolean {
  return score >= 80;
}

/** Se llama al abrir una ficha: la próxima visita sube un poco su popularidad. */
export function recordVisit(slug: string): void {
  try {
    const visits = loadVisits();
    visits[slug] = (visits[slug] ?? 0) + 1;
    window.localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch {
    /* sin localStorage la app sigue funcionando */
  }
}
