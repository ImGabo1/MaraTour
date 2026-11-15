import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import "./DictionaryPage.css";
import { useI18n } from "../i18n/I18nProvider";
import type { MessageKey } from "../i18n/messages";
import {
  DICTIONARY,
  DICTIONARY_CATEGORIES,
  dictionaryCategory,
  phraseOfTheDay,
  searchDictionary,
  type DictionaryCategory,
  type DictionaryEntry,
} from "../data/dictionary";
import { IconArrowRight, IconBook, IconClose, IconSearch, IconSparkles, IconStar, IconVolume } from "../components/icons";

function normalized(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Resalta la palabra dentro del ejemplo (sin distinguir tildes ni mayúsculas). */
function highlight(text: string, term: string): ReactNode {
  const clean = term.replace(/[¿?¡!]/g, "").trim();
  if (!clean) return text;
  const index = normalized(text).indexOf(normalized(clean));
  if (index < 0 || normalized(text).length !== text.length) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + clean.length)}</mark>
      {text.slice(index + clean.length)}
    </>
  );
}

/** Diccionario visual del habla maracucha, con búsqueda, temas y pronunciación. */
export function DictionaryPage() {
  const { t } = useI18n();
  const catLabel = (slug: DictionaryCategory) => t(`plan.dcat.${slug}` as MessageKey);
  const catHint = (slug: DictionaryCategory) => t(`plan.dcat.${slug}.hint` as MessageKey);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DictionaryCategory | null>(null);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const phrase = phraseOfTheDay();

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const entry of DICTIONARY) {
      result[entry.category] = (result[entry.category] ?? 0) + 1;
    }
    return result;
  }, []);

  const entries = useMemo(() => {
    const searched = searchDictionary(deferredQuery);
    if (!category) return searched;
    return searched.filter((entry) => entry.category === category);
  }, [deferredQuery, category]);

  const grouped = useMemo(() => {
    if (deferredQuery.trim() || category) return null;
    return DICTIONARY_CATEGORIES.map((definition) => ({
      definition,
      entries: DICTIONARY.filter((entry) => entry.category === definition.slug),
    })).filter((group) => group.entries.length > 0);
  }, [deferredQuery, category]);

  const speak = (entry: DictionaryEntry) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(entry.term.replace(/[¿?¡!]/g, ""));
    utterance.lang = "es-VE";
    utterance.rate = 0.86;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);
    setSpeaking(entry.term);
    synth.speak(utterance);
  };

  return (
    <main className="mtd mt-page-enter">
      <section className="mtd-hero">
        <div className="mt-container">
          <p className="mtd-kicker">
            <IconBook width={15} height={15} />
            {t("plan.dict.kicker")}
          </p>
          <h1 className="mtd-hero__title">
            {t("plan.dict.title1")}<span>{t("plan.dict.title2")}</span>
          </h1>
          <p className="mtd-hero__lead">
            {t("plan.dict.lead", { n: DICTIONARY.length })}
          </p>

          <div className="mtd__search">
            <div className="mtd-search glass glass--pill">
              <IconSearch width={21} height={21} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("plan.dict.placeholder")}
                aria-label={t("plan.dict.searcharia")}
                autoComplete="off"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label={t("plan.dict.clear")}>
                  <IconClose width={16} height={16} />
                </button>
              )}
            </div>
            <div className="mtd__daily">
              <span className="mtd__daily-icon" aria-hidden="true">
                <IconSparkles width={18} height={18} />
              </span>
              <span>
                <small>{t("plan.dict.daily")}</small>
                <strong>“{phrase.term}”</strong>
              </span>
              <button type="button" onClick={() => speak(phrase)} aria-label={t("plan.dict.listen", { term: phrase.term })}>
                <IconVolume width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-container mtd__body">
        <nav className="mtd__categories" aria-label={t("plan.dict.topics")}>
          <button
            type="button"
            className={`mtd__cat${category === null ? " is-active" : ""}`}
            onClick={() => setCategory(null)}
          >
            <span className="mtd__cat-emoji" aria-hidden="true">
              🗣️
            </span>
            <span>
              <strong>{t("plan.dict.all")}</strong>
              <small>{t("plan.dict.az")}</small>
            </span>
            <b>{DICTIONARY.length}</b>
          </button>
          {DICTIONARY_CATEGORIES.map((definition) => (
            <button
              key={definition.slug}
              type="button"
              className={`mtd__cat${category === definition.slug ? " is-active" : ""}`}
              style={{
                ["--from" as string]: definition.from,
                ["--to" as string]: definition.to,
                ["--soft" as string]: definition.soft,
              }}
              onClick={() => setCategory(definition.slug)}
            >
              <span className="mtd__cat-emoji" aria-hidden="true">
                {definition.emoji}
              </span>
              <span>
                <strong>{catLabel(definition.slug)}</strong>
                <small>{catHint(definition.slug)}</small>
              </span>
              <b>{counts[definition.slug] ?? 0}</b>
            </button>
          ))}
        </nav>

        <div className="mtd__content">
          <div className="mtd__bar">
            <div>
              <h2>
                {category
                  ? catLabel(category)
                  : deferredQuery.trim()
                    ? t("plan.dict.resultsfor", { q: deferredQuery.trim() })
                    : t("plan.dict.all")}
              </h2>
              <p role="status" aria-live="polite">
                {entries.length === 1 ? t("plan.dict.word.one") : t("plan.dict.word.many", { n: entries.length })}
                {category && t("plan.dict.intopic")}
              </p>
            </div>
            <span className="mtd__tip">
              <IconVolume width={15} height={15} />
              {t("plan.dict.tip")}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="mtd-empty">
              <span className="mtd-empty__icon" aria-hidden="true">
                <IconSearch width={30} height={30} />
              </span>
              <h2>{t("plan.dict.empty.title")}</h2>
              <p>{t("plan.dict.empty.body")}</p>
              <button
                type="button"
                className="mt-btn mt-btn--primary"
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
              >
                {t("plan.dict.empty.cta")}
                <IconArrowRight width={16} height={16} />
              </button>
            </div>
          ) : grouped ? (
            <div className="mtd__groups">
              {grouped.map((group) => (
                <section key={group.definition.slug} className="mtd__group">
                  <header
                    className="mtd__group-head"
                    style={{
                      ["--from" as string]: group.definition.from,
                      ["--to" as string]: group.definition.to,
                      ["--soft" as string]: group.definition.soft,
                    }}
                  >
                    <span aria-hidden="true">{group.definition.emoji}</span>
                    <div>
                      <h3>{catLabel(group.definition.slug)}</h3>
                      <p>{catHint(group.definition.slug)}</p>
                    </div>
                    <b>{group.entries.length}</b>
                  </header>
                  <div className="mtd__grid">
                    {group.entries.map((entry, index) => (
                      <WordCard
                        key={entry.term}
                        entry={entry}
                        index={index}
                        speaking={speaking === entry.term}
                        onSpeak={speak}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="mtd__grid">
              {entries.map((entry, index) => (
                <WordCard
                  key={entry.term}
                  entry={entry}
                  index={index}
                  speaking={speaking === entry.term}
                  onSpeak={speak}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mtd-section">
        <div className="mt-container">
          <div className="mtd__practice">
            <span className="mtd__practice-icon" aria-hidden="true">
              <IconStar width={26} height={26} />
            </span>
            <div>
              <p className="mtd-kicker">{t("plan.dict.practice.kicker")}</p>
              <h2>{t("plan.dict.practice.title")}</h2>
              <p>
                “{phrase.example}” — {phrase.exampleEnglish}
              </p>
            </div>
            <button type="button" className="mt-btn mt-btn--primary" onClick={() => speak(phrase)}>
              <IconVolume width={17} height={17} />
              {t("plan.dict.practice.cta")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function WordCard({
  entry,
  index,
  speaking,
  onSpeak,
}: {
  entry: DictionaryEntry;
  index: number;
  speaking: boolean;
  onSpeak: (entry: DictionaryEntry) => void;
}) {
  const { t, lang } = useI18n();
  const category = dictionaryCategory(entry.category);
  const accent = category?.from ?? "#0D6B76";

  return (
    <article
      className="mtw mt-reveal"
      style={{
        ["--i" as string]: Math.min(index, 16),
        ["--accent" as string]: accent,
        ["--from" as string]: category?.from ?? "#0D6B76",
        ["--to" as string]: category?.to ?? "#2FAFBE",
        ["--soft" as string]: category?.soft ?? "#E0F3F5",
      }}
    >
      <header className="mtw__head">
        <span className="mtw__initial" aria-hidden="true">
          {entry.term.replace(/[¿?¡!“"«\s]/g, "").charAt(0).toUpperCase()}
        </span>
        <div>
          <span className="mtw__type">{t(`plan.dict.type.${entry.type}` as MessageKey)}</span>
          <h3 className="mtw__term">{entry.term}</h3>
          <p className="mtw__pron">{entry.pronunciation}</p>
        </div>
        <button
          type="button"
          className={`mtw__sound${speaking ? " is-speaking" : ""}`}
          onClick={() => onSpeak(entry)}
          aria-label={t("plan.dict.listen", { term: entry.term })}
          aria-pressed={speaking}
        >
          <IconVolume width={17} height={17} />
        </button>
      </header>

      <p className="mtw__meaning">{lang === "en" ? entry.english : entry.meaning}</p>
      {lang !== "en" && (
        <p className="mtw__english">
          <span>EN</span>
          {entry.english}
        </p>
      )}

      <blockquote className="mtw__example">
        <p>{highlight(entry.example, entry.term)}</p>
        <span>{entry.exampleEnglish}</span>
      </blockquote>

      {entry.usage && (
        <p className="mtw__usage">
          <IconSparkles width={14} height={14} />
          {entry.usage}
        </p>
      )}

      <footer className="mtw__footer">
        <span className="mtw__cat">
          <span aria-hidden="true">{category?.emoji ?? "💬"}</span>
          {category ? t(`plan.dcat.${category.slug}` as MessageKey) : entry.category}
        </span>
        <span className="mtw__tags">
          {entry.tags.slice(0, 2).map((tag) => (
            <span key={tag}>#{normalized(tag)}</span>
          ))}
        </span>
      </footer>
    </article>
  );
}
