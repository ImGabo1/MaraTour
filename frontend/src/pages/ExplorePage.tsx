import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_GROUPS } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { MapView } from "../components/MapView";
import { PlaceCard } from "../components/PlaceCard";
import {
  CategoryIcon,
  IconArrowRight,
  IconCheck,
  IconClose,
  IconGrid,
  IconMap,
  IconSearch,
  IconSort,
  IconSparkles,
} from "../components/icons";
import {
  countByCategory,
  filterPlaces,
  sortPlaces,
  type CategoryFilter,
  type SortMode,
} from "../lib/places";
import type { Place } from "../types";

const PAGE_SIZE = 12;

interface Props {
  places: readonly Place[];
  saved: readonly string[];
  loading: boolean;
  initialQuery: string;
  initialCategory: CategoryFilter;
  initialView?: "grid" | "map";
  onOpenPlace: (slug: string) => void;
  onToggleSave: (slug: string) => void;
}

export function ExplorePage({
  places,
  saved,
  loading,
  initialQuery,
  initialCategory,
  initialView = "grid",
  onOpenPlace,
  onToggleSave,
}: Props) {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [sort, setSort] = useState<SortMode>("popular");
  const [view, setView] = useState<"grid" | "map">(initialView);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [mapFocus, setMapFocus] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const counts = useMemo(() => countByCategory(places), [places]);
  const savedSet = useMemo(() => new Set(saved), [saved]);

  const visible = useMemo(
    () => sortPlaces(filterPlaces(places, category, deferredQuery), sort, lang),
    [places, category, deferredQuery, sort, lang]
  );

  const mapList = useMemo(() => visible.slice(0, 24), [visible]);
  const overview = category === null && deferredQuery.trim() === "";
  const cards = visible.slice(0, limit);
  const activeCategory = category ? CATEGORIES.find((item) => item.slug === category) : null;

  useEffect(() => {
    setLimit(PAGE_SIZE);
    setMapFocus(null);
  }, [category, deferredQuery, sort]);

  const selectCategory = (next: CategoryFilter) => {
    setCategory(next);
    setView("grid");
  };

  return (
    <main className="vm-page vm-explore">
      <section className="vm-page-hero">
        <div className="container">
          <p className="vm-kicker">
            <IconSparkles width={15} height={15} />
            Explora a tu manera
          </p>
          <h1 className="vm-page-hero__title">
            Encuentra tu próximo <span>plan</span>
          </h1>
          <p className="vm-page-hero__lead">
            Filtra por tema, busca por nombre o cambia al mapa. Cada ficha guarda su historia, su
            ubicación y la opción de verla en 360°.
          </p>
        </div>
      </section>

      <div className="container vm-explore__layout">
        <div className="vm-explore__toolbar">
          <div className="vm-search">
            <IconSearch width={20} height={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("explore.search")}
              aria-label={t("explore.search")}
              autoComplete="off"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label={t("explore.clear")}>
                <IconClose width={16} height={16} />
              </button>
            )}
          </div>

          <div className="vm-segment" role="group" aria-label="Vista">
            <button
              type="button"
              className={view === "grid" ? "is-active" : undefined}
              onClick={() => setView("grid")}
            >
              <IconGrid width={16} height={16} />
              Tarjetas
            </button>
            <button
              type="button"
              className={view === "map" ? "is-active" : undefined}
              onClick={() => setView("map")}
            >
              <IconMap width={16} height={16} />
              Mapa
            </button>
          </div>
        </div>

        <div className="vm-filter-groups">
          <div className="vm-filter-row">
            <span className="vm-filter-row__label">Todo</span>
            <button
              type="button"
              className={`vm-filter-chip${category === null ? " is-active" : ""}`}
              onClick={() => selectCategory(null)}
            >
              <IconSparkles width={15} height={15} />
              Todo Maracaibo
              <b>{places.length}</b>
            </button>
          </div>

          {CATEGORY_GROUPS.map((group) => {
            const groupCategories = CATEGORIES.filter((item) => item.group === group.slug);
            if (groupCategories.length === 0) return null;
            return (
              <div className="vm-filter-row" key={group.slug}>
                <span className="vm-filter-row__label">{group.label}</span>
                <div className="vm-filter-row__chips">
                  {groupCategories.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      className={`vm-filter-chip${category === item.slug ? " is-active" : ""}`}
                      style={{
                        ["--from" as string]: item.from,
                        ["--to" as string]: item.to,
                        ["--soft" as string]: item.soft,
                      }}
                      onClick={() => selectCategory(item.slug)}
                    >
                      <CategoryIcon name={item.icon} width={15} height={15} />
                      {t(item.nameKey)}
                      <b>{counts[item.slug] ?? 0}</b>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="vm-results-bar">
          <div>
            <h2 className="vm-results-bar__title">
              {deferredQuery.trim()
                ? `Resultados para “${deferredQuery.trim()}”`
                : activeCategory
                  ? t(activeCategory.nameKey)
                  : "Todo Maracaibo"}
            </h2>
            <p>
              {loading
                ? "Cargando lugares…"
                : `${visible.length} ${visible.length === 1 ? "lugar" : "lugares"} para descubrir`}
            </p>
          </div>
          <div className="vm-sort" role="group" aria-label={t("explore.sort")}>
            <span>
              <IconSort width={15} height={15} />
              {t("explore.sort")}
            </span>
            <button
              type="button"
              className={sort === "popular" ? "is-active" : undefined}
              onClick={() => setSort("popular")}
            >
              {sort === "popular" && <IconCheck width={13} height={13} />}
              Populares
            </button>
            <button
              type="button"
              className={sort === "az" ? "is-active" : undefined}
              onClick={() => setSort("az")}
            >
              {sort === "az" && <IconCheck width={13} height={13} />}
              A – Z
            </button>
          </div>
        </div>

        {view === "map" ? (
          <div className="vm-explore__map">
            {loading ? (
              <div className="vm-map-skeleton" aria-busy="true" />
            ) : (
              <MapView
                places={mapList}
                selectedSlug={mapFocus}
                overview={overview}
                onSelect={setMapFocus}
                onOpenPlace={onOpenPlace}
              />
            )}
          </div>
        ) : loading ? (
          <div className="vm-place-grid">
            {Array.from({ length: 9 }, (_, index) => (
              <div key={index} className="vm-place-card vm-place-card--skeleton" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="vm-empty">
            <span className="vm-empty__icon" aria-hidden="true">
              <IconSearch width={30} height={30} />
            </span>
            <h2>No encontramos lugares con esa búsqueda</h2>
            <p>Prueba con otra palabra o cambia de tema. Maracaibo tiene mucho más.</p>
            <button
              type="button"
              className="vm-btn vm-btn--primary"
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
            >
              Ver todo Maracaibo
              <IconArrowRight width={16} height={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="vm-place-grid">
              {cards.map((place, index) => (
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
            {visible.length > cards.length && (
              <div className="vm-more">
                <button type="button" className="vm-btn vm-btn--soft" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
                  Ver más lugares
                  <IconArrowRight width={16} height={16} />
                </button>
                <span>
                  Mostrando {cards.length} de {visible.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
