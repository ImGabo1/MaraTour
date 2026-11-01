import { useModal } from "../hooks/useModal";
import { googleMapsPlaceUrl } from "../lib/maps";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { IconClose, IconExternal, IconRotate } from "./icons";

interface Props {
  place: Place;
  onClose: () => void;
  onOpenPano: (place: Place) => void;
}

/** Ficha del lugar: foto 2D que «se enfoca», historia y botón a Google Maps. */
export function PlaceSheet({ place, onClose, onOpenPano }: Props) {
  const closeRef = useModal<HTMLButtonElement>(onClose);
  const coverSrc = place.imageUrl ?? place.media.find((m) => m.kind === "photo")?.url ?? null;
  const gallery = place.media.filter((m) => m.kind === "photo" && m.url !== coverSrc);
  const panoramas = place.media.filter((m) => m.kind === "pano");
  const panoSrc = place.panoUrl ?? panoramas[0]?.url ?? null;

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet__media">
          <Cover place={place} className="sheet__cover" />
          <button ref={closeRef} type="button" className="icon-btn sheet__close" onClick={onClose} aria-label="Cerrar ficha">
            <IconClose />
          </button>
        </div>

        <div className="sheet__body">
          <p className="card__category">{place.categoryName}</p>
          <h2 id="sheet-title" className="sheet__title">
            {place.name}
          </h2>
          <p className="sheet__lead">{place.shortDescription}</p>

          {gallery.length > 0 && (
            <ul className="gallery" aria-label={`Más fotos de ${place.name}`}>
              {gallery.map((m) => (
                <li key={m.url} className="gallery__item">
                  <img
                    src={m.url}
                    alt={m.caption ?? `Foto de ${place.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                  {(m.caption ?? m.credit) && (
                    <p className="gallery__caption">
                      {m.caption}
                      {m.caption && m.credit ? " · " : ""}
                      {m.credit && <span className="gallery__credit">{m.credit}</span>}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3 className="sheet__h">Historia</h3>
          <p className="sheet__text">{place.history}</p>

          <h3 className="sheet__h">Dónde queda</h3>
          <p className="sheet__text">{place.address}</p>

          {place.tags.length > 0 && (
            <ul className="tags" aria-label="Etiquetas">
              {place.tags.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          )}

          {import.meta.env.DEV && !place.coordsVerified && (
            <p className="badge-warn">Solo visible en desarrollo: ubicación por verificar en Google Maps.</p>
          )}
        </div>

        <div className="sheet__actions">
          {panoSrc && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onOpenPano({ ...place, panoUrl: panoSrc })}
            >
              <IconRotate width={18} height={18} /> Ver en 360°
            </button>
          )}
          <a className="btn btn--dark" href={googleMapsPlaceUrl(place)} target="_blank" rel="noopener noreferrer">
            Cómo llegar en Google Maps <IconExternal width={16} height={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
