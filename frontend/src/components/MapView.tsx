import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MAPS_GENERAL_QUERY, MAP_IMAGE, MAP_TILES } from "../config";
import { categoryBySlug } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { googleMapsPlaceUrl, googleMapsSearchUrl } from "../lib/maps";
import { primaryCategory } from "../lib/places";
import { boundsFor } from "../lib/projection";
import type { Place } from "../types";
import { MAP_H, MAP_W } from "./MapBackdrop";
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

/** Ajusta la imagen al contenedor: completa (cover) o encaja entera (contain). */
function fitImage(map: L.Map, bounds: L.LatLngBounds, mode: "contain" | "cover"): void {
  const fitZoom = map.getBoundsZoom(bounds, false);
  if (mode === "contain") {
    map.setView(bounds.getCenter(), fitZoom, { animate: false });
    return;
  }
  const northWest = map.project(bounds.getNorthWest(), fitZoom);
  const southEast = map.project(bounds.getSouthEast(), fitZoom);
  const width = Math.abs(southEast.x - northWest.x);
  const height = Math.abs(southEast.y - northWest.y);
  const size = map.getSize();
  if (width <= 0 || height <= 0) return;
  const scale = Math.max(size.x / width, size.y / height);
  const zoom = Math.min(map.getMaxZoom(), fitZoom + Math.log2(scale));
  map.setView(bounds.getCenter(), zoom, { animate: false });
}

/** Icono de gota con el número del lugar, dibujado como SVG dentro de Leaflet. */
function pinHtml(n: number, from: string, to: string, active: boolean): string {
  return `
    <svg class="vm-pin${active ? " is-active" : ""}" width="34" height="44" viewBox="0 0 34 44" aria-hidden="true">
      <defs>
        <linearGradient id="vm-pin-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <ellipse cx="17" cy="41.4" rx="8" ry="2.4" fill="rgba(16,43,51,.28)" />
      <path d="M17 42C12.6 33.8 2.5 27 2.5 16.2a14.5 14.5 0 1 1 29 0C31.5 27 21.4 33.8 17 42Z" fill="url(#vm-pin-grad)" stroke="#fff" stroke-width="2.4" />
      <circle cx="17" cy="16" r="9.4" fill="#fff" />
      <text x="17" y="20.1" text-anchor="middle" font-size="10.5" font-weight="850" fill="#13323b">${n}</text>
    </svg>`;
}

/**
 * Mapa interactivo de Maracaibo.
 *
 * Usa una imagen base local (OpenStreetMap · OpenFreeMap) para que el mapa
 * funcione sin conexión y no dependa de claves de API. Leaflet aporta zoom,
 * arrastre y gestos táctiles; MarkerCluster agrupa los pines que se solapan.
 */
export function MapView({ places, selectedSlug, overview, onSelect, onOpenPlace }: Props) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const minimizeRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const onSelectRef = useRef(onSelect);
  const lastPlacesKey = useRef("");
  const lastSelected = useRef<string | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const selected = places.find((place) => place.slug === selectedSlug) ?? null;
  const selectedCategory = selected ? categoryBySlug(primaryCategory(selected)) : undefined;
  const imageBounds = useMemo(() => {
    const bounds = MAP_IMAGE?.bounds ?? boundsFor([...places], MAP_W / MAP_H);
    return L.latLngBounds(
      L.latLng(bounds.south, bounds.west),
      L.latLng(bounds.north, bounds.east)
    );
  }, [places]);

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

  // Crear el mapa una sola vez.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      minZoom: 11,
      maxZoom: 18,
      zoomSnap: 0,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
      maxBoundsViscosity: 0.85,
      preferCanvas: true,
    });

    if (MAP_IMAGE) {
      L.imageOverlay(MAP_IMAGE.image, imageBounds, {
        alt: "Mapa de Maracaibo",
        interactive: false,
        className: "vm-map__image",
      }).addTo(map);
    }

    // Con internet, las calles reales van encima de la imagen local y permiten
    // acercarse hasta ver cada sitio en su cuadra. Si una tesela falla, se ve la imagen.
    map.attributionControl.setPrefix(false);
    L.tileLayer(MAP_TILES.url, {
      attribution: MAP_TILES.attribution,
      maxNativeZoom: MAP_TILES.maxNativeZoom,
      maxZoom: 18,
      bounds: imageBounds,
      crossOrigin: true,
      className: "vm-map__tiles",
    }).addTo(map);

    fitImage(map, imageBounds, "contain");
    map.setMaxBounds(imageBounds.pad(0.06));
    map.on("click", () => onSelectRef.current(null));

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      maxClusterRadius: 42,
      iconCreateFunction: (group) =>
        L.divIcon({
          className: "vm-cluster-wrap",
          html: `<span class="vm-cluster"><b>${group.getChildCount()}</b></span>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        }),
    });
    cluster.addTo(map);

    mapRef.current = map;
    clusterRef.current = cluster;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
    };
    // El mapa se crea una vez; los pines se actualizan en el efecto siguiente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pintar / actualizar los pines.
  useEffect(() => {
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!map || !cluster) return;

    cluster.clearLayers();
    const markers = new Map<string, L.Marker>();
    const layers: L.Marker[] = [];

    places.forEach((place, index) => {
      const category = categoryBySlug(primaryCategory(place));
      const active = place.slug === selectedSlug;
      const icon = L.divIcon({
        className: "vm-pin-wrap",
        html: pinHtml(index + 1, category?.from ?? "#E8604C", category?.to ?? "#B43A2A", active),
        iconSize: [34, 44],
        iconAnchor: [17, 43],
      });
      const marker = L.marker(L.latLng(place.latitude, place.longitude), {
        icon,
        title: place.name,
        alt: place.name,
        keyboard: true,
        riseOnHover: true,
      });
      marker.on("click", () => onSelectRef.current(place.slug));
      marker.bindTooltip(place.name, {
        direction: "top",
        offset: [0, -6],
        opacity: 1,
        className: "vm-map__tip",
      });
      markers.set(place.slug, marker);
      layers.push(marker);
    });

    markersRef.current = markers;
    cluster.addLayers(layers);

    // Ajustar la vista solo cuando cambia el conjunto de lugares.
    const key = places.map((place) => place.slug).join("|");
    if (key !== lastPlacesKey.current) {
      lastPlacesKey.current = key;
      if (!expanded && places.length > 1) {
        const points = places.map((place) => L.latLng(place.latitude, place.longitude));
        map.fitBounds(L.latLngBounds(points), {
          padding: [38, 38],
          maxZoom: 15,
          animate: true,
          duration: 0.4,
        });
      }
    }

    if (selectedSlug) {
      const marker = markers.get(selectedSlug);
      if (marker && lastSelected.current !== selectedSlug) {
        lastSelected.current = selectedSlug;
        cluster.zoomToShowLayer(marker, () => {
          const place = places.find((item) => item.slug === selectedSlug);
          if (place) {
            // Acerca hasta ver la cuadra: varios sitios del casco están a menos de 100 m.
            map.setView(L.latLng(place.latitude, place.longitude), Math.max(map.getZoom(), 16), {
              animate: true,
              duration: 0.45,
            });
          }
        });
      }
    } else {
      lastSelected.current = null;
    }
  }, [places, selectedSlug, expanded]);

  // Mantener visible la ficha activa en la tira inferior.
  useEffect(() => {
    if (!selectedSlug) return;
    const item = stripRef.current?.querySelector<HTMLElement>(`[data-slug="${selectedSlug}"]`);
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedSlug]);

  // Pantalla completa.
  useEffect(() => {
    const map = mapRef.current;
    if (!expanded) {
      const timer = window.setTimeout(() => {
        map?.invalidateSize();
        if (map) fitImage(map, imageBounds, "contain");
      }, 280);
      return () => window.clearTimeout(timer);
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    minimizeRef.current?.focus();
    const timer = window.setTimeout(() => {
      map?.invalidateSize();
      if (map) fitImage(map, imageBounds, "cover");
    }, 280);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded, imageBounds]);

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
        <div
          ref={containerRef}
          className="vm-map__canvas"
          role="region"
          aria-label={t("map.title")}
        />

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
          <div className="vm-map__zoom">
            <button
              type="button"
              className="map-expand"
              onClick={() => mapRef.current?.zoomIn()}
              aria-label={t("map.zoomIn")}
              title={t("map.zoomIn")}
            >
              <IconZoomIn width={16} height={16} />
            </button>
            <button
              type="button"
              className="map-expand"
              onClick={() => mapRef.current?.zoomOut()}
              aria-label={t("map.zoomOut")}
              title={t("map.zoomOut")}
            >
              <IconZoomOut width={16} height={16} />
            </button>
          </div>
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
          © OpenStreetMap · OpenFreeMap
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

      <div ref={stripRef} className="map-strip" role="group" aria-label={t("map.title")}>
        {places.map((place, index) => {
          const category = categoryBySlug(primaryCategory(place));
          const active = place.slug === selectedSlug;
          return (
            <button
              key={place.slug}
              type="button"
              data-slug={place.slug}
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

function IconZoomIn(props: { width?: number; height?: number }) {
  return (
    <svg width={props.width ?? 16} height={props.height ?? 16} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconZoomOut(props: { width?: number; height?: number }) {
  return (
    <svg width={props.width ?? 16} height={props.height ?? 16} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

