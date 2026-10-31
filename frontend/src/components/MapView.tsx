import { useMemo } from "react";
import { MAPS_GENERAL_QUERY, MAP_IMAGE } from "../config";
import { googleMapsPlaceUrl, googleMapsSearchUrl } from "../lib/maps";
import { boundsFor, project } from "../lib/projection";
import type { Place } from "../types";
import { IconExternal } from "./icons";

const W = 800;
const H = 520;

interface Props {
  places: Place[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onOpenPlace: (slug: string) => void;
}

/**
 * Mapa como IMAGEN con puntos tocables (sin API de Google Maps = sin costo).
 * Para el detalle exacto, los botones llevan al Google Maps real.
 * Es ilustrativo hasta que el equipo ponga una captura real (ver config.ts → MAP_IMAGE).
 */
export function MapView({ places, selectedSlug, onSelect, onOpenPlace }: Props) {
  const bounds = useMemo(() => MAP_IMAGE?.bounds ?? boundsFor(places, W / H), [places]);
  const pins = useMemo(
    () => places.map((place, i) => ({ place, n: i + 1, ...project(place.latitude, place.longitude, bounds, W, H) })),
    [places, bounds]
  );
  const selected = places.find((p) => p.slug === selectedSlug) ?? null;
  const selectedPin = pins.find((p) => p.place.slug === selectedSlug) ?? null;

  return (
    <div className="map-card">
      <div className="map-frame">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="map-svg"
          role="group"
          aria-label="Mapa ilustrativo de Maracaibo con los lugares marcados"
        >
          {MAP_IMAGE ? (
            <image href={MAP_IMAGE.image} x="0" y="0" width={W} height={H} preserveAspectRatio="none" />
          ) : (
            <Backdrop />
          )}

          {pins.map(({ place, n, x, y }) => {
            const active = place.slug === selectedSlug;
            return (
              <g
                key={place.slug}
                transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
                className={`pin ${active ? "pin--active" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`${place.name}. Ver detalles del punto`}
                aria-pressed={active}
                onClick={() => onSelect(place.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(place.slug);
                  }
                }}
              >
                <circle className="pin__hit" r="26" cy="-20" />
                {active && <circle className="pin__pulse" r="10" />}
                <path
                  className="pin__shape"
                  d="M0 0C-5-11-17-17-17-30a17 17 0 1 1 34 0C17-17 5-11 0 0z"
                />
                <circle className="pin__dot" cy="-30" r="10" />
                <text className="pin__num" y="-26" textAnchor="middle">
                  {n}
                </text>
              </g>
            );
          })}

          {selectedPin && (
            <text
              className="map-label"
              x={Math.min(Math.max(selectedPin.x, 110), W - 110)}
              y={selectedPin.y + 24}
              textAnchor="middle"
            >
              {selectedPin.place.name}
            </text>
          )}
        </svg>
        <span className="map-tag">Mapa ilustrativo</span>
      </div>

      <div className="map-bar">
        {selected ? (
          <>
            <div className="map-bar__info">
              <strong>{selected.name}</strong>
              <span>{selected.shortDescription}</span>
            </div>
            <div className="map-bar__actions">
              <button type="button" className="btn btn--ghost" onClick={() => onOpenPlace(selected.slug)}>
                Ver ficha
              </button>
              <a
                className="btn btn--dark"
                href={googleMapsPlaceUrl(selected)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cómo llegar <IconExternal width={16} height={16} />
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="map-bar__info">
              <strong>Toca un punto del mapa</strong>
              <span>Verás el lugar y podrás abrirlo en Google Maps con la ubicación exacta.</span>
            </div>
            <div className="map-bar__actions">
              <a
                className="btn btn--dark"
                href={googleMapsSearchUrl(MAPS_GENERAL_QUERY)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir Google Maps <IconExternal width={16} height={16} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Fondo dibujado: tierra, parques, calles y el lago al este. */
function Backdrop() {
  return (
    <g aria-hidden="true">
      <rect width={W} height={H} fill="#F1E4CB" />
      <rect x="70" y="60" width="130" height="80" rx="18" fill="#CFE0B4" />
      <rect x="330" y="380" width="150" height="90" rx="20" fill="#CFE0B4" />
      <path
        d="M690 0C722 80 664 150 702 232S736 392 694 520H800V0Z"
        fill="#8ED0D6"
      />
      <path d="M690 0C722 80 664 150 702 232S736 392 694 520" fill="none" stroke="#6FB9C1" strokeWidth="4" />
      <path d="M730 70h40M744 200h40M720 330h50M740 440h40" stroke="rgba(255,255,255,.6)" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 150H640M0 300H650M0 440H600M180 0V520M360 0V520M520 0V520" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0 520C160 380 300 300 440 230S620 120 680 40" stroke="#FFFFFF" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M0 520C160 380 300 300 440 230S620 120 680 40" stroke="#F8C87A" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="2 12" />
    </g>
  );
}
