import { useMemo, useState } from "react";
import { CATEGORIES, FEATURED_CATEGORY_SLUGS, categoryBySlug, type CategorySlug } from "../data/categories";
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
  IconMapPin,
  IconRotate,
  IconSparkles,
  IconStar,
  IconSun,
  IconUsers,
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

const SEARCH_IDEAS = ["Basílica", "Atardecer", "Patacón", "360°", "Museo"] as const;

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
  const panoCount = useMemo(() => places.filter((place) => place.panoUrl).length, [places]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
    onNavigate("explorar");
  };

  const searchIdea = (term: string) => {
    onSearch(term);
    onNavigate("explorar");
  };

  return (
    <main className="vmh-home">
      {/* ===== Portada ===== */}
      <section className="vmh-hero">
        <div className="vmh-hero__sky" aria-hidden="true">
          <span className="vmh-hero__sun" />
          <span className="vmh-hero__cloud vmh-hero__cloud--one" />
          <span className="vmh-hero__cloud vmh-hero__cloud--two" />
          <span className="vmh-hero__cloud vmh-hero__cloud--three" />
          <span className="vmh-hero__blob vmh-hero__blob--one" />
          <span className="vmh-hero__blob vmh-hero__blob--two" />
          <span className="vmh-hero__wave" />
        </div>

        <div className="container vmh-hero__inner">
          <div className="vmh-hero__top">
            <p className="vmh-eyebrow">
              <IconMapPin width={14} height={14} />
              Maracaibo · Zulia · Venezuela
            </p>
            <p className="vmh-hero__made">
              <IconSparkles width={14} height={14} />
              Guía local hecha a mano
            </p>
          </div>

          <div className="vmh-hero__grid">
            <div className="vmh-hero__copy">
              <p className="vmh-hero__stamp">
                <IconSun width={15} height={15} />
                Tierra del sol amada
              </p>
              <h1 className="vmh-hero__title">
                Maracaibo se disfruta
                <span>a todo color</span>
              </h1>
              <p className="vmh-hero__lead">
                Plazas con sombra, sabores que se recuerdan, atardeceres frente al lago y una
                historia que se camina. Encuentra tu próximo plan, míralo en 360° y llega sin
                perderte.
              </p>

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

              <div className="vmh-search__ideas" aria-label="Búsquedas rápidas">
                <span>Prueba con:</span>
                {SEARCH_IDEAS.map((idea) => (
                  <button key={idea} type="button" onClick={() => searchIdea(idea)}>
                    {idea}
                  </button>
                ))}
              </div>

              <div className="vmh-hero__actions">
                <button
                  type="button"
                  className="vmh-btn vmh-btn--primary"
                  onClick={() => onNavigate("plan")}
                >
                  <IconSparkles width={17} height={17} />
                  Arma tu plan perfecto
                </button>
                <button
                  type="button"
                  className="vmh-btn vmh-btn--soft"
                  onClick={() => onNavigate("explorar")}
                >
                  <IconCompass width={17} height={17} />
                  Ver todos los lugares
                </button>
              </div>

              <ul className="vmh-hero__perks">
                <li>
                  <IconCamera width={15} height={15} />
                  Fotos y 360° reales
                </li>
                <li>
                  <IconUsers width={15} height={15} />
                  Para toda la familia
                </li>
                <li>
                  <IconHeart width={15} height={15} />
                  Guarda y comparte
                </li>
              </ul>
            </div>

            <div className="vmh-hero__visual">
              <HomeCarousel slides={WELCOME_SLIDES} onOpenPlace={onOpenPlace} />
              <div className="vmh-hero__sticker" aria-hidden="true">
                <span className="vmh-hero__sticker-icon">
                  <IconSun width={20} height={20} />
                </span>
                <span>
                  <small>Sol de Maracaibo</small>
                  <strong>Todo el año</strong>
                </span>
              </div>
            </div>
          </div>

          <dl className="vmh-hero__stats">
            <div>
              <dt>Lugares curados</dt>
              <dd>{places.length || "—"}</dd>
            </div>
            <div>
              <dt>Temas para explorar</dt>
              <dd>{CATEGORIES.length}</dd>
            </div>
            <div>
              <dt>Con vista 360°</dt>
              <dd>{panoCount || "—"}</dd>
            </div>
            <div>
              <dt>Palabras maracuchas</dt>
              <dd>74</dd>
            </div>
          </dl>
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
                >
                  <span className="vmh-mood__icon">
                    <CategoryIcon name={category.icon} width={22} height={22} />
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
