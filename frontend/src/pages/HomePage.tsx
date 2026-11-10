import { useMemo, useState } from "react";
import { CATEGORY_MEDIA, FEATURED_CATEGORY_SLUGS, categoryBySlug, type CategorySlug } from "../data/categories";
import { phraseOfTheDay } from "../data/dictionary";
import { profileFor } from "../data/placeProfiles";
import { WELCOME_SLIDES } from "../data/welcome";
import type { Page } from "../hooks/usePageRoute";
import { useI18n } from "../i18n/I18nProvider";
import { countByCategory, sortPlaces } from "../lib/places";
import type { Place } from "../types";
import { HomeCarousel } from "../components/HomeCarousel";
import { PlaceCard } from "../components/PlaceCard";
import { PlaceEmblem } from "../components/PlaceEmblem";
import {
  CategoryIcon,
  IconArrowRight,
  IconBook,
  IconBridge,
  IconBulb,
  IconCamera,
  IconChat,
  IconClock,
  IconCompass,
  IconHeart,
  IconRotate,
  IconSparkles,
  IconStar,
  IconSun,
  IconWallet,
  IconWave,
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
    <main className="vmh-home">
      {/* ===== Portada ===== */}
      <section className="vmh-hero">
        <div className="vmh-hero__topline" aria-hidden="true">
          <div className="container vmh-hero__topline-inner">
            <div className="vmh-hero__place-badge">
              <span className="vmh-hero__place-dot" />
              <span>Maracaibo · Zulia · Tierra del Sol Amada</span>
            </div>
          </div>
        </div>
        <div className="vmh-hero__bridge" aria-hidden="true">
          <svg className="bridge-bg-anim" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bridgeSilhouette" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#0369a1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="cableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            <path d="M 600 220 L 0 80 L 0 280 Z" fill="#fbbf24" opacity="0.05" />
            <path d="M 600 220 L 1200 80 L 1200 280 Z" fill="#fbbf24" opacity="0.05" />
            <path d="M -50 225 L 1250 225" stroke="url(#bridgeSilhouette)" strokeWidth="5" strokeDasharray="12 4" />
            <path d="M -50 222 L 1250 222" stroke="#0284c7" strokeWidth="2" opacity="0.4" />
            <g fill="#f59e0b" opacity="0.85">
              <circle cx="50" cy="220" r="2" />
              <circle cx="150" cy="220" r="2" />
              <circle cx="280" cy="220" r="2.5" />
              <circle cx="430" cy="220" r="2.5" />
              <circle cx="600" cy="220" r="3" />
              <circle cx="770" cy="220" r="2.5" />
              <circle cx="920" cy="220" r="2.5" />
              <circle cx="1050" cy="220" r="2" />
              <circle cx="1150" cy="220" r="2" />
            </g>
            <g>
              <path d="M 230 225 L 270 65 L 290 65 L 330 225" fill="none" stroke="url(#bridgeSilhouette)" strokeWidth="4" />
              <line x1="250" y1="145" x2="310" y2="145" stroke="#0284c7" strokeWidth="3" opacity="0.6" />
              <g stroke="url(#cableGrad)" strokeWidth="1.5">
                <line x1="280" y1="65" x2="130" y2="222" />
                <line x1="280" y1="65" x2="180" y2="222" />
                <line x1="280" y1="65" x2="230" y2="222" />
                <line x1="280" y1="65" x2="330" y2="222" />
                <line x1="280" y1="65" x2="380" y2="222" />
                <line x1="280" y1="65" x2="430" y2="222" />
              </g>
            </g>
            <g>
              <path d="M 540 225 L 588 35 L 612 35 L 660 225" fill="none" stroke="url(#bridgeSilhouette)" strokeWidth="6" />
              <rect x="585" y="25" width="30" height="12" rx="2" fill="#0284c7" opacity="0.7" />
              <line x1="560" y1="130" x2="640" y2="130" stroke="#0369a1" strokeWidth="4" opacity="0.8" />
              <g stroke="url(#cableGrad)" strokeWidth="2">
                <line x1="600" y1="35" x2="410" y2="222" />
                <line x1="600" y1="35" x2="475" y2="222" />
                <line x1="600" y1="35" x2="535" y2="222" />
                <line x1="600" y1="35" x2="665" y2="222" />
                <line x1="600" y1="35" x2="725" y2="222" />
                <line x1="600" y1="35" x2="790" y2="222" />
              </g>
            </g>
            <g>
              <path d="M 870 225 L 910 65 L 930 65 L 970 225" fill="none" stroke="url(#bridgeSilhouette)" strokeWidth="4" />
              <line x1="890" y1="145" x2="950" y2="145" stroke="#0284c7" strokeWidth="3" opacity="0.6" />
              <g stroke="url(#cableGrad)" strokeWidth="1.5">
                <line x1="920" y1="65" x2="770" y2="222" />
                <line x1="920" y1="65" x2="820" y2="222" />
                <line x1="920" y1="65" x2="870" y2="222" />
                <line x1="920" y1="65" x2="970" y2="222" />
                <line x1="920" y1="65" x2="1020" y2="222" />
                <line x1="920" y1="65" x2="1070" y2="222" />
              </g>
            </g>
          </svg>
        </div>
        <div className="vmh-hero__sky" aria-hidden="true">
          <span className="vmh-hero__cloud vmh-hero__cloud--one" />
          <span className="vmh-hero__cloud vmh-hero__cloud--two" />
          <span className="vmh-hero__cloud vmh-hero__cloud--three" />
          <span className="vmh-hero__blob vmh-hero__blob--one" />
          <span className="vmh-hero__blob vmh-hero__blob--two" />
          <span className="vmh-hero__wave" />
        </div>

        <div className="container vmh-hero__inner">
          <div className="vmh-hero__grid">
            <div className="vmh-hero__copy">
              <div className="vmh-hero__sun-wrap">
                <svg className="vmh-hero__sun-svg" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <radialGradient id="sunCoreGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="25%" stopColor="#FEF08A" />
                      <stop offset="65%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </radialGradient>
                    <radialGradient id="sunAuraGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                      <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="rayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                  <circle cx="120" cy="120" r="110" fill="url(#sunAuraGrad)" />
                  <g className="sun-ray-spin">
                    <g fill="url(#rayGrad)">
                      <path d="M120 10 L126 35 L114 35 Z" />
                      <path d="M120 230 L126 205 L114 205 Z" />
                      <path d="M10 120 L35 126 L35 114 Z" />
                      <path d="M230 120 L205 126 L205 114 Z" />
                      <path d="M42 42 L64 54 L54 64 Z" />
                      <path d="M198 198 L176 186 L186 176 Z" />
                      <path d="M42 198 L54 176 L64 186 Z" />
                      <path d="M198 42 L186 64 L176 54 Z" />
                    </g>
                    <g stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
                      <line x1="120" y1="20" x2="120" y2="40" />
                      <line x1="120" y1="200" x2="120" y2="220" />
                      <line x1="20" y1="120" x2="40" y2="120" />
                      <line x1="200" y1="120" x2="220" y2="120" />
                      <line x1="49" y1="49" x2="63" y2="63" />
                      <line x1="177" y1="177" x2="191" y2="191" />
                      <line x1="49" y1="191" x2="63" y2="177" />
                      <line x1="177" y1="63" x2="191" y2="49" />
                    </g>
                  </g>
                  <circle cx="120" cy="120" r="62" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                  <circle cx="120" cy="120" r="54" fill="url(#sunCoreGrad)" stroke="#D97706" strokeWidth="2" />
                  <circle cx="120" cy="120" r="44" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.7" />
                  <circle cx="120" cy="120" r="36" fill="none" stroke="#78350F" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                </svg>
              </div>

              <h1 className="vmh-hero__title-main">Maracaibo</h1>
              <h2 className="vmh-hero__title-sub">Tierra Del Sol Amada</h2>

              <form className="vmh-search" onSubmit={submitSearch} role="search">
                <span className="vmh-search__icon" aria-hidden="true">
                  <IconCompass width={20} height={20} />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busca un lugar, un sabor o un plan…"
                  aria-label={t("explore.search")}
                  autoComplete="off"
                />
                <button type="submit" className="vmh-search__btn">
                  Explorar
                  <IconArrowRight width={17} height={17} />
                </button>
              </form>

            </div>

            <div className="vmh-hero__visual">
              <HomeCarousel slides={WELCOME_SLIDES} onOpenPlace={onOpenPlace} />
            </div>
          </div>

        </div>
      </section>

      {/* ===== Cinta de la ciudad ===== */}
      <div className="vmh-ticker" aria-label="Lo que hace única a Maracaibo">
        <div className="vmh-ticker__track">
          {[0, 1].map((copy) => (
            <span className="vmh-ticker__group" key={copy} aria-hidden={copy === 1}>
              <span>
                <IconSun width={15} height={15} /> Sol todo el año
              </span>
              <span>
                <IconWave width={15} height={15} /> Brisa del lago
              </span>
              <span>
                <IconStar width={15} height={15} /> La Chinita
              </span>
              <span>
                <IconBridge width={15} height={15} /> El puente
              </span>
              <span>
                <IconClock width={15} height={15} /> Atardeceres lentos
              </span>
              <span>
                <IconCamera width={15} height={15} /> Postales reales
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== Accesos rápidos ===== */}
      <section className="vmh-section vmh-quick">
        <div className="container">
          <div className="vmh-section__head">
            <div>
              <p className="vmh-kicker">
                <IconCompass width={14} height={14} />
                Empieza por aquí
              </p>
              <h2 className="vmh-section__title">¿Qué te provoca hacer hoy?</h2>
              <p className="vmh-section__lead">
                Cuatro formas de entrar a la ciudad, según el tiempo y las ganas que tengas.
              </p>
            </div>
          </div>

          <div className="vmh-quick__grid">
            {QUICK_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.page}
                  type="button"
                  className={`vmh-quick__card vmh-quick__card--${action.tone}`}
                  style={{ ["--i" as string]: index }}
                  onClick={() => onNavigate(action.page)}
                >
                  <span className="vmh-quick__icon">
                    <Icon width={24} height={24} />
                  </span>
                  <strong>{action.title}</strong>
                  <span>{action.text}</span>
                  <span className="vmh-quick__go">
                    Entrar
                    <IconArrowRight width={15} height={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Moods ===== */}
      <section className="vmh-section vmh-section--sky">
        <div className="container">
          <div className="vmh-section__head">
            <div>
              <p className="vmh-kicker">
                <IconSparkles width={14} height={14} />
                Elige tu mood
              </p>
              <h2 className="vmh-section__title">Ocho formas de sentir Maracaibo</h2>
              <p className="vmh-section__lead">
                Toca un tema y te llevamos a sus lugares. Historia, sabores, lago, cultura y todo
                lo que hace única a la ciudad.
              </p>
            </div>
            <button
              type="button"
              className="vmh-btn vmh-btn--soft"
              onClick={() => onNavigate("explorar")}
            >
              Ver todos los temas
              <IconArrowRight width={16} height={16} />
            </button>
          </div>

          <div className="vmh-mood-grid">
            {FEATURED_CATEGORY_SLUGS.map((slug, index) => {
              const category = categoryBySlug(slug);
              if (!category) return null;
              const media = CATEGORY_MEDIA[slug];
              return (
                <button
                  key={slug}
                  type="button"
                  className="vmh-mood"
                  style={{
                    ["--from" as string]: category.from,
                    ["--to" as string]: category.to,
                    ["--soft" as string]: category.soft,
                    ["--i" as string]: index,
                  }}
                  onClick={() => onOpenCategory(slug)}
                  title={`${t(category.nameKey)} · ${media.credit}`}
                >
                  <span className="vmh-mood__thumb" aria-hidden="true">
                    <img src={media.image} alt="" loading="lazy" decoding="async" />
                    <span className="vmh-mood__icon">
                      <CategoryIcon name={category.icon} width={16} height={16} />
                    </span>
                  </span>
                  <span className="vmh-mood__copy">
                    <strong>{t(category.nameKey)}</strong>
                    <small>{category.blurb}</small>
                  </span>
                  <span className="vmh-mood__count">{categoryCounts[slug] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Imperdibles ===== */}
      <section className="vmh-section">
        <div className="container">
          <div className="vmh-section__head">
            <div>
              <p className="vmh-kicker">
                <IconHeart width={14} height={14} />
                Si es tu primera vez
              </p>
              <h2 className="vmh-section__title">Los imperdibles de Maracaibo</h2>
              <p className="vmh-section__lead">
                Una selección para empezar: fe, historia, lago y sabores. Toca una postal y mira su
                ficha completa.
              </p>
            </div>
            <button
              type="button"
              className="vmh-btn vmh-btn--ghost"
              onClick={() => onNavigate("explorar")}
            >
              Ver los 43 lugares
              <IconArrowRight width={16} height={16} />
            </button>
          </div>

          {loading ? (
            <div className="vm-place-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="vm-place-card vm-place-card--skeleton" />
              ))}
            </div>
          ) : (
            <div className="vm-place-grid">
              {highlights.map((place, index) => (
                <PlaceCard
                  key={place.slug}
                  place={place}
                  index={index}
                  onOpen={onOpenPlace}
                  onToggleSave={onToggleSave}
                  saved={savedSet.has(place.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Rutas sugeridas ===== */}
      <section className="vmh-section vmh-section--sun">
        <div className="container">
          <div className="vmh-section__head">
            <div>
              <p className="vmh-kicker">
                <IconBulb width={14} height={14} />
                Sugerencias de Zulmita
              </p>
              <h2 className="vmh-section__title">Tres rutas para empezar sin pensarlo mucho</h2>
              <p className="vmh-section__lead">
                Combinaciones probadas para aprovechar el día. Puedes abrir cada lugar o llevar la
                idea al planificador.
              </p>
            </div>
            <button type="button" className="vmh-btn vmh-btn--soft" onClick={() => onNavigate("plan")}>
              Personalizar mi plan
              <IconArrowRight width={16} height={16} />
            </button>
          </div>

          <div className="vmh-routes">
            {ROUTE_IDEAS.map((route, index) => {
              const stops = route.slugs
                .map((slug) => placeBySlug.get(slug))
                .filter((place): place is Place => place !== undefined);
              return (
                <article
                  key={route.title}
                  className={`vmh-route vmh-route--${route.tone}`}
                  style={{ ["--i" as string]: index }}
                >
                  <div className="vmh-route__top">
                    <span className="vmh-route__tag">{route.days}</span>
                    <span className="vmh-route__vibe">{route.vibe}</span>
                  </div>
                  <h3>{route.title}</h3>
                  <p>{route.text}</p>
                  <ol className="vmh-route__stops">
                    {stops.map((stop, stopIndex) => {
                      const profile = profileFor(stop);
                      return (
                        <li key={stop.slug}>
                          <span className="vmh-route__num">{stopIndex + 1}</span>
                          <button type="button" onClick={() => onOpenPlace(stop.slug)}>
                            <span
                              className="vmh-route__emblem"
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
                    className="vmh-route__cta"
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
      <section className="vmh-section">
        <div className="container">
          <div className="vmh-section__head">
            <div>
              <p className="vmh-kicker">
                <IconSparkles width={14} height={14} />
                Todo lo que necesitas
              </p>
              <h2 className="vmh-section__title">Una guía que piensa contigo</h2>
              <p className="vmh-section__lead">
                Planifica, entiende el habla local y pregunta lo que quieras. Todo funciona también
                sin conexión.
              </p>
            </div>
          </div>

          <div className="vmh-tools">
            <article className="vmh-tool vmh-tool--planner">
              <span className="vmh-tool__icon">
                <IconSparkles width={25} height={25} />
              </span>
              <p className="vmh-kicker">Sistema experto</p>
              <h3>Tu plan, armado a tu medida</h3>
              <p>
                Cuéntanos cuántos días tienes, con quién viajas y qué te gusta. Te proponemos
                lugares, comidas y el mejor momento del día.
              </p>
              <button type="button" className="vmh-btn vmh-btn--dark" onClick={() => onNavigate("plan")}>
                Crear mi plan
                <IconArrowRight width={16} height={16} />
              </button>
            </article>

            <article className="vmh-tool vmh-tool--dictionary">
              <span className="vmh-tool__icon">
                <IconBook width={25} height={25} />
              </span>
              <p className="vmh-kicker">Diccionario maracucho</p>
              <h3>Entiende cada frase</h3>
              <p>
                Más de 70 palabras y expresiones con pronunciación, significado, ejemplo y su
                equivalente en inglés. Para no perderte ninguna conversación.
              </p>
              <button
                type="button"
                className="vmh-btn vmh-btn--soft"
                onClick={() => onNavigate("diccionario")}
              >
                Abrir diccionario
                <IconArrowRight width={16} height={16} />
              </button>
            </article>

            <article className="vmh-tool vmh-tool--chat">
              <span className="vmh-tool__icon">
                <IconChat width={25} height={25} />
              </span>
              <p className="vmh-kicker">Asistente local</p>
              <h3>Zulmita, tu guía 24/7</h3>
              <p>
                Pregúntale por un lugar, un plato, una palabra o cómo moverte. Te responde al
                instante y te lleva a la ficha o al plan que necesitas.
              </p>
              <button type="button" className="vmh-btn vmh-btn--soft" onClick={onOpenChat}>
                Hablar con Zulmita
                <IconChat width={16} height={16} />
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* ===== Frase y consejo ===== */}
      <section className="vmh-section vmh-section--sky vmh-day">
        <div className="container vmh-day__grid">
          <article className="vmh-day__card vmh-day__card--phrase">
            <p className="vmh-kicker">
              <IconBook width={14} height={14} />
              Frase del día
            </p>
            <strong>“{phrase.term}”</strong>
            <p>{phrase.meaning}</p>
            <button type="button" className="vmh-link" onClick={() => onNavigate("diccionario")}>
              Ver en el diccionario
              <IconArrowRight width={15} height={15} />
            </button>
          </article>

          <article className="vmh-day__card vmh-day__card--tip">
            <p className="vmh-kicker">
              <IconBulb width={14} height={14} />
              Consejo de viajero
            </p>
            <h3>Camina temprano, celebra al atardecer</h3>
            <p>
              El sol maracucho pega fuerte. Deja las caminatas largas para la mañana y la tarde,
              lleva agua y guarda la noche para la brisa del lago.
            </p>
            <button type="button" className="vmh-btn vmh-btn--soft" onClick={() => onNavigate("plan")}>
              <IconBulb width={16} height={16} />
              Armar un plan con pausas
            </button>
          </article>

          <article className="vmh-day__card vmh-day__card--budget">
            <p className="vmh-kicker">
              <IconWallet width={14} height={14} />
              Dato útil
            </p>
            <h3>Muchos planes son gratis</h3>
            <p>
              Plazas, malecón, Basílica y centro histórico no cobran entrada. Reserva el presupuesto
              para comidas, transporte y algún museo.
            </p>
            <button type="button" className="vmh-link" onClick={() => onNavigate("explorar")}>
              Ver lugares gratuitos
              <IconArrowRight width={15} height={15} />
            </button>
          </article>
        </div>
      </section>

      {/* ===== Cierre ===== */}
      <section className="vmh-final">
        <div className="container vmh-final__inner">
          <span className="vmh-final__icon" aria-hidden="true">
            <IconBridge width={30} height={30} />
          </span>
          <div>
            <p className="vmh-kicker">Hecho para disfrutar</p>
            <h2>Maracaibo te está esperando</h2>
            <p>Explora, aprende el idioma local y deja que la ciudad te arme el plan.</p>
          </div>
          <div className="vmh-final__actions">
            <button
              type="button"
              className="vmh-btn vmh-btn--primary"
              onClick={() => onNavigate("explorar")}
            >
              Empezar ahora
              <IconArrowRight width={17} height={17} />
            </button>
            <button type="button" className="vmh-btn vmh-btn--soft" onClick={onOpenChat}>
              <IconRotate width={16} height={16} />
              Preguntar a Zulmita
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
