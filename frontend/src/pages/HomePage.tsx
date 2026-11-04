import { useMemo, useState } from "react";
import { CATEGORIES, FEATURED_CATEGORY_SLUGS, categoryBySlug, type CategorySlug } from "../data/categories";
import { phraseOfTheDay } from "../data/dictionary";
import type { Page } from "../hooks/usePageRoute";
import { useI18n } from "../i18n/I18nProvider";
import { countByCategory, sortPlaces } from "../lib/places";
import type { Place } from "../types";
import { Cover } from "../components/Cover";
import { PlaceCard } from "../components/PlaceCard";
import {
  CategoryIcon,
  IconArrowRight,
  IconBook,
  IconBridge,
  IconBulb,
  IconChat,
  IconClock,
  IconCompass,
  IconHeart,
  IconMapPin,
  IconRotate,
  IconSparkles,
  IconStar,
  IconUsers,
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
  const popular = useMemo(() => sortPlaces(places, "popular").slice(0, 3), [places]);
  const highlights = useMemo(() => sortPlaces(places, "popular").slice(0, 6), [places]);
  const savedSet = useMemo(() => new Set(saved), [saved]);
  const phrase = phraseOfTheDay();
  const categoryCounts = useMemo(() => countByCategory(places), [places]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
    onNavigate("explorar");
  };

  return (
    <main className="vm-home">
      <section className="vm-hero">
        <div className="vm-hero__orb vm-hero__orb--one" aria-hidden="true" />
        <div className="vm-hero__orb vm-hero__orb--two" aria-hidden="true" />
        <div className="vm-hero__grid container">
          <div className="vm-hero__copy">
            <p className="vm-kicker">
              <IconMapPin width={15} height={15} />
              Maracaibo · Zulia · Venezuela
            </p>
            <h1 className="vm-hero__title">
              {t("hero.title1")}
              <span>{t("hero.title2")}</span>
            </h1>
            <p className="vm-hero__lead">{t("hero.lead")}</p>

            <form className="vm-hero__search" onSubmit={submitSearch} role="search">
              <IconCompass width={20} height={20} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca un lugar, un sabor o un plan…"
                aria-label={t("explore.search")}
                autoComplete="off"
              />
              <button type="submit" className="vm-btn vm-btn--primary">
                Explorar
                <IconArrowRight width={17} height={17} />
              </button>
            </form>

            <div className="vm-hero__actions">
              <button type="button" className="vm-btn vm-btn--primary" onClick={() => onNavigate("plan")}>
                <IconSparkles width={17} height={17} />
                Arma tu plan perfecto
              </button>
              <button type="button" className="vm-btn vm-btn--soft" onClick={() => onNavigate("diccionario")}>
                <IconBook width={17} height={17} />
                Habla como un maracucho
              </button>
            </div>

            <dl className="vm-hero__stats">
              <div>
                <dt>Lugares</dt>
                <dd>{places.length || "—"}</dd>
              </div>
              <div>
                <dt>Temas</dt>
                <dd>{CATEGORIES.length}</dd>
              </div>
              <div>
                <dt>Con 360°</dt>
                <dd>{places.filter((place) => place.panoUrl).length || "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="vm-hero__art" aria-label="Vista previa de Maracaibo">
            <div className="vm-hero__sun" aria-hidden="true" />
            <div className="vm-hero__ring" aria-hidden="true" />
            <div className="vm-hero__postcards">
              {popular.map((place, index) => {
                const category = categoryBySlug(place.category);
                return (
                  <button
                    key={place.slug}
                    type="button"
                    className={`vm-postcard vm-postcard--${index + 1}`}
                    onClick={() => onOpenPlace(place.slug)}
                    aria-label={`${place.name} · ${t("places.details")}`}
                  >
                    <span className="vm-postcard__media">
                      <Cover place={place} className="vm-postcard__cover" />
                    </span>
                    <span className="vm-postcard__body">
                      <span
                        className="vm-postcard__cat"
                        style={{ ["--from" as string]: category?.from ?? "#0D6B76" }}
                      >
                        {category && <CategoryIcon name={category.icon} width={12} height={12} />}
                        {place.categoryName}
                      </span>
                      <strong>{place.name}</strong>
                      <small>{place.shortDescription}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <button type="button" className="vm-hero__float vm-hero__float--360" onClick={() => onNavigate("explorar")}>
              <span className="vm-hero__float-icon">
                <IconRotate width={19} height={19} />
              </span>
              <span>
                <strong>360° dentro de la ficha</strong>
                <small>Tú decides si verlo</small>
              </span>
            </button>

            <button type="button" className="vm-hero__float vm-hero__float--chat" onClick={onOpenChat}>
              <span className="vm-hero__float-icon vm-hero__float-icon--chat">
                <IconChat width={19} height={19} />
              </span>
              <span>
                <strong>¿Tienes una duda?</strong>
                <small>Zulmita te responde</small>
              </span>
            </button>
          </div>
        </div>
        <div className="vm-hero__strip container">
          <span>
            <IconClock width={15} height={15} />
            Planes de 1 a 5 días
          </span>
          <span>
            <IconUsers width={15} height={15} />
            Para familias, parejas y amigos
          </span>
          <span>
            <IconHeart width={15} height={15} />
            Guarda y comparte tu ruta
          </span>
          <span>
            <IconStar width={15} height={15} />
            Diccionario local incluido
          </span>
        </div>
      </section>

      <section className="vm-section">
        <div className="container">
          <div className="vm-section__head">
            <div>
              <p className="vm-kicker">¿Qué te provoca hoy?</p>
              <h2 className="vm-section__title">Elige tu mood en Maracaibo</h2>
              <p className="vm-section__lead">
                Ocho formas de entrar a la ciudad. Toca un tema y te llevamos a sus lugares.
              </p>
            </div>
            <button type="button" className="vm-btn vm-btn--soft" onClick={() => onNavigate("explorar")}>
              Ver todos los temas
              <IconArrowRight width={16} height={16} />
            </button>
          </div>

          <div className="vm-mood-grid">
            {FEATURED_CATEGORY_SLUGS.map((slug) => {
              const category = categoryBySlug(slug);
              if (!category) return null;
              return (
                <button
                  key={slug}
                  type="button"
                  className="vm-mood"
                  style={{
                    ["--from" as string]: category.from,
                    ["--to" as string]: category.to,
                    ["--soft" as string]: category.soft,
                  }}
                  onClick={() => onOpenCategory(slug)}
                >
                  <span className="vm-mood__icon">
                    <CategoryIcon name={category.icon} width={22} height={22} />
                  </span>
                  <span className="vm-mood__copy">
                    <strong>{t(category.nameKey)}</strong>
                    <small>{category.blurb}</small>
                  </span>
                  <span className="vm-mood__count">{categoryCounts[slug] ?? 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="vm-section vm-section--tint">
        <div className="container">
          <div className="vm-section__head">
            <div>
              <p className="vm-kicker">Si es tu primera vez</p>
              <h2 className="vm-section__title">Los imperdibles de Maracaibo</h2>
              <p className="vm-section__lead">
                Una selección para empezar: historia, fe, lago y sabores. Guarda lo que te enamore.
              </p>
            </div>
            <button type="button" className="vm-btn vm-btn--ghost" onClick={() => onNavigate("explorar")}>
              Ver todos los lugares
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

      <section className="vm-section">
        <div className="container">
          <div className="vm-tools">
            <article className="vm-tool vm-tool--planner">
              <span className="vm-tool__icon">
                <IconSparkles width={26} height={26} />
              </span>
              <p className="vm-kicker">Sistema experto</p>
              <h2>Tu plan, armado a tu medida</h2>
              <p>
                Cuéntanos cuántos días tienes, con quién viajas y qué te gusta. Te proponemos
                lugares, comidas y hasta el mejor momento del día.
              </p>
              <button type="button" className="vm-btn vm-btn--dark" onClick={() => onNavigate("plan")}>
                Crear mi plan
                <IconArrowRight width={17} height={17} />
              </button>
            </article>

            <article className="vm-tool vm-tool--dictionary">
              <span className="vm-tool__icon">
                <IconBook width={26} height={26} />
              </span>
              <p className="vm-kicker">Diccionario maracucho</p>
              <h2>Entiende cada frase</h2>
              <p>
                Más de 70 palabras y expresiones con pronunciación, significado, ejemplo y su
                equivalente en inglés. Para no perderte ninguna conversación.
              </p>
              <button type="button" className="vm-btn vm-btn--soft" onClick={() => onNavigate("diccionario")}>
                Abrir diccionario
                <IconArrowRight width={17} height={17} />
              </button>
            </article>

            <article className="vm-tool vm-tool--chat">
              <span className="vm-tool__icon">
                <IconChat width={26} height={26} />
              </span>
              <p className="vm-kicker">Asistente local</p>
              <h2>Zulmita, tu guía 24/7</h2>
              <p>
                Pregúntale por un lugar, un plato, una palabra o cómo moverte. Te responde al
                instante y te lleva a la ficha o al plan que necesitas.
              </p>
              <button type="button" className="vm-btn vm-btn--soft" onClick={onOpenChat}>
                Hablar con Zulmita
                <IconChat width={17} height={17} />
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="vm-section vm-section--pano">
        <div className="container">
          <div className="vm-day-card">
            <div className="vm-day-card__phrase">
              <p className="vm-kicker">Frase del día</p>
              <strong>“{phrase.term}”</strong>
              <span>{phrase.meaning}</span>
              <button type="button" className="vm-link" onClick={() => onNavigate("diccionario")}>
                Ver en el diccionario
                <IconArrowRight width={15} height={15} />
              </button>
            </div>
            <div className="vm-day-card__route">
              <p className="vm-kicker">Consejo de viajero</p>
              <h3>Camina temprano, celebra al atardecer</h3>
              <p>
                El sol maracucho pega fuerte. Deja las caminatas largas para la mañana y la tarde,
                lleva agua y guarda la noche para la brisa del lago.
              </p>
              <button type="button" className="vm-btn vm-btn--dark" onClick={() => onNavigate("plan")}>
                <IconBulb width={17} height={17} />
                Armar un plan con pausas
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="vm-final-cta">
        <div className="container vm-final-cta__inner">
          <span className="vm-final-cta__icon" aria-hidden="true">
            <IconBridge width={30} height={30} />
          </span>
          <div>
            <p className="vm-kicker">Hecho para disfrutar</p>
            <h2>Maracaibo te está esperando</h2>
            <p>Explora, aprende el idioma local y deja que la ciudad te arme el plan.</p>
          </div>
          <button type="button" className="vm-btn vm-btn--primary" onClick={() => onNavigate("explorar")}>
            Empezar ahora
            <IconArrowRight width={17} height={17} />
          </button>
        </div>
      </section>
    </main>
  );
}
