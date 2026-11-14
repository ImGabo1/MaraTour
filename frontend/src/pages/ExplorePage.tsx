import { lazy, Suspense, useDeferredValue, useEffect, useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_GROUPS } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { PlaceCard, PlaceCardSkeleton, PlaceGrid } from "../components/PlaceCard";
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
import "./ExplorePage.css";

// Leaflet y el visor solo se descargan cuando el visitante abre el mapa.
const MapView = lazy(() =>
  import("../components/MapView").then((module) => ({ default: module.MapView }))
);

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
  const [sector, setSector] = useState<"todos" | "publico" | "privado">("todos");
  const deferredQuery = useDeferredValue(query);
  const counts = useMemo(() => countByCategory(places), [places]);
  const savedSet = useMemo(() => new Set(saved), [saved]);

  const hasSector = useMemo(() => places.some((place) => place.sector), [places]);
  const visible = useMemo(() => {
    const found = filterPlaces(places, category, deferredQuery);
    const bySector = sector === "todos" ? found : found.filter((place) => place.sector === sector);
    return sortPlaces(bySector, sort, lang);
  }, [places, category, deferredQuery, sort, lang, sector]);

  const mapList = useMemo(() => visible.slice(0, 24), [visible]);
  const overview = category === null && deferredQuery.trim() === "";
  const cards = visible.slice(0, limit);
  const activeCategory = category ? CATEGORIES.find((item) => item.slug === category) : null;

  useEffect(() => {
    setLimit(PAGE_SIZE);
    setMapFocus(null);
  }, [category, deferredQuery, sort, sector]);

  const selectCategory = (next: CategoryFilter) => {
    setCategory(next);
    setView("grid");
  };

  return (
    <main className={`mte-page mt-page-enter${view === "map" ? " mte-page--map" : ""}`}>
      <section className="mte-hero">
        <div className="mt-container">
          <p className="mte-kicker">
            <IconSparkles width={15} height={15} />
            Explora a tu manera
          </p>
          <h1 className="mte-hero__title">
            Encuentra tu próximo <span>plan</span>
          </h1>
          <p className="mte-hero__lead">
            Filtra por tema, busca por nombre o cambia al mapa. Cada ficha guarda su historia, su
            ubicación y la opción de verla en 360°.
          </p>
        </div>
      </section>

      <div className="mt-container mte-layout">
        <div className="mte-toolbar">
          <div className="mte-search glass glass--pill">
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

          <div className="mte-segment" role="group" aria-label="Vista">
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

        <div className="mte-filters">
          <div className="mte-filters__row">
            <span className="mte-filters__label">Todo</span>
            <button
              type="button"
              aria-pressed={category === null}
              className={`mte-chip${category === null ? " is-active" : ""}`}
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
              <div className="mte-filters__row" key={group.slug}>
                <span className="mte-filters__label">{group.label}</span>
                <div className="mte-filters__chips">
                  {groupCategories.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={category === item.slug}
                      className={`mte-chip${category === item.slug ? " is-active" : ""}`}
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

        {hasSector && (
          <div className="mte-filters__row mte-sector" role="group" aria-label="Tipo de atención">
            <span className="mte-filters__label">Atención</span>
            <div className="mte-filters__chips">
              {(
                [
                  ["todos", "Todas"],
                  ["publico", "Pública"],
                  ["privado", "Privada"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`mte-chip${sector === value ? " is-active" : ""}`}
                  aria-pressed={sector === value}
                  onClick={() => setSector(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mte-results">
          <div>
            <h2 className="mte-results__title">
              {deferredQuery.trim()
                ? `Resultados para “${deferredQuery.trim()}”`
                : activeCategory
                  ? t(activeCategory.nameKey)
                  : "Todo Maracaibo"}
            </h2>
            <p className="mte-results__count" role="status" aria-live="polite">
              {loading
                ? "Cargando lugares…"
                : `${visible.length} ${visible.length === 1 ? "lugar" : "lugares"} para descubrir`}
            </p>
          </div>
          <div className="mte-sort" role="group" aria-label={t("explore.sort")}>
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
          <div className="mte-map vm-explore__map">
            {loading ? (
              <div className="mte-map-skeleton vm-map-skeleton" aria-busy="true" />
            ) : (
              <Suspense fallback={<div className="mte-map-skeleton vm-map-skeleton" aria-busy="true" />}>
                <MapView
                  places={mapList}
                  selectedSlug={mapFocus}
                  overview={overview}
                  onSelect={setMapFocus}
                  onOpenPlace={onOpenPlace}
                />
              </Suspense>
            )}
          </div>
        ) : loading ? (
          <PlaceGrid busy>
            {Array.from({ length: 9 }, (_, index) => (
              <PlaceCardSkeleton key={index} />
            ))}
          </PlaceGrid>
        ) : visible.length === 0 ? (
          <div className="mte-empty">
            <svg className="mte-empty__sun" viewBox="0 0 120 120" aria-hidden="true" fill="none">
              <circle cx="60" cy="60" r="56" fill="#FFE08A" opacity="0.45" />
              <g stroke="#FFC83D" strokeWidth="5" strokeLinecap="round">
                {Array.from({ length: 12 }, (_, i) => (
                  <line key={i} x1="60" y1="14" x2="60" y2="24" transform={`rotate(${i * 30} 60 60)`} />
                ))}
              </g>
              <circle cx="60" cy="60" r="28" fill="#FFC83D" />
              <path d="M50 66 Q60 58 70 66" stroke="#0B2A4A" strokeWidth="3" strokeLinecap="round" />
              <circle cx="52" cy="54" r="2.5" fill="#0B2A4A" />
              <circle cx="68" cy="54" r="2.5" fill="#0B2A4A" />
            </svg>
            <h2>No encontramos lugares con esa búsqueda</h2>
            <p>Prueba con otra palabra o cambia de tema. Maracaibo tiene mucho más.</p>
            <button
              type="button"
              className="mt-btn mt-btn--primary"
              onClick={() => {
                setQuery("");
                setCategory(null);
                setSector("todos");
              }}
            >
              Ver todo Maracaibo
              <IconArrowRight width={16} height={16} />
            </button>
          </div>
        ) : (
          <>
            <PlaceGrid>
              {cards.map((place, index) => (
                <PlaceCard
                  key={place.slug}
                  place={place}
                  eager={index < 2}
                  onOpen={onOpenPlace}
                  onToggleSave={onToggleSave}
                  saved={savedSet.has(place.slug)}
                />
              ))}
            </PlaceGrid>
            {visible.length > cards.length && (
              <div className="mte-more">
                <button type="button" className="mt-btn mt-btn--soft" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
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
