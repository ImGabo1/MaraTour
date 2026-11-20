import { useEffect, useMemo, useState } from "react";
import { profileFor, type PlaceProfile } from "../data/placeProfiles";
import { loadPlaceTexts, type PlaceTexts } from "../data/placeTexts";
import { useI18n } from "../i18n/I18nProvider";
import type { Place } from "../types";

/**
 * Devuelve el lugar y su perfil con los textos en el idioma elegido.
 * En español (o si ese idioma aún no tiene traducción) se devuelven los originales.
 * `translated` indica si los textos largos ya están en el idioma de la interfaz.
 */
export function useLocalizedPlace(place: Place): { place: Place; profile: PlaceProfile; translated: boolean } {
  const { lang } = useI18n();
  const [texts, setTexts] = useState<Record<string, PlaceTexts> | null>(null);

  useEffect(() => {
    let alive = true;
    setTexts(null);
    if (lang !== "es") {
      void loadPlaceTexts(lang).then((bundle) => {
        if (alive) setTexts(bundle);
      });
    }
    return () => {
      alive = false;
    };
  }, [lang]);

  return useMemo(() => {
    const base = profileFor(place);
    const tx = lang !== "es" ? texts?.[place.slug] : undefined;
    if (!tx) return { place, profile: base, translated: lang === "es" };
    return {
      place: { ...place, shortDescription: tx.shortDescription, history: tx.history },
      profile: {
        ...base,
        essence: tx.essence,
        bestTime: tx.bestTime,
        duration: tx.duration,
        budget: tx.budget,
        idealFor: tx.idealFor,
        history: tx.historyMore,
        highlights: tx.highlights,
        suggestions: tx.suggestions,
        nearby: tx.nearby,
        food: tx.food,
        funFact: tx.funFact,
        plan: tx.plan,
      },
      translated: true,
    };
  }, [place, lang, texts]);
}
