import { useMemo, useState } from "react";
import { categoryBySlug, type CategorySlug } from "../data/categories";
import { DICTIONARY, phraseOfTheDay } from "../data/dictionary";
import { profileFor } from "../data/placeProfiles";
import { WELCOME_SLIDES } from "../data/welcome";
import type { Page } from "../hooks/usePageRoute";
import { useI18n } from "../i18n/I18nProvider";
import { countByCategory, primaryCategory, sortPlaces } from "../lib/places";
import type { Place } from "../types";
import { HomeCarousel } from "../components/HomeCarousel";
import { PlaceImage } from "../components/PlaceImage";
import "./HomePage.css";
import { PlaceEmblem } from "../components/PlaceEmblem";
import {
  CategoryIcon,
  IconArrowRight,
  IconBook,
  IconBridge,
  IconBulb,
  IconMapPin,
  IconStar,
  IconChat,
  IconCompass,
  IconHeart,
  IconRotate,
  IconSearch,
  IconSparkles,
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

const HERO_CATEGORIES: readonly CategorySlug[] = ["cultura", "compras", "gastronomia", "naturaleza", "historia"];
const HERO_PHOTO = "/media/sitios/puente-rafael-urdaneta/portada.jpg";

const QUICK_ACTIONS: readonly {
  key: "explore" | "plan" | "dictionary" | "saved";
  page: Page;
  icon: typeof IconCompass;
  tone: string;
}[] = [
  { key: "explore", page: "explorar", icon: IconCompass, tone: "sky" },
  { key: "plan", page: "plan", icon: IconSparkles, tone: "sun" },
  { key: "dictionary", page: "diccionario", icon: IconBook, tone: "coral" },
  { key: "saved", page: "mi-ruta", icon: IconHeart, tone: "rose" },
];

const ROUTE_IDEAS: readonly {
  id: 1 | 2 | 3;
  slugs: readonly string[];
  tone: "sky" | "sun" | "coral";
}[] = [
  { id: 1, slugs: ["basilica-chiquinquira", "calle-carabobo", "plaza-baralt", "teatro-baralt"], tone: "sky" },
  { id: 2, slugs: ["vereda-del-lago", "paseo-del-lago", "mi-vaquita", "calle-72-bella-vista"], tone: "sun" },
  {
    id: 3,
    slugs: ["jardin-botanico-maracaibo", "ruta-dulces-santa-lucia", "galerias-mall", "parque-universitario-luz"],
    tone: "coral",
  },
];

export function HomePage({
  places,
  loading,
  onOpenPlace,
  onNavigate,
  onOpenCategory,
  onSearch,
  onOpenChat,
}: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const highlights = useMemo(() => sortPlaces(places, "popular").slice(0, 8), [places]);
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
          <img className="mth-hero__photo" src={HERO_PHOTO} alt="" fetchPriority="high" decoding="async" />
          <span className="mth-hero__shade" />
          <svg className="mth-hero__wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0 62 C180 20 360 10 560 52 S1000 110 1240 60 S1400 30 1440 44 V120 H0 Z" fill="rgba(79,195,247,0.55)" />
            <path d="M0 84 C240 124 480 30 720 74 S1200 118 1440 62 V120 H0 Z" fill="var(--mt-bg)" />
          </svg>
        </div>

        <p className="mth-hero__note" aria-hidden="true">
          <span>{t("home.hero.note")}</span>
          <svg viewBox="0 0 120 10" preserveAspectRatio="none">
            <path d="M2 6 C30 1 70 9 118 3" stroke="#FFC83D" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </p>

        <div className="mt-container mth-hero__inner">
          <p className="mth-hero__kicker">{t("home.hero.kicker")}</p>
          <h1 className="mth-hero__title">Maracaibo</h1>
          <p className="mth-pill">{t("home.hero.pill")}</p>
          <p className="mth-hero__lead">{t("home.hero.lead")}</p>

          <form className="mth-search" onSubmit={submitSearch} role="search">
            <IconSearch width={20} height={20} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("home.hero.searchPlaceholder")}
              aria-label={t("explore.search")}
              autoComplete="off"
            />
            <button type="submit" className="mt-btn mt-btn--primary mt-btn--sm">
              {t("home.hero.searchButton")}
              <IconArrowRight width={16} height={16} />
            </button>
          </form>
        </div>
      </section>

      {/* ===== Categorías ===== */}
      <div className="mt-container mth-cats-wrap">
        <ul className="mth-cats" aria-label={t("home.hero.topics")}>
          {HERO_CATEGORIES.map((slug) => {
            const category = categoryBySlug(slug);
            if (!category) return null;
            return (
              <li key={slug}>
                <button
                  type="button"
                  className="mth-cat"
                  style={{ ["--c-from" as string]: category.from, ["--c-soft" as string]: category.soft }}
                  onClick={() => onOpenCategory(slug)}
                >
                  <span className="mth-cat__icon">
                    <CategoryIcon name={category.icon} width={22} height={22} />
                  </span>
                  <span className="mth-cat__text">
                    <strong>{t(category.nameKey)}</strong>
                    <small>({categoryCounts[slug] ?? 0})</small>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ===== Postales ===== */}
      <section className="mth-section mth-postales">
        <div className="mt-container">
          <HomeCarousel slides={WELCOME_SLIDES} places={places} onOpenPlace={onOpenPlace} />
        </div>
      </section>

      {/* ===== Sitios destacados ===== */}
      <section className="mth-section mth-featured">
        <div className="mt-container">
          <div className="mth-featured__head">
            <h2 className="mth-featured__title">
              <span className="mth-featured__star" aria-hidden="true">
                <IconStar width={24} height={24} />
              </span>
              {t("home.featured.title")}
              <small>{t("home.featured.lead")}</small>
            </h2>
            <button
              type="button"
              className="mth-link"
              onClick={() => onNavigate("explorar")}
              aria-label={t("home.featured.allAria", { n: places.length })}
            >
              {t("home.featured.all")}
              <IconArrowRight width={15} height={15} />
            </button>
          </div>

          <ul className="mth-feat-list">
            {loading
              ? Array.from({ length: 8 }, (_, index) => <li key={index} className="mth-feat mth-feat--skeleton mt-skeleton" />)
              : highlights.map((place) => {
                  const category = categoryBySlug(primaryCategory(place));
                  return (
                    <li key={place.slug}>
                      <button
                        type="button"
                        className="mth-feat"
                        style={{
                          ["--c-from" as string]: category?.from,
                          ["--c-soft" as string]: category?.soft,
                        }}
                        onClick={() => onOpenPlace(place.slug)}
                      >
                        <PlaceImage place={place} ratio="thumb" decorative className="mth-feat__img" />
                        <span className="mth-feat__body">
                          <strong>
                            <IconMapPin width={15} height={15} />
                            {place.name}
                          </strong>
                          <span className="mth-feat__desc">{place.shortDescription}</span>
                          {category ? <span className="mth-feat__pill">{t(category.nameKey)}</span> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
          </ul>
        </div>
      </section>

      {/* ===== Accesos rápidos ===== */}
      <section className="mth-section mth-quick">
        <div className="mt-container">
          <div className="mth-section__head">
            <div>
              <p className="mth-kicker">
                <IconCompass width={14} height={14} />
                {t("home.quick.kicker")}
              </p>
              <h2 className="mth-section__title">{t("home.quick.title")}</h2>
              <p className="mth-section__lead">{t("home.quick.lead")}</p>
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
                  <strong>{t(`home.quick.${action.key}.title`)}</strong>
                  <span>{t(`home.quick.${action.key}.text`, { n: action.key === "explore" ? places.length : DICTIONARY.length })}</span>
                  <span className="mth-quick__go">
                    {t("home.quick.go")}
                    <IconArrowRight width={15} height={15} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Rutas sugeridas ===== */}
      <section className="mth-section mth-section--sun">
        <div className="mt-container">
          <div className="mth-section__head">
            <div>
              <p className="mth-kicker">
                <IconBulb width={14} height={14} />
                {t("home.routes.kicker")}
              </p>
              <h2 className="mth-section__title">{t("home.routes.title")}</h2>
              <p className="mth-section__lead">{t("home.routes.lead")}</p>
            </div>
            <button type="button" className="mt-btn mt-btn--soft" onClick={() => onNavigate("plan")}>
              {t("home.routes.customize")}
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
                  key={route.id}
                  className={`mth-route mth-route--${route.tone}`}
                  style={{ ["--i" as string]: index }}
                >
                  <div className="mth-route__top">
                    <span className="mth-route__tag">{t(`home.routes.${route.id}.days`)}</span>
                    <span className="mth-route__vibe">{t(`home.routes.${route.id}.vibe`)}</span>
                  </div>
                  <h3>{t(`home.routes.${route.id}.title`)}</h3>
                  <p>{t(`home.routes.${route.id}.text`)}</p>
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
                    {t("home.routes.build")}
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
                {t("home.tools.kicker")}
              </p>
              <h2 className="mth-section__title">{t("home.tools.title")}</h2>
              <p className="mth-section__lead">{t("home.tools.lead")}</p>
            </div>
          </div>

          <div className="mth-tools">
            <article className="mth-tool mth-tool--planner">
              <span className="mth-tool__icon">
                <IconSparkles width={25} height={25} />
              </span>
              <p className="mth-kicker">{t("home.tools.planner.kicker")}</p>
              <h3>{t("home.tools.planner.title")}</h3>
              <p>{t("home.tools.planner.text")}</p>
              <button type="button" className="mt-btn mt-btn--sun" onClick={() => onNavigate("plan")}>
                {t("home.tools.planner.cta")}
                <IconArrowRight width={16} height={16} />
              </button>
            </article>

            <article className="mth-tool mth-tool--dictionary">
              <span className="mth-tool__icon">
                <IconBook width={25} height={25} />
              </span>
              <p className="mth-kicker">{t("home.tools.dictionary.kicker")}</p>
              <h3>{t("home.tools.dictionary.title")}</h3>
              <p>{t("home.tools.dictionary.text", { n: Math.floor(DICTIONARY.length / 10) * 10 })}</p>
              <button
                type="button"
                className="mt-btn mt-btn--soft"
                onClick={() => onNavigate("diccionario")}
              >
                {t("home.tools.dictionary.cta")}
                <IconArrowRight width={16} height={16} />
              </button>
            </article>

            <article className="mth-tool mth-tool--chat">
              <span className="mth-tool__icon">
                <IconChat width={25} height={25} />
              </span>
              <p className="mth-kicker">{t("home.tools.chat.kicker")}</p>
              <h3>{t("home.tools.chat.title")}</h3>
              <p>{t("home.tools.chat.text")}</p>
              <button type="button" className="mt-btn mt-btn--soft" onClick={onOpenChat}>
                {t("home.tools.chat.cta")}
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
              {t("home.day.phrase.kicker")}
            </p>
            <strong>“{phrase.term}”</strong>
            <p>{phrase.meaning}</p>
            <button type="button" className="mth-link" onClick={() => onNavigate("diccionario")}>
              {t("home.day.phrase.cta")}
              <IconArrowRight width={15} height={15} />
            </button>
          </article>

          <article className="mth-day__card mth-day__card--tip">
            <p className="mth-kicker">
              <IconBulb width={14} height={14} />
              {t("home.day.tip.kicker")}
            </p>
            <h3>{t("home.day.tip.title")}</h3>
            <p>{t("home.day.tip.text")}</p>
            <button type="button" className="mt-btn mt-btn--soft" onClick={() => onNavigate("plan")}>
              <IconBulb width={16} height={16} />
              {t("home.day.tip.cta")}
            </button>
          </article>

          <article className="mth-day__card mth-day__card--budget">
            <p className="mth-kicker">
              <IconWallet width={14} height={14} />
              {t("home.day.budget.kicker")}
            </p>
            <h3>{t("home.day.budget.title")}</h3>
            <p>{t("home.day.budget.text")}</p>
            <button type="button" className="mth-link" onClick={() => onNavigate("explorar")}>
              {t("home.day.budget.cta")}
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
            <p className="mth-kicker">{t("home.final.kicker")}</p>
            <h2>{t("home.final.title")}</h2>
            <p>{t("home.final.text")}</p>
          </div>
          <div className="mth-final__actions">
            <button
              type="button"
              className="mt-btn mt-btn--primary"
              onClick={() => onNavigate("explorar")}
            >
              {t("home.final.start")}
              <IconArrowRight width={17} height={17} />
            </button>
            <button type="button" className="mt-btn mt-btn--soft" onClick={onOpenChat}>
              <IconRotate width={16} height={16} />
              {t("home.final.ask")}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
