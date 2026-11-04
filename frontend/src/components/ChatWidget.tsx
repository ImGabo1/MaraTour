import { useEffect, useMemo, useRef, useState } from "react";
import { categoryBySlug, type CategorySlug } from "../data/categories";
import { findDictionaryTerm, searchDictionary } from "../data/dictionary";
import { foodForMoment } from "../data/food";
import type { Page } from "../hooks/usePageRoute";
import { useModal } from "../hooks/useModal";
import { primaryCategory } from "../lib/places";
import { popularityScore } from "../lib/popularity";
import type { Place } from "../types";
import { IconChat, IconClose, IconSend, IconSparkles } from "./icons";

type Action = { label: string; page?: Page; slug?: string };

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

const QUICK_REPLIES = [
  "¿Qué hago en un día?",
  "Quiero comer algo típico",
  "¿Qué significa «naguará»?",
  "Lugares con 360°",
  "¿Cómo me muevo por la ciudad?",
];

const GREETING =
  "¡Epale! Soy Zulmita, tu guía maracucha. Pregúntame por lugares, comida, palabras de la calle, transporte o por un plan completo. ¿Qué te provoca hoy?";

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
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", from: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const focusRef = useModal<HTMLInputElement>(onClose);
  const bottomRef = useRef<HTMLDivElement>(null);

  const greetingActions = useMemo<Action[]>(
    () => [
      { label: "Armar un plan", page: "plan" },
      { label: "Ver lugares", page: "explorar" },
      { label: "Abrir diccionario", page: "diccionario" },
    ],
    []
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const reply = (text: string): { text: string; actions?: Action[] } => {
    const needle = normalize(text);
    const words = needle.split(/\s+/).filter(Boolean);

    if (/^(hola|buenas|epale|saludos|hey|hello)\b/.test(needle) || needle.length < 3) {
      return {
        text: "¡Buenas! Cuéntame qué necesitas: un lugar, un plato, una palabra o un plan para hoy.",
        actions: greetingActions,
      };
    }

    if (/(gracias|mil gracias|thanks)/.test(needle)) {
      return {
        text: "¡A la orden! Cuando quieras seguimos armando tu recorrido. Nos vemos en Maracaibo.",
        actions: [{ label: "Abrir Mi ruta", page: "mi-ruta" }],
      };
    }

    if (/(360|panoram|girar|recorrido virtual)/.test(needle)) {
      const pano = places.filter((place) => place.panoUrl).slice(0, 3);
      return {
        text:
          pano.length > 0
            ? "La vista 360° es opcional y vive dentro de la ficha. Abre uno de estos lugares y toca «Ver en 360°» cuando quieras girar la panorámica."
            : "Por ahora no hay panorámicas cargadas, pero cada ficha sigue mostrando historia, mapa y datos para llegar.",
        actions: [...placeActions(pano), { label: "Explorar todo", page: "explorar" }],
      };
    }

    if (/(comer|comida|arepa|patacon|tequeno|mandoca|dulce|cocada|chicha|restaurante|almuerzo|cena|desayuno|marisco|pescado)/.test(needle)) {
      const lunch = foodForMoment("almuerzo", "todos", "$$", 1);
      const sweet = foodForMoment("dulce", "todos", "$$", 2);
      const foodPlaces = topPlaces(places, "gastronomia", 2);
      return {
        text: `Para probar Maracaibo te recomiendo ${lunch.dish}: ${lunch.description} Lo consigues en ${lunch.where}. Y si quieres un dulce, busca ${sweet.dish}.`,
        actions: [...placeActions(foodPlaces), { label: "Diccionario de sabores", page: "diccionario" }],
      };
    }

    if (/(transporte|taxi|metro|autobus|bus|mover|llegar|por puesto|mototaxi|uber)/.test(needle)) {
      return {
        text:
          "Para moverte: el metro cubre el centro y zonas cercanas; los «por puesto» son taxis compartidos con ruta fija y los mototaxis sirven para trayectos cortos. Pregunta el precio antes de subir y evita horas pico.",
        actions: [
          { label: "Ver palabras de calle", page: "diccionario" },
          { label: "Explorar lugares", page: "explorar" },
        ],
      };
    }

    if (/(seguridad|peligro|cuidado|robar|inseguro)/.test(needle)) {
      return {
        text:
          "Como en cualquier ciudad grande, usa el sentido común: lleva lo necesario, evita mostrar objetos de valor, muévete en zonas conocidas y pregunta en tu alojamiento por rutas seguras. Maracaibo es cálida y su gente ayuda mucho.",
        actions: [{ label: "Ver tips de viaje", page: "plan" }],
      };
    }

    if (/(calor|sol|clima|lluvia|protector|agua)/.test(needle)) {
      return {
        text:
          "El sol de Maracaibo pega fuerte. Lleva agua, protector solar, gorra y ropa fresca; camina temprano o al atardecer y aprovecha las sombras de plazas y museos.",
        actions: [{ label: "Armar un plan con pausas", page: "plan" }],
      };
    }

    if (/(plan|itinerario|ruta|recorrido|dias|dia|agenda|fin de semana|que hago)/.test(needle)) {
      return {
        text:
          "Puedo armarte un plan completo en segundos: eliges días, compañía, ritmo, intereses y presupuesto, y te propongo lugares, comidas y tips. También puedes guardarlo en Mi ruta.",
        actions: [
          { label: "Abrir planificador", page: "plan" },
          { label: "Ver Mi ruta", page: "mi-ruta" },
        ],
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
          text: `«${entry.term}» se pronuncia ${entry.pronunciation}. Significa: ${entry.meaning} En inglés: ${entry.english}. Ejemplo: “${entry.example}”`,
          actions: [{ label: "Ver en el diccionario", page: "diccionario" }],
        };
      }
      return {
        text:
          "Esa palabra no la tengo todavía. Abre el diccionario y busca por tema: saludos, conversación, sabores, calle, dinero o fiesta. Seguro encuentras algo parecido.",
        actions: [{ label: "Abrir diccionario", page: "diccionario" }],
      };
    }

    const direct = places.find((place) => {
      const name = normalize(place.name);
      return words.length > 0 && (name.includes(needle) || needle.includes(name));
    });
    if (direct) {
      return {
        text: `${direct.name}: ${direct.shortDescription} Está en ${direct.address}. Puedo abrirte la ficha completa con su historia, mapa y la opción de verlo en 360°.`,
        actions: [
          { label: "Ver ficha", slug: direct.slug },
          { label: "Cómo llegar", slug: direct.slug },
        ],
      };
    }

    const categoryMatchers: readonly { pattern: RegExp; slug: CategorySlug; intro: string }[] = [
      { pattern: /(lago|malecon|atardecer|agua)/, slug: "lago", intro: "Para el lago y los atardeceres" },
      { pattern: /(iglesia|fe|virgen|chinita|basilica)/, slug: "fe", intro: "Para la fe y la tradición" },
      { pattern: /(museo|arte|cultura|teatro)/, slug: "cultura", intro: "Para el arte y la cultura" },
      { pattern: /(plaza|parque|familia|ninos)/, slug: "plazas", intro: "Para caminar y compartir" },
      { pattern: /(historia|patrimonio|monumento|centro)/, slug: "historia", intro: "Para la historia de la ciudad" },
      { pattern: /(noche|fiesta|bar|musica|rumba|gaita)/, slug: "noche", intro: "Para la noche maracucha" },
      { pattern: /(compras|mercado|artesania|recuerdo)/, slug: "compras", intro: "Para llevarte un recuerdo" },
      { pattern: /(naturaleza|verde|arbol|paseo)/, slug: "naturaleza", intro: "Para respirar aire libre" },
      { pattern: /(deporte|estadio|futbol|beisbol)/, slug: "deportes", intro: "Para la pasión deportiva" },
    ];

    for (const matcher of categoryMatchers) {
      if (!matcher.pattern.test(needle)) continue;
      const list = topPlaces(places, matcher.slug, 3);
      if (list.length === 0) continue;
      const category = categoryBySlug(matcher.slug);
      return {
        text: `${matcher.intro}, te recomiendo: ${list.map((place) => place.name).join(", ")}. ${category?.blurb ?? ""}`,
        actions: [...placeActions(list), { label: "Ver más", page: "explorar" }],
      };
    }

    if (/(que hacer|recomienda|recomiendame|lugar|donde ir|visitar|conocer|turismo)/.test(needle)) {
      const list = [...places].sort((a, b) => popularityScore(b.slug) - popularityScore(a.slug)).slice(0, 3);
      return {
        text: "Si es tu primera vez, empieza por estos imperdibles. Puedo abrirte la ficha de cualquiera y contarte su historia.",
        actions: [...placeActions(list), { label: "Explorar todo", page: "explorar" }],
      };
    }

    return {
      text:
        "No estoy segura de haber entendido. Prueba con algo como «quiero comer», «lugares con 360°», «¿qué significa pana?» o «arma un plan de dos días».",
      actions: [
        { label: "Armar un plan", page: "plan" },
        { label: "Ver lugares", page: "explorar" },
      ],
    };
  };

  const send = (value = input) => {
    const text = value.trim();
    if (!text) return;
    const answer = reply(text);
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, from: "user", text },
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
    <div className="vm-chat" role="dialog" aria-modal="true" aria-labelledby="chat-title">
      <div className="vm-chat__backdrop" onClick={onClose} />
      <section className="vm-chat__panel">
        <header className="vm-chat__head">
          <span className="vm-chat__avatar" aria-hidden="true">
            <IconChat width={21} height={21} />
          </span>
          <div className="vm-chat__identity">
            <h2 id="chat-title">Zulmita</h2>
            <p>
              <span className="vm-chat__dot" aria-hidden="true" />
              Guía local · en línea
            </p>
          </div>
          <button type="button" className="vm-chat__close" onClick={onClose} aria-label="Cerrar chat">
            <IconClose width={19} height={19} />
          </button>
        </header>

        <div className="vm-chat__messages">
          {messages.map((message) => (
            <div key={message.id} className={`vm-chat__row vm-chat__row--${message.from}`}>
              {message.from === "bot" && (
                <span className="vm-chat__mini-avatar" aria-hidden="true">
                  <IconSparkles width={14} height={14} />
                </span>
              )}
              <div className={`vm-chat__bubble vm-chat__bubble--${message.from}`}>
                <p>{message.text}</p>
                {message.actions && message.actions.length > 0 && (
                  <div className="vm-chat__actions">
                    {message.actions.map((action) => (
                      <button key={`${message.id}-${action.label}`} type="button" onClick={() => runAction(action)}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="vm-chat__quick" aria-label="Preguntas rápidas">
          {QUICK_REPLIES.map((prompt) => (
            <button key={prompt} type="button" onClick={() => send(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form
          className="vm-chat__form"
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
            placeholder="Escribe tu duda…"
            aria-label="Escribe tu duda"
            autoComplete="off"
          />
          <button type="submit" aria-label="Enviar mensaje" disabled={!input.trim()}>
            <IconSend width={18} height={18} />
          </button>
        </form>
        <p className="vm-chat__note">Respuestas locales basadas en los datos de la app. Verifica horarios antes de salir.</p>
      </section>
    </div>
  );
}
