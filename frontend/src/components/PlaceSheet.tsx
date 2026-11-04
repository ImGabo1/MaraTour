import { useEffect, useMemo, useRef, useState } from "react";
import { MAP_IMAGE } from "../config";
import { categoryBySlug } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { useModal } from "../hooks/useModal";
import { googleMapsPlaceUrl } from "../lib/maps";
import { groupsFor, primaryCategory } from "../lib/places";
import { popularityScore } from "../lib/popularity";
import { boundsFor, project } from "../lib/projection";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { MAP_H, MAP_W, MapBackdrop } from "./MapView";
import {
  CategoryIcon,
  IconArrowRight,
  IconCheck,
  IconClose,
  IconCopy,
  IconExternal,
  IconHeart,
  IconMapPin,
  IconRotate,
  IconShare,
  IconStar,
} from "./icons";

interface Props {
  place: Place;
  places: readonly Place[];
  saved: boolean;
  onClose: () => void;
  onOpenPano: (place: Place) => void;
  onToggleSave: (slug: string) => void;
  onOpenPlace: (slug: string) => void;
  onShowOnMap: (slug: string) => void;
}

type Toast = "link" | "address" | null;

/** Ficha completa del lugar: portada, historia, mapa, vista 360° opcional y lugares afines. */
export function PlaceSheet({
  place,
  places,
  saved,
  onClose,
  onOpenPano,
  onToggleSave,
  onOpenPlace,
  onShowOnMap,
}: Props) {
  const { t, lang } = useI18n();
  const closeRef = useModal<HTMLButtonElement>(onClose);
<<<<<<< HEAD
  const [toast, setToast] = useState<Toast>(null);
  const timer = useRef<number | null>(null);
  const category = categoryBySlug(primaryCategory(place));
  const score = popularityScore(place.slug);

  const miniBounds = useMemo(
    () => MAP_IMAGE?.bounds ?? boundsFor([...places], MAP_W / MAP_H, 0.1),
    [places]
  );
  const miniPins = useMemo(
    () =>
      places.map((item) => ({
        place: item,
        ...project(item.latitude, item.longitude, miniBounds, MAP_W, MAP_H),
      })),
    [places, miniBounds]
  );
  const point = project(place.latitude, place.longitude, miniBounds, MAP_W, MAP_H);
  const miniView = MAP_IMAGE
    ? (() => {
        const width = 320;
        const height = 208;
        return {
          x: Math.min(Math.max(point.x - width / 2, 0), MAP_W - width),
          y: Math.min(Math.max(point.y - height / 2, 0), MAP_H - height),
          width,
          height,
        };
      })()
    : null;

  const related = useMemo(() => {
    const themes = new Set(groupsFor(place));
    return places
      .filter((item) => item.slug !== place.slug)
      .map((item) => ({
        place: item,
        shared: groupsFor(item).filter((theme) => themes.has(theme)).length,
        score: popularityScore(item.slug),
      }))
      .filter((entry) => entry.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.score - a.score)
      .slice(0, 3)
      .map((entry) => entry.place);
  }, [place, places]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const showToast = (next: Exclude<Toast, null>) => {
    setToast(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2400);
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/lugar/${place.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text: place.shortDescription, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast("link");
    } catch {
      /* el usuario canceló o el navegador no permite compartir */
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(place.address);
      showToast("address");
    } catch {
      /* sin portapapeles la dirección sigue visible */
    }
  };
=======
  const coverSrc = place.imageUrl ?? place.media.find((m) => m.kind === "photo")?.url ?? null;
  const gallery = place.media.filter((m) => m.kind === "photo" && m.url !== coverSrc);
  const panoramas = place.media.filter((m) => m.kind === "pano");
  const panoSrc = place.panoUrl ?? panoramas[0]?.url ?? null;
>>>>>>> b2a212e84986e771267991aa5d5deaf95cd85552

  return (
    <div className="vm-overlay" onClick={onClose}>
      <div
        className="vm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="vm-sheet__hero">
          <Cover place={place} className="vm-sheet__cover" />
          <span className="vm-sheet__shade" aria-hidden="true" />

          <div className="vm-sheet__top">
            <span
              className="vm-sheet__category"
              style={{
                ["--from" as string]: category?.from ?? "#0D6B76",
                ["--to" as string]: category?.to ?? "#2FAFBE",
              }}
            >
              {category && <CategoryIcon name={category.icon} width={14} height={14} />}
              {category ? t(category.nameKey) : place.categoryName}
            </span>
            <div className="vm-sheet__top-actions">
              <button
                type="button"
                className={`vm-sheet__icon${saved ? " is-saved" : ""}`}
                onClick={() => onToggleSave(place.slug)}
                aria-pressed={saved}
                aria-label={saved ? t("sheet.saved") : t("sheet.save")}
              >
                <IconHeart width={20} height={20} />
              </button>
              <button
                type="button"
                className="vm-sheet__icon"
                onClick={share}
                aria-label={t("sheet.share")}
              >
                <IconShare width={19} height={19} />
              </button>
              <button
                ref={closeRef}
                type="button"
                className="vm-sheet__icon vm-sheet__close"
                onClick={onClose}
                aria-label={t("sheet.close")}
              >
                <IconClose width={20} height={20} />
              </button>
            </div>
          </div>

          <div className="vm-sheet__hero-copy">
            <h2 id="sheet-title" className="vm-sheet__title">
              {place.name}
            </h2>
            <p className="vm-sheet__lead">{place.shortDescription}</p>
            <div className="vm-sheet__chips">
              <span className="vm-sheet__chip vm-sheet__chip--score">
                <IconStar width={13} height={13} />
                {score}/100
              </span>
              {place.panoUrl && (
                <span className="vm-sheet__chip">
                  <IconRotate width={13} height={13} />
                  Vista 360°
                </span>
              )}
              {place.coordsVerified ? (
                <span className="vm-sheet__chip vm-sheet__chip--ok">
                  <IconCheck width={13} height={13} />
                  {t("sheet.verified")}
                </span>
              ) : (
                import.meta.env.DEV && (
                  <span className="vm-sheet__chip vm-sheet__chip--warn">
                    {t("sheet.unverified")}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="vm-sheet__body">
          <dl className="vm-sheet__facts" aria-label={t("sheet.facts")}>
            <div>
              <dt>{t("sheet.theme")}</dt>
              <dd>
                {category && <CategoryIcon name={category.icon} width={14} height={14} />}
                {category ? t(category.nameKey) : place.categoryName}
              </dd>
            </div>
            <div>
              <dt>{t("sheet.popularity")}</dt>
              <dd>
                <span className="vm-sheet__bar" aria-hidden="true">
                  <span style={{ width: `${score}%` }} />
                </span>
                {score}
              </dd>
            </div>
            <div>
              <dt>{t("sheet.coords")}</dt>
              <dd className="vm-sheet__mono">
                {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
              </dd>
            </div>
            <div>
              <dt>{t("sheet.where")}</dt>
              <dd>{place.coordsVerified ? t("sheet.verified") : t("sheet.unverified")}</dd>
            </div>
          </dl>

<<<<<<< HEAD
          <section className="vm-sheet__section">
            <p className="vm-sheet__eyebrow">Memoria del lugar</p>
            <h3 className="vm-sheet__h">{t("sheet.history")}</h3>
            <p className="vm-sheet__story">{place.history}</p>
          </section>
=======
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
>>>>>>> b2a212e84986e771267991aa5d5deaf95cd85552

          <section className="vm-sheet__section">
            <p className="vm-sheet__eyebrow">Cómo llegar</p>
            <h3 className="vm-sheet__h">{t("sheet.where")}</h3>
            <div className="vm-sheet__address">
              <span className="vm-sheet__address-icon" aria-hidden="true">
                <IconMapPin width={18} height={18} />
              </span>
              <p>{place.address}</p>
              <button
                type="button"
                className="vm-sheet__copy"
                onClick={copyAddress}
                aria-label={t("sheet.copyAddress")}
              >
                {toast === "address" ? <IconCheck width={15} height={15} /> : <IconCopy width={15} height={15} />}
                <span>{toast === "address" ? t("sheet.addressCopied") : t("sheet.copyAddress")}</span>
              </button>
            </div>

            <div className="vm-minimap">
              <svg
                viewBox={
                  miniView
                    ? `${miniView.x} ${miniView.y} ${miniView.width} ${miniView.height}`
                    : `0 0 ${MAP_W} ${MAP_H}`
                }
                className="vm-minimap__svg"
                role="img"
                aria-label={`${t("sheet.where")}: ${place.address}`}
              >
                {MAP_IMAGE ? (
                  <image
                    href={MAP_IMAGE.image}
                    x="0"
                    y="0"
                    width={MAP_W}
                    height={MAP_H}
                    preserveAspectRatio="xMidYMid slice"
                    className="vm-minimap__photo"
                  />
                ) : (
                  <MapBackdrop compact />
                )}
                {miniPins.map((pin) => (
                  <circle
                    key={pin.place.slug}
                    className={`vm-minimap__dot${pin.place.slug === place.slug ? " is-active" : ""}`}
                    cx={pin.x}
                    cy={pin.y}
                    r={pin.place.slug === place.slug ? 9 : 3.2}
                  />
                ))}
                <g transform={`translate(${point.x} ${point.y})`} pointerEvents="none">
                  <circle className="vm-minimap__ring" r="18" />
                  <circle className="vm-minimap__pin" r="6" />
                </g>
              </svg>
              <button type="button" className="vm-minimap__cta" onClick={() => onShowOnMap(place.slug)}>
                <IconMapPin width={15} height={15} />
                {t("sheet.showOnMap")}
              </button>
            </div>
          </section>

          <section className={`vm-sheet__pano${place.panoUrl ? "" : " vm-sheet__pano--off"}`}>
            <div
              className="vm-sheet__pano-art"
              style={{
                background: `radial-gradient(circle at 72% 22%, rgba(255,255,255,.36), transparent 38%), linear-gradient(145deg, ${category?.from ?? "#0D6B76"}, ${category?.to ?? "#2FAFBE"})`,
              }}
              aria-hidden="true"
            >
              <IconRotate width={34} height={34} />
              <span>360°</span>
            </div>
            <div className="vm-sheet__pano-copy">
              <p className="vm-sheet__eyebrow">Vista 360° opcional</p>
              <h3 className="vm-sheet__h">
                {place.panoUrl ? "¿Quieres conocerlo antes de ir?" : "Aún sin vista 360°"}
              </h3>
              <p>
                {place.panoUrl
                  ? "Es opcional: abre la panorámica y gira la vista con el dedo o el movimiento del teléfono."
                  : "Este lugar todavía no tiene panorámica. Mientras tanto puedes ver su historia, su mapa y sus datos."}
              </p>
              {place.panoUrl && (
                <button type="button" className="vm-btn vm-btn--primary" onClick={() => onOpenPano(place)}>
                  <IconRotate width={17} height={17} />
                  {t("sheet.pano")}
                </button>
              )}
            </div>
          </section>

          {place.tags.length > 0 && (
            <section className="vm-sheet__section">
              <p className="vm-sheet__eyebrow">Para tu visita</p>
              <h3 className="vm-sheet__h">{t("sheet.tags")}</h3>
              <ul className="vm-sheet__tags" aria-label={t("sheet.tags")}>
                {place.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section className="vm-sheet__related" aria-label={t("sheet.related")}>
              <div className="vm-sheet__related-head">
                <div>
                  <p className="vm-sheet__eyebrow">Sigue explorando</p>
                  <h3 className="vm-sheet__h">{t("sheet.related")}</h3>
                </div>
                <span>{t("sheet.relatedHint")}</span>
              </div>
              <div className="vm-sheet__related-grid">
                {related.map((item) => {
                  const itemCategory = categoryBySlug(primaryCategory(item));
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      className="vm-sheet__related-card"
                      onClick={() => onOpenPlace(item.slug)}
                    >
                      <Cover place={item} className="vm-sheet__related-cover" />
                      <span className="vm-sheet__related-body">
                        <strong>{item.name}</strong>
                        <span>{itemCategory ? t(itemCategory.nameKey) : item.categoryName}</span>
                      </span>
                      <IconArrowRight width={15} height={15} />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {lang !== "es" && <p className="vm-sheet__note">{t("sheet.contentNote")}</p>}
        </div>

<<<<<<< HEAD
        <div className="vm-sheet__actions">
          <button
            type="button"
            className={`vm-btn ${saved ? "vm-btn--primary" : "vm-btn--soft"}`}
            onClick={() => onToggleSave(place.slug)}
            aria-pressed={saved}
          >
            <IconHeart width={17} height={17} />
            {saved ? t("sheet.saved") : t("sheet.save")}
          </button>
          <button type="button" className="vm-btn vm-btn--soft" onClick={() => onShowOnMap(place.slug)}>
            <IconMapPin width={17} height={17} />
            {t("sheet.showOnMap")}
          </button>
          <a
            className="vm-btn vm-btn--dark"
            href={googleMapsPlaceUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sheet.howTo")}
            <IconExternal width={16} height={16} />
=======
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
>>>>>>> b2a212e84986e771267991aa5d5deaf95cd85552
          </a>
          <button
            type="button"
            className="vm-sheet__share"
            onClick={share}
            aria-label={t("sheet.share")}
          >
            <IconShare width={18} height={18} />
          </button>
          {toast && (
            <span className="vm-sheet__toast" role="status">
              {toast === "link" ? t("sheet.copied") : t("sheet.addressCopied")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
