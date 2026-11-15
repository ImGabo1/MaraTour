import { useMemo, useState } from "react";
import type { AuthSession } from "../lib/auth";
import { useI18n } from "../i18n/I18nProvider";
import { categoryBySlug } from "../data/categories";
import { googleMapsRouteUrl } from "../lib/maps";
import { optimizeRoute, estimateVisitMinutes } from "../lib/route";
import type { Place } from "../types";
import { PlaceImage } from "../components/PlaceImage";
import "./PlanPages.css";
import {
  CategoryIcon,
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconClock,
  IconCompass,
  IconExternal,
  IconBulb,
  IconHeart,
  IconMapPin,
  IconRotate,
  IconRoute,
  IconShare,
  IconSparkles,
} from "../components/icons";

interface Props {
  places: readonly Place[];
  saved: readonly string[];
  session?: AuthSession | null;
  onOpenPlace: (slug: string) => void;
  onRemove: (slug: string) => void;
  onReorder: (slugs: string[]) => void;
  onNavigate?: (page: string) => void;
}

/** Mi ruta: los lugares guardados, reordenables, optimizados y listos para Google Maps. */
export function RoutePage({ places, saved, session, onOpenPlace, onRemove, onReorder, onNavigate }: Props) {
  const { t } = useI18n();
  const isGuest = !session || session.kind === "guest";
  const [copied, setCopied] = useState(false);
  const bySlug = useMemo(() => new Map(places.map((place) => [place.slug, place])), [places]);
  const ordered = useMemo(
    () => saved.map((slug) => bySlug.get(slug)).filter((place): place is Place => Boolean(place)),
    [saved, bySlug]
  );
  const totalMinutes = useMemo(
    () => ordered.reduce((total, place) => total + estimateVisitMinutes(place), 0),
    [ordered]
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const next = ordered.map((place) => place.slug);
    const current = next[index];
    const other = next[target];
    if (!current || !other) return;
    next[index] = other;
    next[target] = current;
    onReorder(next);
  };

  const optimize = () => {
    if (ordered.length < 3) return;
    onReorder(optimizeRoute(ordered));
  };

  const share = async () => {
    // Compartimos el recorrido real en Google Maps: el orden de Mi ruta vive en este
    // dispositivo, así que un enlace a #/mi-ruta no llevaría las paradas al destinatario.
    const url = googleMapsRouteUrl(ordered);
    const text = t("plan.route.sharetext", { list: ordered.map((place) => place.name).join(" → ") });
    try {
      if (navigator.share) {
        await navigator.share({ title: t("plan.route.sharetitle"), text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* el usuario canceló o el navegador no permite compartir */
    }
  };

  return (
    <main className="mtu mt-page-enter">
      <section className="mtn-hero">
        <div className="mt-container">
          <p className="mtn-kicker">
            <IconHeart width={15} height={15} />
            {t("plan.route.kicker")}
          </p>
          <h1 className="mtn-hero__title">
            {t("plan.route.title1")}<span>Maracaibo</span>
          </h1>
          <p className="mtn-hero__lead">
            {t("plan.route.lead")}
          </p>
        </div>
      </section>

      <div className="mt-container mtu__layout">
        {isGuest && (
          <div className="mtn-notice">
            <span className="mtn-notice__icon" aria-hidden="true">
              <IconBulb width={22} height={22} />
            </span>
            <div className="mtn-notice__text">
              <strong>{t("plan.guest.title")}</strong>
              <p>{t("plan.guest.body")}</p>
            </div>
            {onNavigate && (
              <button
                type="button"
                className="mt-btn mt-btn--primary"
                onClick={() => onNavigate("registro")}
              >
                {t("plan.guest.cta")}
              </button>
            )}
          </div>
        )}

        {ordered.length === 0 ? (
          <div className="mtn-empty">
            <span className="mtn-empty__icon" aria-hidden="true">
              <IconRoute width={32} height={32} />
            </span>
            <h2>{t("plan.route.empty.title")}</h2>
            <p>{t("plan.route.empty.body")}</p>
            <a className="mt-btn mt-btn--primary" href="#/explorar">
              {t("plan.route.empty.cta")}
              <IconArrowRight width={16} height={16} />
            </a>
          </div>
        ) : (
          <>
            <section className="mtu__summary">
              <div className="mtu__stats">
                <div>
                  <span className="mtu__stat-icon">
                    <IconMapPin width={19} height={19} />
                  </span>
                  <span>
                    <b>{ordered.length}</b>
                    <small>{ordered.length === 1 ? t("plan.stop.one") : t("plan.stop.many")}</small>
                  </span>
                </div>
                <div>
                  <span className="mtu__stat-icon">
                    <IconClock width={19} height={19} />
                  </span>
                  <span>
                    <b>
                      {hours > 0 ? `${hours} h` : ""} {minutes > 0 ? `${minutes} min` : ""}
                    </b>
                    <small>{t("plan.route.time")}</small>
                  </span>
                </div>
                <div>
                  <span className="mtu__stat-icon">
                    <IconRotate width={19} height={19} />
                  </span>
                  <span>
                    <b>{ordered.filter((place) => place.panoUrl).length}</b>
                    <small>{t("plan.route.pano")}</small>
                  </span>
                </div>
              </div>

              <div className="mtu__tools">
                <button type="button" className="mt-btn mt-btn--soft" onClick={optimize} disabled={ordered.length < 3}>
                  <IconSparkles width={16} height={16} />
                  {t("plan.route.optimize")}
                </button>
                <a
                  className="mt-btn mt-btn--primary"
                  href={googleMapsRouteUrl(ordered)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("plan.route.maps")}
                  <IconExternal width={16} height={16} />
                </a>
                <button type="button" className="mt-btn mt-btn--soft" onClick={share}>
                  <IconShare width={16} height={16} />
                  {copied ? t("plan.route.copied") : t("plan.route.share")}
                </button>
              </div>
            </section>

            <section className="mtu__list" aria-label={t("plan.route.listaria")}>
              {ordered.map((place, index) => {
                const category = categoryBySlug(place.category);
                return (
                  <article key={place.slug} className="mtu-stop">
                    <span className="mtu-stop__number">{index + 1}</span>
                    <button
                      type="button"
                      className="mtu-stop__open"
                      onClick={() => onOpenPlace(place.slug)}
                    >
                      <span className="mtu-stop__media">
                        <PlaceImage place={place} ratio="thumb" decorative />
                      </span>
                      <span className="mtu-stop__body">
                        <span className="mtu-stop__eyebrow">
                          {category && (
                            <span
                              className="mtu-stop__cat"
                              style={{ ["--from" as string]: category.from, ["--to" as string]: category.to }}
                            >
                              <CategoryIcon name={category.icon} width={12} height={12} />
                              {place.categoryName}
                            </span>
                          )}
                          {place.panoUrl && (
                            <span className="mtu-stop__pano">
                              <IconRotate width={12} height={12} />
                              360°
                            </span>
                          )}
                        </span>
                        <strong>{place.name}</strong>
                        <small>
                          <IconMapPin width={13} height={13} />
                          {place.address}
                        </small>
                        <span className="mtu-stop__time">
                          <IconClock width={13} height={13} />
                          {t("plan.route.visit", { n: estimateVisitMinutes(place) })}
                        </span>
                      </span>
                      <IconArrowRight width={18} height={18} />
                    </button>

                    <div className="mtu-stop__actions">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={t("plan.route.up", { name: place.name })}
                      >
                        <IconArrowUp width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === ordered.length - 1}
                        aria-label={t("plan.route.down", { name: place.name })}
                      >
                        <IconArrowDown width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        className="mtu-stop__remove"
                        onClick={() => onRemove(place.slug)}
                        aria-label={t("plan.route.remove", { name: place.name })}
                      >
                        <IconHeart width={16} height={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="mtu__next">
              <span className="mtu__next-icon" aria-hidden="true">
                <IconCompass width={24} height={24} />
              </span>
              <div>
                <p className="mtn-kicker">{t("plan.route.more.kicker")}</p>
                <h2>{t("plan.route.more.title")}</h2>
                <p>{t("plan.route.more.body")}</p>
              </div>
              <a className="mt-btn mt-btn--primary" href="#/plan">
                {t("plan.route.more.cta")}
                <IconSparkles width={16} height={16} />
              </a>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}
