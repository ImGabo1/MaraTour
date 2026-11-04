import { useRef, useState } from "react";
import { categoryBySlug } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { CategoryIcon, IconArrowRight, IconClose, IconHeart, IconShare } from "./icons";

interface Props {
  places: readonly Place[];
  saved: readonly string[];
  onOpen: (slug: string) => void;
  onRemove: (slug: string) => void;
}

export function SavedSection({ places, saved, onOpen, onRemove }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const savedPlaces = saved
    .map((slug) => places.find((place) => place.slug === slug))
    .filter((place): place is Place => Boolean(place));

  const share = async () => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const text = savedPlaces.map((place) => `${place.name}: ${base}#/lugar/${place.slug}`).join("\n");
    try {
      if (navigator.share) {
        await navigator.share({ title: t("saved.title"), text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* el usuario canceló o el navegador no permite compartir */
    }
  };

  return (
    <section id="mi-ruta" className="section section--saved">
      <div className="container">
        <div className="section-heading section-heading--row">
          <div>
            <p className="eyebrow">{t("saved.kicker")}</p>
            <h2 className="section-title">{t("saved.title")}</h2>
            <p className="section-lead">{t("saved.lead")}</p>
          </div>
          <div className="saved-actions">
            {savedPlaces.length > 0 && (
              <span className="section-count">
                {savedPlaces.length === 1
                  ? t("saved.countOne")
                  : t("saved.count", { n: savedPlaces.length })}
              </span>
            )}
            {savedPlaces.length > 1 && (
              <button type="button" className="btn btn--outline btn--sm" onClick={share}>
                <IconShare width={15} height={15} />
                {t("saved.share")}
              </button>
            )}
          </div>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="saved-empty">
            <span className="saved-empty__icon" aria-hidden="true">
              <IconHeart width={28} height={28} />
            </span>
            <p className="saved-empty__title">{t("saved.empty")}</p>
            <p className="saved-empty__hint">{t("saved.emptyHint")}</p>
            <a className="btn btn--primary" href="#explorar">
              {t("hero.ctaExplore")}
              <IconArrowRight width={17} height={17} />
            </a>
          </div>
        ) : (
          <div className="saved-grid">
            {savedPlaces.map((place, index) => {
              const category = categoryBySlug(primaryCategory(place));
              return (
                <article
                  key={place.slug}
                  className="saved-card reveal"
                  style={{ ["--i" as string]: Math.min(index, 10) }}
                >
                  <button
                    type="button"
                    className="saved-card__open"
                    onClick={() => onOpen(place.slug)}
                    aria-label={`${place.name} · ${t("places.details")}`}
                  >
                    <span className="saved-card__media">
                      <Cover place={place} className="saved-card__cover" />
                      <span className="saved-card__order" aria-hidden="true">
                        {index + 1}
                      </span>
                    </span>
                    <span className="saved-card__body">
                      <span
                        className="saved-card__cat"
                        style={{ ["--from" as string]: category?.from ?? "#0B6A73" }}
                      >
                        {category && <CategoryIcon name={category.icon} width={12} height={12} />}
                        {category ? t(category.nameKey) : place.categoryName}
                      </span>
                      <strong className="saved-card__name">{place.name}</strong>
                      <span className="saved-card__addr">{place.address}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="saved-card__remove"
                    onClick={() => onRemove(place.slug)}
                    aria-label={`${t("saved.remove")}: ${place.name}`}
                  >
                    <IconClose width={16} height={16} />
                  </button>
                </article>
              );
            })}
          </div>
        )}
        {copied && (
          <p className="saved-copied" role="status">
            {t("sheet.copied")}
          </p>
        )}
      </div>
    </section>
  );
}
