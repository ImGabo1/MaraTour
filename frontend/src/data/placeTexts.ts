import type { Lang } from "../i18n/messages";

/** Textos editoriales de un lugar en un idioma (ver data/i18n/places.<lang>.json). */
export interface PlaceTexts {
  shortDescription: string;
  history: string;
  essence: string;
  bestTime: string;
  duration: string;
  budget: string;
  idealFor: string;
  /** Segunda parte de la historia (PlaceProfile.history). */
  historyMore: string;
  highlights: string[];
  suggestions: { title: string; text: string }[];
  nearby: string[];
  food: string;
  funFact: string;
  plan: string;
}

type Bundle = Record<string, PlaceTexts>;

/** Un archivo por idioma, cargado solo cuando el usuario lo elige. El español es el original. */
const LOADERS: Partial<Record<Lang, () => Promise<{ default: unknown }>>> = {
  en: () => import("./i18n/places.en.json"),
  pt: () => import("./i18n/places.pt.json"),
  de: () => import("./i18n/places.de.json"),
};

const cache = new Map<Lang, Promise<Bundle | null>>();

export function loadPlaceTexts(lang: Lang): Promise<Bundle | null> {
  const loader = LOADERS[lang];
  if (!loader) return Promise.resolve(null);
  let pending = cache.get(lang);
  if (!pending) {
    pending = loader()
      .then((module) => module.default as Bundle)
      .catch(() => null);
    cache.set(lang, pending);
  }
  return pending;
}
