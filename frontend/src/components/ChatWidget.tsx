import "./ChatWidget.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryBySlug, type CategorySlug } from "../data/categories";
import { findDictionaryTerm, searchDictionary } from "../data/dictionary";
import { foodForMoment } from "../data/food";
import type { Page } from "../hooks/usePageRoute";
import { useI18n } from "../i18n/I18nProvider";
import type { MessageKey } from "../i18n/messages";
import { useModal } from "../hooks/useModal";
import { primaryCategory } from "../lib/places";
import { popularityScore } from "../lib/popularity";
import type { Place } from "../types";
import { IconClose, IconSend, IconSparkles } from "./icons";

type Action = { label: string; key?: MessageKey; page?: Page; slug?: string };

const act = (key: MessageKey, page: Page, t: (key: MessageKey) => string): Action => ({ label: t(key), key, page });

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  actions?: Action[];
}

interface Props {
  places: readonly Place[];
  onClose: () => void;
  onOpenPlace: (slug: string) => void;
  onNavigate: (page: Page) => void;
}

/** `query` es la consulta en español que entiende el motor de reglas; `key` es lo que ve la persona. */
const QUICK_REPLIES: readonly { key: MessageKey; query: string }[] = [
  { key: "shell.chat.q1", query: "¿Qué hago en un día?" },
  { key: "shell.chat.q2", query: "Quiero comer algo típico" },
  { key: "shell.chat.q3", query: "¿Qué significa «naguará»?" },
  { key: "shell.chat.q4", query: "Lugares con 360°" },
  { key: "shell.chat.q5", query: "¿Cómo me muevo por la ciudad?" },
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function topPlaces(places: readonly Place[], category: CategorySlug, limit = 3): Place[] {
  return [...places]
    .filter((place) => primaryCategory(place) === category)
    .sort((a, b) => popularityScore(b.slug) - popularityScore(a.slug))
    .slice(0, limit);
}

function placeActions(places: readonly Place[]): Action[] {
  return places.slice(0, 3).map((place) => ({ label: place.name, slug: place.slug }));
}

/** Asistente local basado en reglas: responde con los datos reales de la app, sin API externa. */
export function ChatWidget({ places, onClose, onOpenPlace, onNavigate }: Props) {
  const { t } = useI18n();
  const [sent, setSent] = useState<Message[]>([]);
  const messages = useMemo<Message[]>(
    () => [{ id: "welcome", from: "bot", text: t("shell.chat.greeting") }, ...sent],
    [sent, t]
  );
  const [input, setInput] = useState("");
  const focusRef = useModal<HTMLInputElement>(onClose);
  const bottomRef = useRef<HTMLDivElement>(null);

  const greetingActions = useMemo<Action[]>(
    () => [
      act("shell.chat.aPlan", "plan", t),
      act("shell.chat.aPlaces", "explorar", t),
      act("shell.chat.aDict", "diccionario", t),
    ],
    [t]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const reply = (text: string): { text: string; actions?: Action[] } => {
    const needle = normalize(text);
    const words = needle.split(/\s+/).filter(Boolean);

    if (/^(hola|buenas|epale|saludos|hey|hello)\b/.test(needle) || needle.length < 3) {
      return {
        text: t("shell.chat.hello"),
        actions: greetingActions,
      };
    }

    if (/(gracias|mil gracias|thanks)/.test(needle)) {
      return {
        text: t("shell.chat.thanks"),
        actions: [act("shell.chat.aRoute", "mi-ruta", t)],
      };
    }

    if (/(360|panoram|girar|recorrido virtual)/.test(needle)) {
      const pano = places.filter((place) => place.panoUrl).slice(0, 3);
      return {
        text:
          pano.length > 0
            ? t("shell.chat.pano", { button: t("sheet.pano") })
            : t("shell.chat.noPano"),
        actions: [...placeActions(pano), act("shell.chat.aExploreAll", "explorar", t)],
      };
    }

    if (/(comer|comida|arepa|patacon|tequeno|mandoca|dulce|cocada|chicha|restaurante|almuerzo|cena|desayuno|marisco|pescado)/.test(needle)) {
      const lunch = foodForMoment("almuerzo", "todos", "$$", 1);
      const sweet = foodForMoment("dulce", "todos", "$$", 2);
      const foodPlaces = topPlaces(places, "gastronomia", 2);
      return {
        text: t("shell.chat.food", { dish: lunch.dish, description: lunch.description, where: lunch.where, sweet: sweet.dish }),
        actions: [...placeActions(foodPlaces), act("shell.chat.aFlavors", "diccionario", t)],
      };
    }

    if (/(transporte|taxi|metro|autobus|bus|mover|llegar|por puesto|mototaxi|uber)/.test(needle)) {
      return {
        text: t("shell.chat.transport"),
        actions: [act("shell.chat.aStreet", "diccionario", t), act("shell.chat.aExplore", "explorar", t)],
      };
    }

    if (/(seguridad|peligro|cuidado|robar|inseguro)/.test(needle)) {
      return {
        text: t("shell.chat.safety"),
        actions: [act("shell.chat.aTips", "plan", t)],
      };
    }

    if (/(calor|sol|clima|lluvia|protector|agua)/.test(needle)) {
      return {
        text: t("shell.chat.sun"),
        actions: [act("shell.chat.aPauses", "plan", t)],
      };
    }

    if (/(plan|itinerario|ruta|recorrido|dias|dia|agenda|fin de semana|que hago)/.test(needle)) {
      return {
        text: t("shell.chat.plan"),
        actions: [act("shell.chat.aPlanner", "plan", t), act("shell.chat.aSeeRoute", "mi-ruta", t)],
      };
    }

    if (/(diccionario|significa|significado|palabra|frase|maracucho|zuliano|que es|que quiere decir)/.test(needle)) {
      const quoted = /[«"“']([^»"”']+)[»"”']/.exec(text)?.[1];
      const entry =
        (quoted ? findDictionaryTerm(quoted) : null) ??
        findDictionaryTerm(text.replace(/.*(significa|que es|qué es|quiere decir)/i, "")) ??
        searchDictionary(text).find((item) => item.term.length > 2);
      if (entry) {
        return {
          text: t("shell.chat.dict", {
            term: entry.term,
            pronunciation: entry.pronunciation,
            meaning: entry.meaning,
            english: entry.english,
            example: entry.example,
          }),
          actions: [act("shell.chat.aSeeDict", "diccionario", t)],
        };
      }
      return {
        text: t("shell.chat.noWord"),
        actions: [act("shell.chat.aDict", "diccionario", t)],
      };
    }

    const direct = places.find((place) => {
      const name = normalize(place.name);
      return words.length > 0 && (name.includes(needle) || needle.includes(name));
    });
    if (direct) {
      return {
        text: t("shell.chat.place", { name: direct.name, description: direct.shortDescription, address: direct.address }),
        actions: [
          { label: t("shell.chat.aSheet"), key: "shell.chat.aSheet", slug: direct.slug },
          { label: t("shell.chat.aHowTo"), key: "shell.chat.aHowTo", slug: direct.slug },
        ],
      };
    }

    const categoryMatchers: readonly { pattern: RegExp; slug: CategorySlug; intro: MessageKey }[] = [
      { pattern: /(lago|malecon|atardecer|agua)/, slug: "lago", intro: "shell.chat.catLake" },
      { pattern: /(iglesia|fe|virgen|chinita|basilica)/, slug: "fe", intro: "shell.chat.catFaith" },
      { pattern: /(museo|arte|cultura|teatro)/, slug: "cultura", intro: "shell.chat.catCulture" },
      { pattern: /(plaza|parque|familia|ninos)/, slug: "plazas", intro: "shell.chat.catSquares" },
      { pattern: /(historia|patrimonio|monumento|centro)/, slug: "historia", intro: "shell.chat.catHistory" },
      { pattern: /(noche|fiesta|bar|musica|rumba|gaita)/, slug: "noche", intro: "shell.chat.catNight" },
      { pattern: /(compras|mercado|artesania|recuerdo)/, slug: "compras", intro: "shell.chat.catShopping" },
      { pattern: /(naturaleza|verde|arbol|paseo)/, slug: "naturaleza", intro: "shell.chat.catNature" },
      { pattern: /(deporte|estadio|futbol|beisbol)/, slug: "deportes", intro: "shell.chat.catSports" },
    ];

    for (const matcher of categoryMatchers) {
      if (!matcher.pattern.test(needle)) continue;
      const list = topPlaces(places, matcher.slug, 3);
      if (list.length === 0) continue;
      const category = categoryBySlug(matcher.slug);
      return {
        text: t("shell.chat.cat", { intro: t(matcher.intro), list: list.map((place) => place.name).join(", "), blurb: category?.blurb ?? "" }),
        actions: [...placeActions(list), act("shell.chat.aMore", "explorar", t)],
      };
    }

    if (/(que hacer|recomienda|recomiendame|lugar|donde ir|visitar|conocer|turismo)/.test(needle)) {
      const list = [...places].sort((a, b) => popularityScore(b.slug) - popularityScore(a.slug)).slice(0, 3);
      return {
        text: t("shell.chat.top"),
        actions: [...placeActions(list), act("shell.chat.aExploreAll", "explorar", t)],
      };
    }

    return {
      text: t("shell.chat.fallback"),
      actions: [act("shell.chat.aPlan", "plan", t), act("shell.chat.aPlaces", "explorar", t)],
    };
  };

  const send = (value = input, shown?: string) => {
    const text = value.trim();
    if (!text) return;
    const answer = reply(text);
    setSent((current) => [
      ...current,
      { id: `u-${Date.now()}`, from: "user", text: shown ?? text },
      { id: `b-${Date.now()}`, from: "bot", text: answer.text, actions: answer.actions },
    ]);
    setInput("");
  };

  const runAction = (action: Action) => {
    onClose();
    if (action.slug) {
      onOpenPlace(action.slug);
      return;
    }
    if (action.page) onNavigate(action.page);
  };

  return (
    <div className="mtz" role="dialog" aria-modal="true" aria-labelledby="chat-title">
      <div className="mtz__backdrop" onClick={onClose} />
      <section className="mtz__panel glass glass--strong">
        <header className="mtz__head">
          <span className="mtz__avatar" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="28" height="28" fill="none">
              <g stroke="#E0A21B" strokeWidth="2.4" strokeLinecap="round">
                {Array.from({ length: 8 }, (_, i) => (
                  <line key={i} x1="20" y1="3" x2="20" y2="8" transform={`rotate(${i * 45} 20 20)`} />
                ))}
              </g>
              <circle cx="20" cy="20" r="9" fill="#FFC83D" />
            </svg>
          </span>
          <div className="mtz__identity">
            <h2 id="chat-title">Zulmita</h2>
            <p>
              <span className="mtz__dot" aria-hidden="true" />
              {t("shell.chat.status")}
            </p>
          </div>
          <button type="button" className="mtz__close mt-press" onClick={onClose} aria-label={t("shell.chat.close")}>
            <IconClose width={19} height={19} />
          </button>
        </header>

        <div className="mtz__messages" role="log" aria-live="polite" aria-label={t("shell.chat.logAria")}>
          {messages.map((message) => (
            <div key={message.id} className={`mtz__row mtz__row--${message.from}`}>
              {message.from === "bot" && (
                <span className="mtz__mini-avatar" aria-hidden="true">
                  <IconSparkles width={14} height={14} />
                </span>
              )}
              <div className={`mtz__bubble mtz__bubble--${message.from}`}>
                <p>{message.text}</p>
                {message.actions && message.actions.length > 0 && (
                  <div className="mtz__actions">
                    {message.actions.map((action) => (
                      <button key={`${message.id}-${action.label}`} type="button" onClick={() => runAction(action)}>
                        {action.key ? t(action.key) : action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mtz__quick" aria-label={t("shell.chat.quickAria")}>
          {QUICK_REPLIES.map((prompt) => (
            <button key={prompt.key} type="button" onClick={() => send(prompt.query, t(prompt.key))}>
              {t(prompt.key)}
            </button>
          ))}
        </div>

        <form
          className="mtz__form"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          <input
            ref={focusRef}
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("shell.chat.placeholder")}
            aria-label={t("shell.chat.inputAria")}
            autoComplete="off"
          />
          <button type="submit" className="mtz__send mt-press" aria-label={t("shell.chat.send")} disabled={!input.trim()}>
            <IconSend width={18} height={18} />
          </button>
        </form>
        <p className="mtz__note">{t("shell.chat.note")}</p>
      </section>
    </div>
  );
}
