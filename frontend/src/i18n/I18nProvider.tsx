import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LANGUAGES, MESSAGES, type Lang, type MessageKey } from "./messages";

const STORAGE_KEY = "maracaibo.lang";

interface I18nValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  /** Traduce una clave. Admite variables: t("explore.results", { n: 12 }). */
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const SUPPORTED = new Set<Lang>(LANGUAGES.map((l) => l.code));

function detectLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.has(saved as Lang)) return saved as Lang;
  } catch {
    /* localStorage puede estar bloqueado */
  }
  const nav = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "es";
  const base = nav.split("-")[0] as Lang;
  return SUPPORTED.has(base) ? base : "es";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* sin persistencia, pero la app sigue funcionando */
    }
  }, []);

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir ?? "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const raw = MESSAGES[lang][key] ?? MESSAGES.es[key] ?? key;
      if (!vars) return raw;
      return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
        vars[name] !== undefined ? String(vars[name]) : match
      );
    },
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  return value;
}
