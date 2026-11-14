import { useEffect, useMemo, useRef, useState } from "react";
import { MAP_IMAGE } from "../config";
import { categoryBySlug } from "../data/categories";
import { profileFor } from "../data/placeProfiles";
import { useI18n } from "../i18n/I18nProvider";
import { useModal } from "../hooks/useModal";
import { googleMapsPlaceUrl } from "../lib/maps";
import { groupsFor, primaryCategory } from "../lib/places";
import { popularityScore } from "../lib/popularity";
import { boundsFor, project, projectMercator } from "../lib/projection";
import type { Place } from "../types";
import { PlaceImage } from "./PlaceImage";
import { MAP_H, MAP_W, MapBackdrop } from "./MapBackdrop";
import {
  CategoryIcon,
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
import "./PlaceSheet.css";

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

  // Minimapa: mismo espacio de coordenadas que la imagen base (Mercator), para
  // que el pin caiga sobre la cuadra real y no sobre una imagen recortada.
  const miniW = MAP_IMAGE?.width ?? MAP_W;
  const miniH = MAP_IMAGE?.height ?? MAP_H;
  const miniBounds = useMemo(
    () => MAP_IMAGE?.bounds ?? boundsFor([...places], MAP_W / MAP_H, 0.1),
    [places]
  );
  const toPoint = MAP_IMAGE ? projectMercator : project;
  const miniPins = useMemo(
    () =>
      places.map((item) => ({
        place: item,
        ...toPoint(item.latitude, item.longitude, miniBounds, miniW, miniH),
      })),
    [places, miniBounds, toPoint, miniW, miniH]
  );
  const point = toPoint(place.latitude, place.longitude, miniBounds, miniW, miniH);
  const miniView = MAP_IMAGE
    ? (() => {
        // Ventana de ~4 km de ancho centrada en el lugar.
        const width = 120;
        const height = 78;
        return {
          x: Math.min(Math.max(point.x - width / 2, 0), miniW - width),
          y: Math.min(Math.max(point.y - height / 2, 0), miniH - height),
          width,
          height,
        };
      })()
    : null;
  const miniScale = miniView ? miniView.width / 320 : 1;

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

  const photos = useMemo(
    () => place.media.filter((item) => item.kind === "photo").map((item) => item.url),
    [place]
  );

  /* Arrastrar para cerrar (solo móvil): mueve el panel con transform y cierra pasado el umbral. */
  const sheetRef = useRef<HTMLElement>(null);
  const drag = useRef<{ startY: number; dy: number } | null>(null);
  const onDragStart = (event: React.PointerEvent) => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    drag.current = { startY: event.clientY, dy: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  };
  const onDragMove = (event: React.PointerEvent) => {
    const state = drag.current;
    if (!state || !sheetRef.current) return;
    state.dy = Math.max(0, event.clientY - state.startY);
    sheetRef.current.style.transform = `translateY(${state.dy}px)`;
  };
  const onDragEnd = () => {
    const state = drag.current;
    drag.current = null;
    const el = sheetRef.current;
    if (!state || !el) return;
    el.style.transition = "";
    if (state.dy > 110) {
      onClose();
    } else {
      el.style.transform = "";
    }
  };

  return (
    <div className="mts-overlay" onClick={onClose}>
      <article
        ref={sheetRef}
        className="mts-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="mts-grab"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          aria-hidden="true"
        >
          <span />
        </div>

        <div className="mts-layout">
          {/* ===== Foto vertical ===== */}
          <div className="mts-visual">
            <div className="mts-hero">
              <PlaceImage place={place} ratio="hero" eager />
              <span className="mts-hero__shade" aria-hidden="true" />
              <div className="mts-hero__top">
                <span className="mts-badge mts-badge--cat">
                  {category && <CategoryIcon name={category.icon} width={14} height={14} />}
                  {category ? t(category.nameKey) : place.categoryName}
                </span>
                <div className="mts-hero__actions">
                  <button
                    type="button"
                    className={`mts-icon mt-press${saved ? " is-saved" : ""}`}
                    onClick={() => onToggleSave(place.slug)}
                    aria-pressed={saved}
                    aria-label={saved ? t("sheet.saved") : t("sheet.save")}
                  >
                    <IconHeart width={20} height={20} />
                  </button>
                  <button type="button" className="mts-icon mt-press" onClick={share} aria-label={t("sheet.share")}>
                    <IconShare width={18} height={18} />
                  </button>
                  <button
                    ref={closeRef}
                    type="button"
                    className="mts-icon mt-press"
                    onClick={onClose}
                    aria-label={t("sheet.close")}
                  >
                    <IconClose width={20} height={20} />
                  </button>
                </div>
              </div>
              {place.panoUrl && (
                <button type="button" className="mts-pano-btn mt-press" onClick={() => onOpenPano(place)}>
                  <IconRotate width={18} height={18} />
                  Ver en 360°
                </button>
              )}
            </div>

            {photos.length > 1 && (
              <ul className="mts-gallery" aria-label="Galería">
                {photos.map((url, index) => (
                  <li key={url}>
                    <PlaceImage place={place} src={url} ratio="thumb" decorative={index > 0} />
                  </li>
                ))}
              </ul>
            )}
            {place.imageCredit && (
              <p className="mts-credit">
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
          </div>

          {/* ===== Contenido ===== */}
          <div className="mts-content">
            <header className="mts-head">
              <p className="mts-essence">
                <IconSparkles width={14} height={14} />
                {profile.essence}
              </p>
              <h2 id="sheet-title" className="mts-title">
                {place.name}
              </h2>
              <p className="mts-lead">{place.shortDescription}</p>
              <div className="mts-chips">
                {place.sector && (
                  <span className="mts-chip">
                    <IconCheck width={13} height={13} />
                    {place.sector === "publico" ? "Atención pública" : "Atención privada"}
                  </span>
                )}
                <span className="mts-chip">
                  <IconStar width={13} height={13} />
                  {score}/100
                </span>
                <span className="mts-chip">
                  <IconSun width={13} height={13} />
                  {profile.bestTime}
                </span>
              </div>
            </header>

            <section className="mts-facts" aria-label="Datos prácticos del lugar">
              {(
                [
                  [IconClock, "Mejor momento", profile.bestTime],
                  [IconSun, "Tiempo sugerido", profile.duration],
                  [IconWallet, "Presupuesto", profile.budget],
                  [IconUsers, "Ideal para", profile.idealFor],
                ] as const
              ).map(([Icon, label, value]) => (
                <div className="mts-fact glass glass--sm" key={label}>
                  <span className="mts-fact__icon">
                    <Icon width={18} height={18} />
                  </span>
                  <span>
                    <small>{label}</small>
                    <strong>{value}</strong>
                  </span>
                </div>
              ))}
            </section>

            <section className="mts-section">
              <h3 className="mts-h">{t("sheet.history")}</h3>
              <div className="mts-story">
                <p>{place.history}</p>
                <p>{profile.history}</p>
              </div>
            </section>

            <section className="mts-section">
              <h3 className="mts-h">{t("sheet.where")}</h3>
              <div className="mts-card glass">
                <div className="mts-address">
                  <IconMapPin width={18} height={18} aria-hidden="true" />
                  <p>{place.address}</p>
                  <button type="button" className="mt-btn mt-btn--soft mt-btn--sm" onClick={copyAddress} aria-label={t("sheet.copyAddress")}>
                    {toast === "address" ? <IconCheck width={15} height={15} /> : <IconCopy width={15} height={15} />}
                    <span>{toast === "address" ? t("sheet.addressCopied") : t("sheet.copyAddress")}</span>
                  </button>
                </div>

                <div className="mts-minimap">
                  <svg
                    viewBox={miniView ? `${miniView.x} ${miniView.y} ${miniView.width} ${miniView.height}` : `0 0 ${miniW} ${miniH}`}
                    className="mts-minimap__svg"
                    role="img"
                    aria-label={`${t("sheet.where")}: ${place.address}`}
                  >
                    {MAP_IMAGE ? (
                      <image href={MAP_IMAGE.image} x="0" y="0" width={miniW} height={miniH} preserveAspectRatio="none" />
                    ) : (
                      <MapBackdrop compact />
                    )}
                    {miniPins.map((pin) => (
                      <circle
                        key={pin.place.slug}
                        className="mts-minimap__dot"
                        cx={pin.x}
                        cy={pin.y}
                        r={(pin.place.slug === place.slug ? 0 : 3.2) * miniScale}
                      />
                    ))}
                    <g transform={`translate(${point.x} ${point.y}) scale(${miniScale})`} pointerEvents="none">
                      <circle className="mts-minimap__ring" r="18" />
                      <circle className="mts-minimap__pin" r="7" />
                    </g>
                  </svg>
                </div>

                <div className="mts-coords">
                  <span>
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </span>
                  <span className={place.coordsVerified ? "is-ok" : "is-warn"}>
                    {place.coordsVerified ? t("sheet.verified") : t("sheet.unverified")}
                  </span>
                </div>
                <div className="mts-card__links">
                  <a className="mt-btn mt-btn--soft mt-btn--sm" href={googleMapsPlaceUrl(place)} target="_blank" rel="noopener noreferrer">
                    Abrir en Google Maps
                    <IconExternal width={15} height={15} />
                  </a>
                  <button type="button" className="mt-btn mt-btn--soft mt-btn--sm" onClick={() => onShowOnMap(place.slug)}>
                    <IconMapPin width={15} height={15} />
                    {t("sheet.showOnMap")}
                  </button>
                </div>
              </div>
            </section>

            <section className="mts-section">
              <h3 className="mts-h">Imperdibles de {place.name}</h3>
              <ul className="mts-highlights">
                {profile.highlights.map((item) => (
                  <li key={item}>
                    <IconStar width={14} height={14} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mts-section">
              <h3 className="mts-h">Consejos de Zulmita</h3>
              <div className="mts-tips">
                {profile.suggestions.map((tip, index) => (
                  <article key={tip.title} className="mts-tip glass glass--sm">
                    <span className="mts-tip__num">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{tip.title}</strong>
                    <p>{tip.text}</p>
                  </article>
                ))}
              </div>
              <p className="mts-funfact">
                <IconSparkles width={18} height={18} aria-hidden="true" />
                <span>
                  <b>Dato curioso:</b> {profile.funFact}
                </span>
              </p>
            </section>

            <section className="mts-section">
              <h3 className="mts-h">El plan perfecto</h3>
              <div className="mts-card glass">
                <p className="mts-plan">{profile.plan}</p>
                <p className="mts-mini">
                  <b>Cerca de aquí:</b>{" "}
                  {profile.nearby.length > 0 ? profile.nearby.join(" · ") : "Otros rincones de Maracaibo"}
                </p>
                <p className="mts-mini">
                  <b>Para comer:</b> {profile.food}
                </p>
              </div>
            </section>

            {place.tags.length > 0 && (
              <section className="mts-section">
                <h3 className="mts-h">{t("sheet.tags")}</h3>
                <ul className="mts-tags" aria-label={t("sheet.tags")}>
                  {place.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </section>
            )}

            {related.length > 0 && (
              <section className="mts-section" aria-label={t("sheet.related")}>
                <h3 className="mts-h">{t("sheet.related")}</h3>
                <p className="mts-mini">{t("sheet.relatedHint")}</p>
                <ul className="mts-related">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <button type="button" className="mts-related__card mt-lift" onClick={() => onOpenPlace(item.slug)}>
                        <PlaceImage place={item} ratio="thumb" decorative />
                        <span className="mts-related__scrim" aria-hidden="true" />
                        <span className="mts-related__name">{item.name}</span>
                        <span className="sr-only mt-sr-only">{`${item.name} · ${t("places.details")}`}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {lang !== "es" && <p className="mts-mini">{t("sheet.contentNote")}</p>}
          </div>
        </div>

        {/* ===== Barra de acciones ===== */}
        <footer className="mts-actions glass glass--flat">
          <a className="mt-btn mt-btn--primary mts-actions__main" href={googleMapsPlaceUrl(place)} target="_blank" rel="noopener noreferrer">
            {t("sheet.howTo")}
            <IconExternal width={16} height={16} />
          </a>
          <button
            type="button"
            className={`mt-btn ${saved ? "mt-btn--sun" : "mt-btn--soft"}`}
            onClick={() => onToggleSave(place.slug)}
            aria-pressed={saved}
          >
            <IconHeart width={17} height={17} />
            {saved ? t("sheet.saved") : "Agregar a Mi ruta"}
          </button>
          {toast && (
            <span className="mts-toast" role="status">
              {toast === "link" ? t("sheet.copied") : t("sheet.addressCopied")}
            </span>
          )}
        </footer>
      </article>
    </div>
  );
}
