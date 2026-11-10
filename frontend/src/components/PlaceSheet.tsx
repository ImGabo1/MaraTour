import { useEffect, useMemo, useRef, useState } from "react";
import { MAP_IMAGE } from "../config";
import { categoryBySlug } from "../data/categories";
import { profileFor } from "../data/placeProfiles";
import { useI18n } from "../i18n/I18nProvider";
import { useModal } from "../hooks/useModal";
import { googleMapsPlaceUrl } from "../lib/maps";
import { groupsFor, primaryCategory } from "../lib/places";
import { popularityScore } from "../lib/popularity";
import { boundsFor, project } from "../lib/projection";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { MAP_H, MAP_W, MapBackdrop } from "./MapBackdrop";
import { PlaceEmblem } from "./PlaceEmblem";
import {
  CategoryIcon,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconClose,
  IconCopy,
  IconExternal,
  IconHeart,
  IconMapPin,
  IconRotate,
  IconShare,
  IconSparkles,
  IconStar,
  IconSun,
  IconUsers,
  IconWallet,
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
  const [toast, setToast] = useState<Toast>(null);
  const timer = useRef<number | null>(null);
  const category = categoryBySlug(primaryCategory(place));
  const profile = profileFor(place);
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
      .sort((a, b) => b.shared - a.score || b.score - a.score)
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

  return (
    <div className="vm-overlay" onClick={onClose}>
      <article
        className="vm-sheet vms-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          ["--place-from" as string]: profile.colors.from,
          ["--place-to" as string]: profile.colors.to,
          ["--place-accent" as string]: profile.colors.accent,
          ["--place-soft" as string]: profile.colors.soft,
          ["--place-ink" as string]: profile.colors.ink,
        }}
      >
        {/* ===== Encabezado con imagen a la izquierda y identidad a la derecha (desktop) ===== */}
        <header className="vms-hero">
          <div className="vms-hero__wrap">
            <div className="vms-hero__media">
              <Cover place={place} className="vms-hero__cover" />
              <span className="vms-hero__shade" aria-hidden="true" />
              <div className="vms-hero__top-right">
                <span className="vms-hero__badge">
                  {category && <CategoryIcon name={category.icon} width={14} height={14} />}
                  {category ? t(category.nameKey) : place.categoryName}
                </span>
                <div className="vms-hero__actions">
                  <button
                    type="button"
                    className={`vms-hero__icon${saved ? " is-saved" : ""}`}
                    onClick={() => onToggleSave(place.slug)}
                    aria-pressed={saved}
                    aria-label={saved ? t("sheet.saved") : t("sheet.save")}
                  >
                    <IconHeart width={19} height={19} />
                  </button>
                  <button
                    type="button"
                    className="vms-hero__icon"
                    onClick={share}
                    aria-label={t("sheet.share")}
                  >
                    <IconShare width={18} height={18} />
                  </button>
                  <button
                    ref={closeRef}
                    type="button"
                    className="vms-hero__icon vms-hero__close"
                    onClick={onClose}
                    aria-label={t("sheet.close")}
                  >
                    <IconClose width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="vms-hero__identity">
              <span className="vms-emblem" aria-hidden="true">
                <PlaceEmblem name={profile.emblem} width={34} height={34} />
              </span>
              <div className="vms-hero__copy">
                <p className="vms-hero__essence">
                  <IconSparkles width={14} height={14} />
                  {profile.essence}
                </p>
                <h2 id="sheet-title" className="vms-hero__title">
                  {place.name}
                </h2>
                <p className="vms-hero__lead">{place.shortDescription}</p>
                <div className="vms-hero__chips">
                  <span className="vms-chip">
                    <IconStar width={13} height={13} />
                    {score}/100
                  </span>
                  <span className="vms-chip">
                    <IconSun width={13} height={13} />
                    {profile.bestTime}
                  </span>
                  {place.panoUrl && (
                    <span className="vms-chip">
                      <IconRotate width={13} height={13} />
                      360°
                    </span>
                  )}
                  {place.sector && (
                    <span className="vms-chip">
                      <IconCheck width={13} height={13} />
                      {place.sector === "publico" ? "Atención pública" : "Atención privada"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="vms-body">
          <div className="vms-main">
            <section className="vms-facts" aria-label="Datos prácticos del lugar">
              <div className="vms-fact">
                <span className="vms-fact__icon">
                  <IconClock width={18} height={18} />
                </span>
                <span>
                  <small>Mejor momento</small>
                  <strong>{profile.bestTime}</strong>
                </span>
              </div>
              <div className="vms-fact">
                <span className="vms-fact__icon">
                  <IconSun width={18} height={18} />
                </span>
                <span>
                  <small>Tiempo sugerido</small>
                  <strong>{profile.duration}</strong>
                </span>
              </div>
              <div className="vms-fact">
                <span className="vms-fact__icon">
                  <IconWallet width={18} height={18} />
                </span>
                <span>
                  <small>Presupuesto</small>
                  <strong>{profile.budget}</strong>
                </span>
              </div>
              <div className="vms-fact">
                <span className="vms-fact__icon">
                  <IconUsers width={18} height={18} />
                </span>
                <span>
                  <small>Ideal para</small>
                  <strong>{profile.idealFor}</strong>
                </span>
              </div>
            </section>

            <section className="vms-section">
              <p className="vms-eyebrow">
                <IconSparkles width={14} height={14} />
                Memoria del lugar
              </p>
              <h3 className="vms-title">{t("sheet.history")}</h3>
              <div className="vms-story">
                <p>{place.history}</p>
                <p>{profile.history}</p>
              </div>
              {place.imageCredit && (
                <p className="vms-credit">
                  {place.imageCredit}
                  {place.imageSource && (
                    <>
                      {" · "}
                      <a href={place.imageSource} target="_blank" rel="noopener noreferrer">
                        Ver fuente
                      </a>
                    </>
                  )}
                </p>
              )}
            </section>

            <section className="vms-section">
              <p className="vms-eyebrow">
                <IconStar width={14} height={14} />
                Lo que no te puedes perder
              </p>
              <h3 className="vms-title">Imperdibles de {place.name}</h3>
              <ul className="vms-highlights">
                {profile.highlights.map((item, index) => (
                  <li key={item} style={{ ["--i" as string]: index }}>
                    <span className="vms-highlights__star" aria-hidden="true">
                      <IconStar width={13} height={13} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="vms-section">
              <p className="vms-eyebrow">
                <IconSparkles width={14} height={14} />
                Consejos de Zulmita
              </p>
              <h3 className="vms-title">Para que el plan salga redondo</h3>
              <div className="vms-tips">
                {profile.suggestions.map((tip, index) => (
                  <article key={tip.title} className="vms-tip" style={{ ["--i" as string]: index }}>
                    <span className="vms-tip__num">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{tip.title}</strong>
                    <p>{tip.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="vms-funfact">
              <span className="vms-funfact__icon" aria-hidden="true">
                <IconSparkles width={20} height={20} />
              </span>
              <div>
                <p className="vms-eyebrow">Dato curioso</p>
                <p className="vms-funfact__text">{profile.funFact}</p>
              </div>
            </section>

            {place.tags.length > 0 && (
              <section className="vms-section">
                <p className="vms-eyebrow">Para tu visita</p>
                <h3 className="vms-title">{t("sheet.tags")}</h3>
                <ul className="vms-tags" aria-label={t("sheet.tags")}>
                  {place.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </section>
            )}

            {related.length > 0 && (
              <section className="vms-section" aria-label={t("sheet.related")}>
                <div className="vms-related__head">
                  <div>
                    <p className="vms-eyebrow">Sigue explorando</p>
                    <h3 className="vms-title">{t("sheet.related")}</h3>
                  </div>
                  <span>{t("sheet.relatedHint")}</span>
                </div>
                <div className="vms-related">
                  {related.map((item) => {
                    const itemProfile = profileFor(item);
                    const itemCategory = categoryBySlug(primaryCategory(item));
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        className="vms-related__card"
                        onClick={() => onOpenPlace(item.slug)}
                        style={{
                          ["--item-from" as string]: itemProfile.colors.from,
                          ["--item-to" as string]: itemProfile.colors.to,
                          ["--item-soft" as string]: itemProfile.colors.soft,
                        }}
                      >
                        <span className="vms-related__emblem" aria-hidden="true">
                          <PlaceEmblem name={itemProfile.emblem} width={17} height={17} />
                        </span>
                        <span className="vms-related__copy">
                          <strong>{item.name}</strong>
                          <small>{itemCategory ? t(itemCategory.nameKey) : item.categoryName}</small>
                          <em>{itemProfile.essence}</em>
                        </span>
                        <IconArrowRight width={15} height={15} />
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {lang !== "es" && <p className="vms-note">{t("sheet.contentNote")}</p>}
          </div>

          <aside className="vms-aside">
            <section className="vms-panel vms-panel--place">
              <p className="vms-eyebrow">El plan perfecto</p>
              <p className="vms-panel__plan">{profile.plan}</p>
              <div className="vms-panel__row">
                <span className="vms-panel__label">
                  <IconMapPin width={15} height={15} />
                  Cerca de aquí
                </span>
                <div className="vms-nearby">
                  {profile.nearby.length > 0 ? (
                    profile.nearby.map((item) => <span key={item}>{item}</span>)
                  ) : (
                    <span>Otros rincones de Maracaibo</span>
                  )}
                </div>
              </div>
              <div className="vms-panel__row">
                <span className="vms-panel__label">
                  <IconSparkles width={15} height={15} />
                  Para comer
                </span>
                <p className="vms-panel__food">{profile.food}</p>
              </div>
            </section>

            <section className="vms-panel">
              <p className="vms-eyebrow">Cómo llegar</p>
              <h3 className="vms-title">{t("sheet.where")}</h3>
              <div className="vms-address">
                <span className="vms-address__icon" aria-hidden="true">
                  <IconMapPin width={18} height={18} />
                </span>
                <p>{place.address}</p>
                <button
                  type="button"
                  className="vms-address__copy"
                  onClick={copyAddress}
                  aria-label={t("sheet.copyAddress")}
                >
                  {toast === "address" ? (
                    <IconCheck width={15} height={15} />
                  ) : (
                    <IconCopy width={15} height={15} />
                  )}
                  <span>{toast === "address" ? t("sheet.addressCopied") : t("sheet.copyAddress")}</span>
                </button>
              </div>

              <div className="vm-minimap vms-minimap">
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
                <button
                  type="button"
                  className="vm-minimap__cta"
                  onClick={() => onShowOnMap(place.slug)}
                >
                  <IconMapPin width={15} height={15} />
                  {t("sheet.showOnMap")}
                </button>
              </div>

              <div className="vms-coords">
                <span className="vms-coords__mono">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </span>
                <span className={place.coordsVerified ? "is-ok" : "is-warn"}>
                  {place.coordsVerified ? t("sheet.verified") : t("sheet.unverified")}
                </span>
              </div>
            </section>

            <section className={`vms-pano${place.panoUrl ? "" : " is-off"}`}>
              <div className="vms-pano__art" aria-hidden="true">
                <IconRotate width={30} height={30} />
                <span>360°</span>
              </div>
              <div className="vms-pano__copy">
                <p className="vms-eyebrow">Vista 360° opcional</p>
                <h3 className="vms-title">
                  {place.panoUrl ? "Conócelo antes de ir" : "Aún sin vista 360°"}
                </h3>
                <p>
                  {place.panoUrl
                    ? "Abre la panorámica y gira la vista con el dedo o el movimiento del teléfono."
                    : "Este lugar todavía no tiene panorámica. Mientras tanto puedes ver su historia, su mapa y sus datos."}
                </p>
                {place.panoUrl && (
                  <button
                    type="button"
                    className="vms-btn vms-btn--primary"
                    onClick={() => onOpenPano(place)}
                  >
                    <IconRotate width={17} height={17} />
                    {t("sheet.pano")}
                  </button>
                )}
              </div>
            </section>

            <section className="vms-panel vms-panel--score">
              <div>
                <p className="vms-eyebrow">Popularidad</p>
                <strong className="vms-panel__score">
                  {score}
                  <span>/100</span>
                </strong>
              </div>
              <span className="vms-panel__bar" aria-hidden="true">
                <span style={{ width: `${score}%` }} />
              </span>
            </section>
          </aside>
        </div>

        <footer className="vms-actions">
          <button
            type="button"
            className={`vms-btn ${saved ? "vms-btn--primary" : "vms-btn--soft"}`}
            onClick={() => onToggleSave(place.slug)}
            aria-pressed={saved}
          >
            <IconHeart width={17} height={17} />
            {saved ? t("sheet.saved") : t("sheet.save")}
          </button>
          <button
            type="button"
            className="vms-btn vms-btn--soft"
            onClick={() => onShowOnMap(place.slug)}
          >
            <IconMapPin width={17} height={17} />
            {t("sheet.showOnMap")}
          </button>
          <a
            className="vms-btn vms-btn--dark"
            href={googleMapsPlaceUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("sheet.howTo")}
            <IconExternal width={16} height={16} />
          </a>
          <button
            type="button"
            className="vms-actions__share"
            onClick={share}
            aria-label={t("sheet.share")}
          >
            <IconShare width={18} height={18} />
          </button>
          {toast && (
            <span className="vms-actions__toast" role="status">
              {toast === "link" ? t("sheet.copied") : t("sheet.addressCopied")}
            </span>
          )}
        </footer>
      </article>
    </div>
  );
}
