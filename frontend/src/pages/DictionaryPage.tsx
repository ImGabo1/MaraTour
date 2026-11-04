import { useDeferredValue, useMemo, useState } from "react";
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

/** Diccionario visual del habla maracucha, con búsqueda, temas y pronunciación. */
export function DictionaryPage() {
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
    <main className="vm-page vm-dictionary">
      <section className="vm-page-hero vm-page-hero--dictionary">
        <div className="container">
          <p className="vm-kicker">
            <IconBook width={15} height={15} />
            Diccionario maracucho
          </p>
          <h1 className="vm-page-hero__title">
            Habla como un <span>maracucho</span>
          </h1>
          <p className="vm-page-hero__lead">
            {DICTIONARY.length} palabras y expresiones de la calle, la mesa y la fiesta. Cada ficha
            trae pronunciación, significado, ejemplo y su traducción al inglés.
          </p>

          <div className="vm-dictionary__search">
            <div className="vm-search vm-search--large">
              <IconSearch width={21} height={21} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca «naguará», «pana», «patacón»…"
                aria-label="Buscar en el diccionario"
                autoComplete="off"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Borrar búsqueda">
                  <IconClose width={16} height={16} />
                </button>
              )}
            </div>
            <div className="vm-dictionary__daily">
              <span className="vm-dictionary__daily-icon" aria-hidden="true">
                <IconSparkles width={18} height={18} />
              </span>
              <span>
                <small>Frase del día</small>
                <strong>“{phrase.term}”</strong>
              </span>
              <button type="button" onClick={() => speak(phrase)} aria-label={`Escuchar ${phrase.term}`}>
                <IconVolume width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container vm-dictionary__body">
        <nav className="vm-dictionary__categories" aria-label="Temas del diccionario">
          <button
            type="button"
            className={`vm-dictionary__cat${category === null ? " is-active" : ""}`}
            onClick={() => setCategory(null)}
          >
            <span className="vm-dictionary__cat-emoji" aria-hidden="true">
              🗣️
            </span>
            <span>
              <strong>Todas las palabras</strong>
              <small>De la A a la Z</small>
            </span>
            <b>{DICTIONARY.length}</b>
          </button>
          {DICTIONARY_CATEGORIES.map((definition) => (
            <button
              key={definition.slug}
              type="button"
              className={`vm-dictionary__cat${category === definition.slug ? " is-active" : ""}`}
              style={{
                ["--from" as string]: definition.from,
                ["--to" as string]: definition.to,
                ["--soft" as string]: definition.soft,
              }}
              onClick={() => setCategory(definition.slug)}
            >
              <span className="vm-dictionary__cat-emoji" aria-hidden="true">
                {definition.emoji}
              </span>
              <span>
                <strong>{definition.label}</strong>
                <small>{definition.hint}</small>
              </span>
              <b>{counts[definition.slug] ?? 0}</b>
            </button>
          ))}
        </nav>

        <div className="vm-dictionary__content">
          <div className="vm-dictionary__bar">
            <div>
              <h2>
                {category
                  ? dictionaryCategory(category)?.label
                  : deferredQuery.trim()
                    ? `Resultados para “${deferredQuery.trim()}”`
                    : "Todas las palabras"}
              </h2>
              <p>
                {entries.length === 1 ? "1 palabra" : `${entries.length} palabras`}
                {category && " en este tema"}
              </p>
            </div>
            <span className="vm-dictionary__tip">
              <IconVolume width={15} height={15} />
              Toca el altavoz para escuchar
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="vm-empty">
              <span className="vm-empty__icon" aria-hidden="true">
                <IconSearch width={30} height={30} />
              </span>
              <h2>Esa palabra no está todavía</h2>
              <p>Prueba con otra palabra o cambia de tema. El diccionario crece con la ciudad.</p>
              <button
                type="button"
                className="vm-btn vm-btn--primary"
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
              >
                Ver todas las palabras
                <IconArrowRight width={16} height={16} />
              </button>
            </div>
          ) : grouped ? (
            <div className="vm-dictionary__groups">
              {grouped.map((group) => (
                <section key={group.definition.slug} className="vm-dictionary__group">
                  <header
                    className="vm-dictionary__group-head"
                    style={{
                      ["--from" as string]: group.definition.from,
                      ["--to" as string]: group.definition.to,
                      ["--soft" as string]: group.definition.soft,
                    }}
                  >
                    <span aria-hidden="true">{group.definition.emoji}</span>
                    <div>
                      <h3>{group.definition.label}</h3>
                      <p>{group.definition.hint}</p>
                    </div>
                    <b>{group.entries.length}</b>
                  </header>
                  <div className="vm-dictionary__grid">
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
            <div className="vm-dictionary__grid">
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

      <section className="vm-section">
        <div className="container">
          <div className="vm-dictionary__practice">
            <span className="vm-dictionary__practice-icon" aria-hidden="true">
              <IconStar width={26} height={26} />
            </span>
            <div>
              <p className="vm-kicker">Ponte a prueba</p>
              <h2>Una frase para entrar en confianza</h2>
              <p>
                “{phrase.example}” — {phrase.exampleEnglish}
              </p>
            </div>
            <button type="button" className="vm-btn vm-btn--primary" onClick={() => speak(phrase)}>
              <IconVolume width={17} height={17} />
              Escuchar la frase
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
  const category = dictionaryCategory(entry.category);
  const accent = category?.from ?? "#0D6B76";

  return (
    <article
      className="vm-word reveal"
      style={{
        ["--i" as string]: Math.min(index, 16),
        ["--accent" as string]: accent,
        ["--from" as string]: category?.from ?? "#0D6B76",
        ["--to" as string]: category?.to ?? "#2FAFBE",
        ["--soft" as string]: category?.soft ?? "#E0F3F5",
      }}
    >
      <header className="vm-word__head">
        <div>
          <span className="vm-word__type">{entry.type}</span>
          <h3 className="vm-word__term">{entry.term}</h3>
          <p className="vm-word__pron">{entry.pronunciation}</p>
        </div>
        <button
          type="button"
          className={`vm-word__sound${speaking ? " is-speaking" : ""}`}
          onClick={() => onSpeak(entry)}
          aria-label={`Escuchar ${entry.term}`}
          aria-pressed={speaking}
        >
          <IconVolume width={17} height={17} />
        </button>
      </header>

      <p className="vm-word__meaning">{entry.meaning}</p>
      <p className="vm-word__english">
        <span>EN</span>
        {entry.english}
      </p>

      <blockquote className="vm-word__example">
        <p>{entry.example}</p>
        <span>{entry.exampleEnglish}</span>
      </blockquote>

      {entry.usage && (
        <p className="vm-word__usage">
          <IconSparkles width={14} height={14} />
          {entry.usage}
        </p>
      )}

      <footer className="vm-word__footer">
        <span className="vm-word__cat">
          <span aria-hidden="true">{category?.emoji ?? "💬"}</span>
          {category?.label ?? entry.category}
        </span>
        <span className="vm-word__tags">
          {entry.tags.slice(0, 2).map((tag) => (
            <span key={tag}>#{normalized(tag)}</span>
          ))}
        </span>
      </footer>
    </article>
  );
}
