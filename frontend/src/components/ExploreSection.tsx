import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { CATEGORIES, type CategoryDef } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { usePresencePlaces } from "../hooks/usePresencePlaces";
import { popularityScore, popularityTier } from "../lib/popularity";
import { primaryCategory, type CategoryFilter, type SortMode } from "../lib/places";
import type { Place } from "../types";
import {
  CategoryIcon,
  IconArrowRight,
  IconCheck,
  IconClose,
  IconCompass,
  IconSearch,
  IconSort,
  IconSparkles,
} from "./icons";

interface Props {
  places: readonly Place[];
  visible: readonly Place[];
  category: CategoryFilter;
  query: string;
  sort: SortMode;
  counts: Record<string, number>;
  loading: boolean;
  onCategory: (category: CategoryFilter) => void;
  onQuery: (query: string) => void;
  onSort: (sort: SortMode) => void;
  onOpenPlace: (slug: string) => void;
}

export function ExploreSection({
  places,
  visible,
  category,
  query,
  sort,
  counts,
  loading,
  onCategory,
  onQuery,
  onSort,
  onOpenPlace,
}: Props) {
  const { t } = useI18n();
  const searchId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [railEdges, setRailEdges] = useState({ start: false, end: false });
  const activeDefinition = CATEGORIES.find((item) => item.slug === category);
  const searching = query.trim().length > 0;
  const pickTheme = category === null && !searching;

  // La barra de temas es una sola fila deslizable; los botones solo aparecen
  // cuando hay más temas de los que caben en pantalla.
  const syncRail = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const start = node.scrollLeft > 6;
    const end = max > 6 && node.scrollLeft < max - 6;
    setRailEdges((previous) =>
      previous.start === start && previous.end === end ? previous : { start, end }
    );
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    syncRail();
    node.addEventListener("scroll", syncRail, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncRail);
    observer?.observe(node);
    return () => {
      node.removeEventListener("scroll", syncRail);
      observer?.disconnect();
    };
  }, [syncRail, loading]);

  useEffect(() => {
    syncRail();
  });

  // Al elegir una categoría, acerca el panel de burbujas si quedó fuera de la pantalla.
  // Así en el teléfono no hay que bajar toda la parrilla para ver el resultado.
  const selectCategory = (next: CategoryFilter) => {
    onCategory(next);
    const node = panelRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.top > window.innerHeight - 180) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: window.scrollY + rect.top - 84,
        behavior: reduce ? "auto" : "smooth",
      });
    }
  };

  const scrollRail = (direction: number) => {
    const node = trackRef.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rtl = window.getComputedStyle(node).direction === "rtl";
    node.scrollBy({
      left: direction * Math.max(240, node.clientWidth * 0.72) * (rtl ? -1 : 1),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  // «Sorpréndeme»: elige un tema con contenido para que el visitante no se quede en blanco.
  const surprise = () => {
    const options = CATEGORIES.filter((definition) => (counts[definition.slug] ?? 0) > 0);
    const pool = options.length > 0 ? options : CATEGORIES;
    const pick = pool[Math.floor(Math.random() * pool.length)] ?? pool[0] ?? CATEGORIES[0];
    if (pick) selectCategory(pick.slug);
  };

  // Cambio de categoría u orden: primero se despiden las burbujas actuales y
  // después entran las nuevas. La búsqueda, en cambio, se actualiza al instante.
  const cloudKey = `${category}-${sort}`;
  const [cloud, setCloud] = useState({ key: cloudKey, places: visible, leaving: false });

  useEffect(() => {
    if (cloud.key === cloudKey) {
      if (cloud.places !== visible) setCloud((previous) => ({ ...previous, places: visible }));
      return;
    }
    setCloud((previous) => ({ ...previous, leaving: true }));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => setCloud({ key: cloudKey, places: visible, leaving: false }),
      reduce ? 0 : 180
    );
    return () => window.clearTimeout(timer);
  }, [cloudKey, cloud.key, cloud.places, visible]);
  const panelTitle = searching
    ? t("explore.searchResults", { q: query.trim() })
    : category === null
      ? t("explore.promptTitle")
      : t("explore.bubblesTitle", { category: t(activeDefinition?.nameKey ?? "explore.allShort") });

  return (
    <section id="explorar" className="section section--explore">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{t("explore.kicker")}</p>
          <h2 className="section-title">{t("explore.title")}</h2>
          <p className="section-lead">{t("explore.lead")}</p>
        </div>

        <div className="explore-search">
          <IconSearch width={21} height={21} />
          <label className="sr-only" htmlFor={searchId}>
            {t("explore.search")}
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={t("explore.search")}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="explore-search__clear"
              onClick={() => onQuery("")}
              aria-label={t("explore.clear")}
            >
              <IconClose width={16} height={16} />
            </button>
          )}
        </div>

        <div
          className="theme-rail"
          data-start={railEdges.start ? "true" : "false"}
          data-end={railEdges.end ? "true" : "false"}
        >
          <div
            className="theme-rail__track"
            role="group"
            aria-label={t("explore.title")}
            ref={trackRef}
          >
            {CATEGORIES.map((definition) => (
              <ThemeChip
                key={definition.slug}
                active={category === definition.slug}
                name={t(definition.nameKey)}
                count={loading && places.length === 0 ? null : counts[definition.slug] ?? 0}
                icon={definition.icon}
                from={definition.from}
                to={definition.to}
                soft={definition.soft}
                onClick={() => selectCategory(definition.slug)}
              />
            ))}
          </div>
          <div className="theme-rail__nav">
            <button
              type="button"
              className="theme-rail__btn"
              onClick={() => scrollRail(-1)}
              disabled={!railEdges.start}
              aria-label={t("explore.prevTheme")}
            >
              <IconArrowRight
                width={16}
                height={16}
                className="theme-rail__arrow theme-rail__arrow--back"
              />
            </button>
            <button
              type="button"
              className="theme-rail__btn"
              onClick={() => scrollRail(1)}
              disabled={!railEdges.end}
              aria-label={t("explore.nextTheme")}
            >
              <IconArrowRight width={16} height={16} className="theme-rail__arrow" />
            </button>
          </div>
        </div>

        <div className="bubble-panel" ref={panelRef}>
          <div className="bubble-panel__head">
            <div className="bubble-panel__title-row">
              <span
                className="bubble-panel__badge"
                style={
                  {
                    "--from": activeDefinition?.from ?? "#0D6B76",
                    "--to": activeDefinition?.to ?? "#2FAFBE",
                  } as CSSProperties
                }
                aria-hidden="true"
              >
                {activeDefinition ? (
                  <CategoryIcon name={activeDefinition.icon} width={20} height={20} />
                ) : (
                  <IconSparkles width={20} height={20} />
                )}
              </span>
              <div>
                <h3 className="bubble-panel__title">{panelTitle}</h3>
                <p className="bubble-panel__hint" aria-live="polite">
                  {loading && places.length === 0
                    ? t("explore.loading")
                    : pickTheme
                      ? t("explore.promptHint")
                      : `${t("explore.bubblesHint")} · ${
                          visible.length === 1
                            ? t("explore.resultOne")
                            : t("explore.results", { n: visible.length })
                        }`}
                </p>
              </div>
            </div>

            {!pickTheme && (
              <div className="sort-control" role="group" aria-label={t("explore.sort")}>
                <span className="sort-control__label">
                  <IconSort width={15} height={15} />
                  {t("explore.sort")}
                </span>
                <button
                  type="button"
                  aria-pressed={sort === "popular"}
                  onClick={() => onSort("popular")}
                  className="sort-control__button"
                >
                  {sort === "popular" && <IconCheck width={13} height={13} />}
                  {t("explore.sortPopular")}
                </button>
                <button
                  type="button"
                  aria-pressed={sort === "az"}
                  onClick={() => onSort("az")}
                  className="sort-control__button"
                >
                  {sort === "az" && <IconCheck width={13} height={13} />}
                  {t("explore.sortAz")}
                </button>
              </div>
            )}
          </div>

          {loading && cloud.places.length === 0 ? (
            <div className="bubble-cloud bubble-cloud--loading" aria-busy="true" aria-label={t("explore.loading")}>
              {Array.from({ length: 9 }, (_, index) => (
                <span
                  key={index}
                  className="bubble-skeleton"
                  style={{ "--i": index } as CSSProperties}
                />
              ))}
            </div>
          ) : pickTheme ? (
            <div className="theme-prompt">
              <span className="theme-prompt__art" aria-hidden="true">
                <IconCompass width={30} height={30} />
              </span>
              <button type="button" className="btn btn--primary btn--sm" onClick={surprise}>
                <IconSparkles width={16} height={16} />
                {t("explore.surprise")}
              </button>
            </div>
          ) : cloud.places.length === 0 ? (
            <div className="explore-empty">
              <span className="explore-empty__icon" aria-hidden="true">
                <IconSearch width={26} height={26} />
              </span>
              <p className="explore-empty__title">{t("explore.empty")}</p>
              <p className="explore-empty__hint">{t("explore.emptyHint")}</p>
            </div>
          ) : (
            <BubbleCloud
              key={cloud.key}
              places={cloud.places}
              leaving={cloud.leaving}
              onOpenPlace={onOpenPlace}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ThemeChip({
  active,
  name,
  count,
  icon,
  from,
  to,
  soft,
  onClick,
}: {
  active: boolean;
  name: string;
  count: number | null;
  icon: CategoryDef["icon"] | "sparkles";
  from: string;
  to: string;
  soft: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`theme-chip${active ? " theme-chip--active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
      style={{ "--from": from, "--to": to, "--soft": soft } as CSSProperties}
    >
      <span className="theme-chip__icon" aria-hidden="true">
        {icon === "sparkles" ? (
          <IconSparkles width={18} height={18} />
        ) : (
          <CategoryIcon name={icon} width={18} height={18} />
        )}
      </span>
      <span className="theme-chip__name">{name}</span>
      {count !== null && <span className="theme-chip__count">{count}</span>}
    </button>
  );
}

function BubbleCloud({
  places,
  leaving,
  onOpenPlace,
}: {
  places: readonly Place[];
  leaving: boolean;
  onOpenPlace: (slug: string) => void;
}) {
  const entries = usePresencePlaces(places);
  const { t } = useI18n();

  return (
    <div className={`bubble-cloud${leaving ? " bubble-cloud--leaving" : ""}`}>
      {entries.map((entry, index) => {
        const place = entry.item;
        const definition = CATEGORIES.find((item) => item.slug === primaryCategory(place));
        const score = popularityScore(place.slug);
        const tier = popularityTier(score);
        return (
          <button
            key={place.slug}
            type="button"
            className={`bubble${entry.leaving ? " bubble--leaving" : ""}`}
            data-tier={tier}
            style={
              {
                "--from": definition?.from ?? "#0D6B76",
                "--to": definition?.to ?? "#2FAFBE",
                "--soft": definition?.soft ?? "#E0F3F5",
                "--i": Math.min(index, 16),
              } as CSSProperties
            }
            onClick={() => onOpenPlace(place.slug)}
            aria-label={`${place.name} · ${t("places.details")}`}
            title={`${place.name} · ${t("sheet.popularity")} ${score}/100`}
          >
            <span className="bubble__dot" aria-hidden="true" />
            {place.name}
          </button>
        );
      })}
    </div>
  );
}
