import { useMemo, useState } from "react";
import { FEATURED_CATEGORY_SLUGS, categoryBySlug, type CategorySlug } from "../data/categories";
import { phraseOfTheDay } from "../data/dictionary";
import { profileFor } from "../data/placeProfiles";
import { WELCOME_SLIDES } from "../data/welcome";
import type { Page } from "../hooks/usePageRoute";
import { useI18n } from "../i18n/I18nProvider";
import { countByCategory, sortPlaces } from "../lib/places";
import type { Place } from "../types";
import { HomeCarousel } from "../components/HomeCarousel";
import { PlaceCard, PlaceCardSkeleton, PlaceGrid } from "../components/PlaceCard";
import "./HomePage.css";
import { PlaceEmblem } from "../components/PlaceEmblem";
import {
  CategoryIcon,
  IconArrowRight,
  IconBook,
  IconBridge,
  IconBulb,
  IconChat,
  IconCompass,
  IconHeart,
  IconRotate,
  IconSearch,
  IconSparkles,
  IconSun,
  IconWallet,
} from "../components/icons";

interface Props {
  places: readonly Place[];
  saved: readonly string[];
  loading: boolean;
  onOpenPlace: (slug: string) => void;
  onToggleSave: (slug: string) => void;
  onNavigate: (page: Page) => void;
  onOpenCategory: (category: CategorySlug) => void;
  onSearch: (query: string) => void;
  onOpenChat: () => void;
}

const QUICK_ACTIONS: readonly {
  title: string;
  text: string;
  page: Page;
  icon: typeof IconCompass;
  tone: string;
}[] = [
  {
    title: "Explorar lugares",
    text: "43 rincones entre plazas, sabores, museos y lago.",
    page: "explorar",
    icon: IconCompass,
    tone: "sky",
  },
  {
    title: "Armar mi plan",
    text: "Dime cuántos días tienes y con quién viajas.",
    page: "plan",
    icon: IconSparkles,
    tone: "sun",
  },
  {
    title: "Hablar maracucho",
    text: "74 palabras y expresiones para no perderte nada.",
    page: "diccionario",
    icon: IconBook,
    tone: "coral",
  },
  {
    title: "Mi ruta guardada",
    text: "Tus lugares favoritos, listos para compartir.",
    page: "mi-ruta",
    icon: IconHeart,
    tone: "rose",
  },
];

const ROUTE_IDEAS: readonly {
  title: string;
  days: string;
  vibe: string;
  text: string;
  slugs: readonly string[];
  tone: "sky" | "sun" | "coral";
}[] = [
  {
    title: "Un día clásico en el centro",
    days: "1 día · mañana y tarde",
    vibe: "Historia + fe + café",
    text: "Empieza por la Basílica, camina la Calle Carabobo y termina con café frente a la Plaza Baralt.",
    slugs: ["basilica-chiquinquira", "calle-carabobo", "plaza-baralt", "teatro-baralt"],
    tone: "sky",
  },
  {
    title: "Tarde de lago y sabores",
    days: "1 tarde · desde las 4 pm",
    vibe: "Atardecer + cena",
    text: "La Vereda del Lago para ver caer el sol y luego una parrilla en Bella Vista para cerrar el día.",
    slugs: ["vereda-del-lago", "paseo-del-lago", "mi-vaquita", "calle-72-bella-vista"],
    tone: "sun",
  },
  {
    title: "Maracaibo en familia",
    days: "1 día completo",
    vibe: "Verde + dulces + cine",
    text: "Jardín Botánico por la mañana, ruta de dulces en Santa Lucía y una película para bajar el calor.",
    slugs: ["jardin-botanico-maracaibo", "ruta-dulces-santa-lucia", "galerias-mall", "parque-universitario-luz"],
    tone: "coral",
  },
];

export function HomePage({
  places,
  saved,
  loading,
  onOpenPlace,
  onToggleSave,
  onNavigate,
  onOpenCategory,
  onSearch,
  onOpenChat,
}: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const highlights = useMemo(() => sortPlaces(places, "popular").slice(0, 6), [places]);
  const savedSet = useMemo(() => new Set(saved), [saved]);
  const phrase = phraseOfTheDay();
  const categoryCounts = useMemo(() => countByCategory(places), [places]);
  const placeBySlug = useMemo(() => new Map(places.map((place) => [place.slug, place])), [places]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
    onNavigate("explorar");
  };

  return (
    <main className="mth-home mt-page-enter">
      {/* ===== Portada ===== */}
      <section className="mth-hero">
        <div className="mth-hero__art" aria-hidden="true">
          <svg className="mth-hero__sun" viewBox="0 0 240 240" fill="none">
            <defs>
              <radialGradient id="mthSun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF3C4" />
                <stop offset="60%" stopColor="#FFC83D" />
                <stop offset="100%" stopColor="#E0A21B" />
              </radialGradient>
              <radialGradient id="mthAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFE08A" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FFE08A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="120" r="118" fill="url(#mthAura)" />
            <g stroke="#FFC83D" strokeWidth="6" strokeLinecap="round">
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1="120" y1="22" x2="120" y2="40" transform={`rotate(${i * 30} 120 120)`} />
              ))}
            </g>
            <circle cx="120" cy="120" r="62" fill="url(#mthSun)" />
          </svg>
          <svg className="mth-hero__bridge" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" fill="none">
            <g stroke="currentColor" strokeLinecap="round">
              <path d="M0 150 H1200" strokeWidth="5" />
              <path d="M200 150 L238 30 H262 L300 150" strokeWidth="5" />
              <path d="M520 150 L568 10 H632 L680 150" strokeWidth="6" />
              <path d="M900 150 L938 30 H962 L1000 150" strokeWidth="5" />
              <g strokeWidth="1.5">
                {[-120, -80, -40, 40, 80, 120].map((d) => (
                  <g key={d}>
                    <path d={`M600 14 L${600 + d * 2.2} 148`} />
                    <path d={`M250 34 L${250 + d * 1.4} 148`} />
                    <path d={`M950 34 L${950 + d * 1.4} 148`} />
                  </g>
                ))}
              </g>
            </g>
          </svg>
          <svg className="mth-hero__wave" viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0 40 C240 90 480 0 720 40 S1200 80 1440 30 V80 H0 Z" fill="var(--mt-bg)" />
          </svg>
        </div>

        <div className="mt-container mth-hero__inner">
          <p className="mth-pill">
            <IconSun width={16} height={16} />
            Tierra del Sol Amada
          </p>
          <h1 className="mth-hero__title">Maracaibo</h1>
          <p className="mth-hero__lead">Plazas, sabores, lago y mucha historia. Entra, que aquí te esperamos.</p>

          <form className="mth-search glass glass--pill" onSubmit={submitSearch} role="search">
            <IconSearch width={20} height={20} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca un lugar o un sabor…"
              aria-label={t("explore.search")}
              autoComplete="off"
            />
            <button type="submit" className="mt-btn mt-btn--primary mt-btn--sm">
              Explorar
              <IconArrowRight width={16} height={16} />
            </button>
          </form>

          <ul className="mth-chips" aria-label="Temas">
            {FEATURED_CATEGORY_SLUGS.map((slug) => {
              const category = categoryBySlug(slug);
              if (!category) return null;
              return (
                <li key={slug}>
                  <button type="button" className="mth-chip" onClick={() => onOpenCategory(slug)}>
                    <CategoryIcon name={category.icon} width={16} height={16} />
                    {t(category.nameKey)}
                    <b>{categoryCounts[slug] ?? 0}</b>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ===== Postales ===== */}
      <section className="mth-section mth-postales">
        <div className="mt-container">
          <HomeCarousel slides={WELCOME_SLIDES} onOpenPlace={onOpenPlace} />
        </div>
      </section>

      {/* ===== Accesos rápidos ===== */}
      <section className="mth-section mth-quick">
        <div className="mt-container">
          <div className="mth-section__head">
            <div>
              <p className="mth-kicker">
                <IconCompass width={14} height={14} />
                Empieza por aquí
              </p>
              <h2 className="mth-section__title">¿Qué te provoca hacer hoy?</h2>
              <p className="mth-section__lead">
                Cuatro formas de entrar a la ciudad, según el tiempo y las ganas que tengas.
              </p>
            </div>
          </div>

          <div className="mth-quick__grid">
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.page}
                  type="button"
                  className={`mth-quick__card mth-quick__card--${action.tone}`}
                  style={{ ["--i" as string]: index }}
                  onClick={() => onNavigate(action.page)}
                >
                  <span className="mth-quick__icon">
                    <Icon width={24} height={24} />
                  </span>
                  <strong>{action.title}</strong>
                  <span>{action.text}</span>
                  <span className="mth-quick__go">
                    Entrar
                    <IconArrowRight width={15} height={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Imperdibles ===== */}
      <section className="mth-section">
        <div className="mt-container">
          <div className="mth-section__head">
            <div>
              <p className="mth-kicker">
                <IconHeart width={14} height={14} />
                Si es tu primera vez
              </p>
              <h2 className="mth-section__title">Los imperdibles de Maracaibo</h2>
              <p className="mth-section__lead">
                Una selección para empezar: fe, historia, lago y sabores. Toca una postal y mira su
                ficha completa.
              </p>
            </div>
            <button
              type="button"
              className="mt-btn mt-btn--soft"
              onClick={() => onNavigate("explorar")}
            >
              Ver los 43 lugares
              <IconArrowRight width={16} height={16} />
            </button>
          </div>

          {loading ? (
            <PlaceGrid busy>
              {Array.from({ length: 6 }, (_, index) => (
                <PlaceCardSkeleton key={index} />
              ))}
            </PlaceGrid>
          ) : (
            <PlaceGrid>
              {highlights.map((place) => (
                <PlaceCard
                  key={place.slug}
                  place={place}
                  onOpen={onOpenPlace}
                  onToggleSave={onToggleSave}
                  saved={savedSet.has(place.slug)}
                />
              ))}
            </PlaceGrid>
          )}
        </div>
      </section>

      {/* ===== Rutas sugeridas ===== */}
      <section className="mth-section mth-section--sun">
        <div className="mt-container">
          <div className="mth-section__head">
            <div>
              <p className="mth-kicker">
                <IconBulb width={14} height={14} />
                Sugerencias de Zulmita
              </p>
              <h2 className="mth-section__title">Tres rutas para empezar sin pensarlo mucho</h2>
              <p className="mth-section__lead">
                Combinaciones probadas para aprovechar el día. Puedes abrir cada lugar o llevar la
                idea al planificador.
              </p>
            </div>
            <button type="button" className="mt-btn mt-btn--soft" onClick={() => onNavigate("plan")}>
              Personalizar mi plan
              <IconArrowRight width={16} height={16} />
            </button>
          </div>

          <div className="mth-routes">
            {ROUTE_IDEAS.map((route, index) => {
              const stops = route.slugs
                .map((slug) => placeBySlug.get(slug))
                .filter((place): place is Place => place !== undefined);
              return (
                <article
                  key={route.title}
                  className={`mth-route mth-route--${route.tone}`}
                  style={{ ["--i" as string]: index }}
                >
                  <div className="mth-route__top">
                    <span className="mth-route__tag">{route.days}</span>
                    <span className="mth-route__vibe">{route.vibe}</span>
                  </div>
                  <h3>{route.title}</h3>
                  <p>{route.text}</p>
                  <ol className="mth-route__stops">
                    {stops.map((stop, stopIndex) => {
                      const profile = profileFor(stop);
                      return (
                        <li key={stop.slug}>
                          <span className="mth-route__num">{stopIndex + 1}</span>
                          <button type="button" onClick={() => onOpenPlace(stop.slug)}>
                            <span
                              className="mth-route__emblem"
                              style={{
                                ["--from" as string]: profile.colors.from,
                                ["--to" as string]: profile.colors.to,
                                ["--accent" as string]: profile.colors.accent,
                              }}
                            >
                              <PlaceEmblem name={profile.emblem} width={15} height={15} />
                            </span>
                            <span>
                              <strong>{stop.name}</strong>
                              <small>{profile.essence}</small>
                            </span>
                            <IconArrowRight width={14} height={14} />
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  <button
                    type="button"
                    className="mth-route__cta"
                    onClick={() => onNavigate("plan")}
                  >
                    Armar esta ruta
                    <IconSparkles width={16} height={16} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Herramientas ===== */}
      <section className="mth-section">
        <div className="mt-container">
          <div className="mth-section__head">
            <div>
              <p className="mth-kicker">
                <IconSparkles width={14} height={14} />
                Todo lo que necesitas
              </p>
              <h2 className="mth-section__title">Una guía que piensa contigo</h2>
              <p className="mth-section__lead">
                Planifica, entiende el habla local y pregunta lo que quieras. Todo funciona también
                sin conexión.
              </p>
            </div>
          </div>

          <div className="mth-tools">
            <article className="mth-tool mth-tool--planner">
              <span className="mth-tool__icon">
                <IconSparkles width={25} height={25} />
              </span>
              <p className="mth-kicker">Sistema experto</p>
              <h3>Tu plan, armado a tu medida</h3>
              <p>
                Cuéntanos cuántos días tienes, con quién viajas y qué te gusta. Te proponemos
                lugares, comidas y el mejor momento del día.
              </p>
              <button type="button" className="mt-btn mt-btn--sun" onClick={() => onNavigate("plan")}>
                Crear mi plan
                <IconArrowRight width={16} height={16} />
              </button>
            </article>

            <article className="mth-tool mth-tool--dictionary">
              <span className="mth-tool__icon">
                <IconBook width={25} height={25} />
              </span>
              <p className="mth-kicker">Diccionario maracucho</p>
              <h3>Entiende cada frase</h3>
              <p>
                Más de 70 palabras y expresiones con pronunciación, significado, ejemplo y su
                equivalente en inglés. Para no perderte ninguna conversación.
              </p>
              <button
                type="button"
                className="mt-btn mt-btn--soft"
                onClick={() => onNavigate("diccionario")}
              >
                Abrir diccionario
                <IconArrowRight width={16} height={16} />
              </button>
            </article>

            <article className="mth-tool mth-tool--chat">
              <span className="mth-tool__icon">
                <IconChat width={25} height={25} />
              </span>
              <p className="mth-kicker">Asistente local</p>
              <h3>Zulmita, tu guía 24/7</h3>
              <p>
                Pregúntale por un lugar, un plato, una palabra o cómo moverte. Te responde al
                instante y te lleva a la ficha o al plan que necesitas.
              </p>
              <button type="button" className="mt-btn mt-btn--soft" onClick={onOpenChat}>
                Hablar con Zulmita
                <IconChat width={16} height={16} />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* ===== Frase y consejo ===== */}
      <section className="mth-section mth-section--sky mth-day">
        <div className="mt-container mth-day__grid">
          <article className="mth-day__card mth-day__card--phrase">
            <p className="mth-kicker">
              <IconBook width={14} height={14} />
              Frase del día
            </p>
            <strong>“{phrase.term}”</strong>
            <p>{phrase.meaning}</p>
            <button type="button" className="mth-link" onClick={() => onNavigate("diccionario")}>
              Ver en el diccionario
              <IconArrowRight width={15} height={15} />
            </button>
          </article>

          <article className="mth-day__card mth-day__card--tip">
            <p className="mth-kicker">
              <IconBulb width={14} height={14} />
              Consejo de viajero
            </p>
            <h3>Camina temprano, celebra al atardecer</h3>
            <p>
              El sol maracucho pega fuerte. Deja las caminatas largas para la mañana y la tarde,
              lleva agua y guarda la noche para la brisa del lago.
            </p>
            <button type="button" className="mt-btn mt-btn--soft" onClick={() => onNavigate("plan")}>
              <IconBulb width={16} height={16} />
              Armar un plan con pausas
            </button>
          </article>

          <article className="mth-day__card mth-day__card--budget">
            <p className="mth-kicker">
              <IconWallet width={14} height={14} />
              Dato útil
            </p>
            <h3>Muchos planes son gratis</h3>
            <p>
              Plazas, malecón, Basílica y centro histórico no cobran entrada. Reserva el presupuesto
              para comidas, transporte y algún museo.
            </p>
            <button type="button" className="mth-link" onClick={() => onNavigate("explorar")}>
              Ver lugares gratuitos
              <IconArrowRight width={15} height={15} />
            </button>
          </article>
        </div>
      </section>

      {/* ===== Cierre ===== */}
      <section className="mth-final">
        <div className="mt-container mth-final__inner">
          <span className="mth-final__icon" aria-hidden="true">
            <IconBridge width={30} height={30} />
          </span>
          <div>
            <p className="mth-kicker">Hecho para disfrutar</p>
            <h2>Maracaibo te está esperando</h2>
            <p>Explora, aprende el idioma local y deja que la ciudad te arme el plan.</p>
          </div>
          <div className="mth-final__actions">
            <button
              type="button"
              className="mt-btn mt-btn--primary"
              onClick={() => onNavigate("explorar")}
            >
              Empezar ahora
              <IconArrowRight width={17} height={17} />
            </button>
            <button type="button" className="mt-btn mt-btn--soft" onClick={onOpenChat}>
              <IconRotate width={16} height={16} />
              Preguntar a Zulmita
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
