import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import { MAPS_GENERAL_QUERY, MAP_IMAGE } from "../config";
import { categoryBySlug } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { googleMapsPlaceUrl, googleMapsSearchUrl } from "../lib/maps";
import { primaryCategory } from "../lib/places";
import { boundsFor, project } from "../lib/projection";
import type { Place } from "../types";
import { Cover } from "./Cover";
import {
  CategoryIcon,
  IconClose,
  IconCompass,
  IconExpand,
  IconExternal,
  IconMapPin,
  IconMinimize,
  IconSearch,
} from "./icons";

export const MAP_W = 800;
export const MAP_H = 520;

interface Props {
  places: readonly Place[];
  selectedSlug: string | null;
  overview: boolean;
  onSelect: (slug: string | null) => void;
  onOpenPlace: (slug: string) => void;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Mapa de Maracaibo con imagen base real (OpenStreetMap · CARTO) y puntos
 * tocables. Para la ruta exacta, los botones abren Google Maps.
 */
export function MapView({ places, selectedSlug, overview, onSelect, onOpenPlace }: Props) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const minimizeRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const bounds = useMemo(() => MAP_IMAGE?.bounds ?? boundsFor([...places], MAP_W / MAP_H), [places]);
  const pins = useMemo(
    () =>
      places.map((place, index) => ({
        place,
        n: index + 1,
        ...project(place.latitude, place.longitude, bounds, MAP_W, MAP_H),
      })),
    [places, bounds]
  );
  const selected = places.find((place) => place.slug === selectedSlug) ?? null;
  const selectedPin = pins.find((pin) => pin.place.slug === selectedSlug) ?? null;
  const selectedCategory = selected ? categoryBySlug(primaryCategory(selected)) : undefined;

  const results = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return [];
    return places
      .filter((place) => {
        const category = categoryBySlug(primaryCategory(place));
        const haystack = normalize(
          [
            place.name,
            place.shortDescription,
            place.address,
            place.categoryName,
            category ? t(category.nameKey) : "",
            ...place.tags,
          ].join(" ")
        );
        return needle.split(/\s+/).every((word) => haystack.includes(word));
      })
      .slice(0, 7);
  }, [places, query, t]);

  const showResults = searchFocused && query.trim().length > 0;

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    minimizeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  const pick = (slug: string) => {
    onSelect(slug);
    setQuery("");
    setSearchFocused(false);
    searchRef.current?.blur();
  };

  if (places.length === 0) {
    return (
      <div className="map-card map-card--empty">
        <span className="map-card__empty-icon" aria-hidden="true">
          <IconMapPin width={28} height={28} />
        </span>
        <p>{t("map.noResults")}</p>
      </div>
    );
  }

  return (
    <div className={`map-card vm-map${expanded ? " map-card--expanded" : ""}`}>
      <div className="map-frame vm-map__frame">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="map-svg vm-map__svg"
          role="group"
          aria-label={t("map.title")}
          onClick={() => onSelect(null)}
        >
          <defs>
            <linearGradient id={`pin-shine-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
            </linearGradient>
            <radialGradient id={`map-glow-${uid}`} cx="50%" cy="46%" r="58%">
              <stop offset="55%" stopColor="#0a3d45" stopOpacity="0" />
              <stop offset="100%" stopColor="#0a3d45" stopOpacity="0.24" />
            </radialGradient>
            <filter id={`pin-shadow-${uid}`} x="-80%" y="-60%" width="260%" height="240%">
              <feDropShadow dx="0" dy="4" stdDeviation="3.2" floodColor="#14303a" floodOpacity="0.36" />
            </filter>
          </defs>

          {MAP_IMAGE ? (
            <image
              href={MAP_IMAGE.image}
              x="0"
              y="0"
              width={MAP_W}
              height={MAP_H}
              preserveAspectRatio="xMidYMid slice"
              className="vm-map__photo"
            />
          ) : (
            <MapBackdrop />
          )}

          <rect
            width={MAP_W}
            height={MAP_H}
            fill={`url(#map-glow-${uid})`}
            className="vm-map__vignette"
            pointerEvents="none"
          />

          {pins.map(({ place, n, x, y }) => {
            const active = place.slug === selectedSlug;
            const category = categoryBySlug(primaryCategory(place));
            return (
              <g
                key={place.slug}
                transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                className={`pin${active ? " pin--active" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${place.name}. ${t("map.tapPin")}`}
                aria-pressed={active}
                style={
                  {
                    "--pin": category?.from ?? "#E8604C",
                    "--pin-2": category?.to ?? "#B43A2A",
                  } as CSSProperties
                }
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(active ? null : place.slug);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    onSelect(active ? null : place.slug);
                  }
                }}
              >
                <ellipse className="pin__shadow-pin" cy="2.5" rx="10" ry="3.4" />
                <circle className="pin__hit" r="26" cy="-22" />
                {active && (
                  <>
                    <circle className="pin__wave" cy="-26" r="16" />
                    <circle className="pin__wave pin__wave--second" cy="-26" r="16" />
                  </>
                )}
                <g filter={`url(#pin-shadow-${uid})`}>
                  <path
                    className="pin__shape"
                    d="M0 0C-4.9-9.8-16-15.5-16-27.5a16 16 0 1 1 32 0C16-15.5 4.9-9.8 0 0z"
                  />
                  <circle className="pin__dot" cy="-27.5" r="10.5" />
                  <path
                    className="pin__shine"
                    d="M0 0C-4.9-9.8-16-15.5-16-27.5a16 16 0 0 1 32 0C16-15.5 4.9-9.8 0 0z"
                    fill={`url(#pin-shine-${uid})`}
                  />
                  <text className="pin__num" y="-23.6" textAnchor="middle">
                    {n}
                  </text>
                </g>
              </g>
            );
          })}

          {selectedPin && (
            <foreignObject
              x={Math.min(Math.max(selectedPin.x - 100, 8), MAP_W - 208)}
              y={Math.min(selectedPin.y + 12, MAP_H - 46)}
              width="200"
              height="38"
              className="vm-map__callout"
              pointerEvents="none"
            >
              <div className="vm-map__callout-pill">
                <span
                  className="vm-map__callout-dot"
                  style={{ background: selectedCategory?.from ?? "#E8604C" }}
                />
                <span>{selectedPin.place.name}</span>
              </div>
            </foreignObject>
          )}
        </svg>

        <div className="vm-map__search">
          <div className={`vm-map__search-box${showResults ? " is-open" : ""}`}>
            <IconSearch width={18} height={18} />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                // deja que el clic en una sugerencia se registre antes de cerrar
                window.setTimeout(() => setSearchFocused(false), 140);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("");
                  setSearchFocused(false);
                }
                if (event.key === "Enter" && results[0]) {
                  event.preventDefault();
                  pick(results[0].slug);
                }
              }}
              placeholder={t("explore.search")}
              aria-label={t("explore.search")}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                aria-label={t("explore.clear")}
              >
                <IconClose width={15} height={15} />
              </button>
            )}
          </div>

          {showResults && (
            <ul className="vm-map__results" role="listbox" aria-label={t("explore.search")}>
              {results.map((place) => {
                const category = categoryBySlug(primaryCategory(place));
                const active = place.slug === selectedSlug;
                return (
                  <li key={place.slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={active ? "is-active" : ""}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => pick(place.slug)}
                    >
                      <span
                        className="vm-map__result-dot"
                        style={{ background: category?.to ?? "#E8604C" }}
                      />
                      <span className="vm-map__result-copy">
                        <strong>{place.name}</strong>
                        <small>{category ? t(category.nameKey) : place.categoryName}</small>
                      </span>
                      <IconArrowMini />
                    </button>
                  </li>
                );
              })}
              {results.length === 0 && <li className="vm-map__results-empty">{t("explore.empty")}</li>}
            </ul>
          )}
        </div>

        <div className="vm-map__tools">
          <span className="map-count">
            {overview ? t("map.showingTop") : t("map.showingAll", { n: places.length })}
          </span>
          <button
            ref={expanded ? minimizeRef : undefined}
            type="button"
            className="map-expand"
            onClick={() => setExpanded((value) => !value)}
            aria-label={expanded ? t("map.collapse") : t("map.expand")}
            aria-expanded={expanded}
          >
            {expanded ? <IconMinimize width={17} height={17} /> : <IconExpand width={17} height={17} />}
          </button>
        </div>

        <a
          className="vm-map__credit"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          © OpenStreetMap · © CARTO
        </a>
      </div>

      <div className="map-bar">
        {selected ? (
          <>
            <div className="map-bar__main">
              <Cover place={selected} className="map-bar__thumb" />
              <div className="map-bar__info">
                <span
                  className="map-bar__theme"
                  style={
                    {
                      "--from": selectedCategory?.from ?? "#0B6A73",
                      "--to": selectedCategory?.to ?? "#2FAFBE",
                    } as CSSProperties
                  }
                >
                  {selectedCategory && (
                    <CategoryIcon name={selectedCategory.icon} width={13} height={13} />
                  )}
                  {selectedCategory ? t(selectedCategory.nameKey) : selected.categoryName}
                </span>
                <strong>{selected.name}</strong>
                <span>{selected.shortDescription}</span>
              </div>
            </div>
            <div className="map-bar__actions">
              <button type="button" className="btn btn--ghost" onClick={() => onOpenPlace(selected.slug)}>
                {t("map.viewPlace")}
              </button>
              <a
                className="btn btn--dark"
                href={googleMapsPlaceUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("map.howTo")}
                <IconExternal width={16} height={16} />
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="map-bar__main">
              <span className="map-bar__thumb map-bar__thumb--empty" aria-hidden="true">
                <IconCompass width={24} height={24} />
              </span>
              <div className="map-bar__info">
                <span className="map-bar__kicker">{t("map.kicker")}</span>
                <strong>{t("map.tapPin")}</strong>
                <span>{t("map.tapPinHint")}</span>
              </div>
            </div>
            <div className="map-bar__actions">
              <a
                className="btn btn--dark"
                href={googleMapsSearchUrl(MAPS_GENERAL_QUERY)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("map.openMaps")}
                <IconExternal width={16} height={16} />
              </a>
            </div>
          </>
        )}
      </div>

      <div className="map-strip" role="group" aria-label={t("map.title")}>
        {places.map((place, index) => {
          const category = categoryBySlug(primaryCategory(place));
          const active = place.slug === selectedSlug;
          return (
            <button
              key={place.slug}
              type="button"
              className={`map-strip__item${active ? " map-strip__item--active" : ""}`}
              aria-pressed={active}
              onClick={() => onSelect(active ? null : place.slug)}
              style={
                {
                  "--from": category?.from ?? "#0B6A73",
                  "--to": category?.to ?? "#2FAFBE",
                } as CSSProperties
              }
            >
              <span className="map-strip__num" aria-hidden="true">
                {index + 1}
              </span>
              <span className="map-strip__body">
                <strong>{place.name}</strong>
                <span>{category ? t(category.nameKey) : place.categoryName}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Pequeña flecha dibujada para las sugerencias del buscador del mapa. */
function IconArrowMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Fondo dibujado de respaldo: barrios, parques, avenidas, el lago y el puente. */
export function MapBackdrop({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const land = `map-land-${uid}`;
  const water = `map-water-${uid}`;
  const park = `map-park-${uid}`;

  return (
    <g aria-hidden="true" className={`map-backdrop${compact ? " map-backdrop--compact" : ""}`}>
      <defs>
        <linearGradient id={land} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#F8F1E3" />
          <stop offset="100%" stopColor="#EFE3CF" />
        </linearGradient>
        <linearGradient id={water} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#8FD3D8" />
          <stop offset="100%" stopColor="#2A8D9B" />
        </linearGradient>
        <linearGradient id={park} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CFE6B4" />
          <stop offset="100%" stopColor="#A8D09A" />
        </linearGradient>
      </defs>

      <rect width={MAP_W} height={MAP_H} fill={`url(#${land})`} />

      {/* Barrios */}
      <path d="M0 0h430l-34 148H0z" fill="#FBF6EC" opacity="0.8" />
      <path d="M0 148h396l-26 146H0z" fill="#F3E7D1" opacity="0.65" />
      <path d="M0 294h370l-22 132H0z" fill="#FBF4E8" opacity="0.7" />
      <path d="M0 426h348l-18 94H0z" fill="#F1E4CE" opacity="0.6" />

      {/* Parques */}
      <rect x="76" y="96" width="148" height="104" rx="24" fill={`url(#${park})`} />
      <rect x="352" y="338" width="170" height="108" rx="26" fill={`url(#${park})`} opacity="0.9" />
      <rect x="206" y="414" width="96" height="62" rx="18" fill={`url(#${park})`} opacity="0.8" />
      <g fill="#6FA96B" opacity="0.5">
        <circle cx="112" cy="126" r="5" />
        <circle cx="140" cy="154" r="4" />
        <circle cx="176" cy="122" r="5" />
        <circle cx="196" cy="164" r="4" />
        <circle cx="386" cy="370" r="5" />
        <circle cx="420" cy="404" r="4" />
        <circle cx="466" cy="368" r="5" />
        <circle cx="238" cy="440" r="4" />
      </g>

      {/* Lago de Maracaibo */}
      <path
        d="M638 0c42 64-8 132 36 196 34 50 8 98 38 146 20 32 16 74 10 178h78V0z"
        fill={`url(#${water})`}
      />
      <path
        d="M638 0c42 64-8 132 36 196 34 50 8 98 38 146 20 32 16 74 10 178"
        fill="none"
        stroke="#D9F2F1"
        strokeWidth="5"
        opacity="0.85"
      />
      <g stroke="#EAFBFA" strokeWidth="3.4" strokeLinecap="round" opacity="0.5">
        <path d="M676 74h42M660 118h52M690 262h46M672 306h54M700 402h44M684 446h48" />
      </g>

      {/* Avenidas principales */}
      <g fill="none" stroke="#DCCBAF" strokeWidth="10" strokeLinecap="round">
        <path d="M0 150h612M0 296h584M0 438h548M170 0v520M342 0v520M512 0v452" />
        <path d="M0 520C160 392 306 314 448 236S606 112 642 16" />
      </g>
      <g fill="none" stroke="#FFFDF7" strokeWidth="6" strokeLinecap="round">
        <path d="M0 150h612M0 296h584M0 438h548M170 0v520M342 0v520M512 0v452" />
        <path d="M0 520C160 392 306 314 448 236S606 112 642 16" />
      </g>
      <g fill="none" stroke="#FFFDF7" strokeWidth="3" opacity="0.75">
        <path d="M64 0v520M252 0v520M428 0v520" />
        <path d="M0 220h604M0 360h570M0 480h540" />
      </g>

      {/* Puente sobre el Lago */}
      <g className="map-bridge">
        <path d="M606 252c64-24 124-42 204-52" fill="none" stroke="#F7ECD8" strokeWidth="4" />
        <path d="M606 257c64-24 124-42 204-52" fill="none" stroke="#F7ECD8" strokeWidth="1.4" opacity="0.7" />
        <g stroke="#F7ECD8" strokeWidth="3" strokeLinecap="round">
          <path d="M660 241v-44M668 239v-44M732 211v-38M740 209v-38" />
          <path d="M654 197h20M726 173h20" />
        </g>
        <path
          d="M606 247c54-8 84-42 112-42s48 30 84 18 54-28 108-34"
          fill="none"
          stroke="#F7ECD8"
          strokeWidth="2"
          opacity="0.9"
        />
        <g stroke="#F7ECD8" strokeWidth="0.9" opacity="0.55">
          <path d="M624 250v-26M644 246v-34M682 236v-34M708 227v-32M760 212v-30M782 208v-30" />
        </g>
      </g>

      {/* Brújula */}
      {!compact && (
        <g className="map-compass" transform="translate(744 466)">
          <circle r="22" fill="rgba(255,255,255,.74)" />
          <path d="M0 -14l6 20-6-5-6 5z" fill="#0B6A73" />
          <text y="-26" textAnchor="middle">
            N
          </text>
        </g>
      )}

      {/* Etiquetas */}
      {!compact && (
        <g className="map-labels">
          <text className="map-label map-label--district" x="238" y="196" textAnchor="middle">
            Centro
          </text>
          <text className="map-label map-label--district" x="436" y="352" textAnchor="middle">
            Bella Vista
          </text>
          <text className="map-label map-label--district" x="150" y="480" textAnchor="middle">
            La Chinita
          </text>
          <text
            className="map-label map-label--water"
            x="756"
            y="336"
            textAnchor="middle"
            transform="rotate(-90 756 336)"
          >
            {t("map.lake")}
          </text>
          <text className="map-label map-label--bridge" x="700" y="146" textAnchor="middle">
            {t("map.bridge")}
          </text>
        </g>
      )}
    </g>
  );
}
