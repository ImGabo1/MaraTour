import type { ReactNode } from "react";
import { categoryBySlug } from "../data/categories";
import { profileFor } from "../data/placeProfiles";
import { useI18n } from "../i18n/I18nProvider";
import { isPopular, popularityScore } from "../lib/popularity";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";
import { PlaceImage } from "./PlaceImage";
import { CategoryIcon, IconArrowRight, IconFlame, IconHeart, IconMapPin, IconRotate } from "./icons";
import "./PlaceCard.css";

interface Props {
  place: Place;
  onOpen: (slug: string) => void;
  onToggleSave?: (slug: string) => void;
  saved?: boolean;
  /** Tarjeta del primer viewport: la foto carga de inmediato. */
  eager?: boolean;
}

/** Tarjeta vertical 3:4: foto completa con el texto sobre un velo oscuro. */
export function PlaceCard({ place, onOpen, onToggleSave, saved = false, eager = false }: Props) {
  const { t } = useI18n();
  const category = categoryBySlug(primaryCategory(place));
  const profile = profileFor(place);
  const popular = isPopular(popularityScore(place.slug));

  return (
    <article className="mt-card mt-lift">
      <button
        type="button"
        className="mt-card__open mt-focusable"
        onClick={() => onOpen(place.slug)}
        aria-label={`${place.name} · ${t("places.details")}`}
      >
        <PlaceImage place={place} ratio="card" eager={eager} decorative />
        <span className="mt-card__scrim" aria-hidden="true" />

        <span className="mt-card__badges">
          <span className="mt-badge mt-badge--cat">
            {category && <CategoryIcon name={category.icon} width={14} height={14} />}
            <span className="mt-badge__text">{category ? t(category.nameKey) : place.categoryName}</span>
          </span>
          {place.panoUrl && (
            <span className="mt-badge mt-badge--sun">
              <IconRotate width={14} height={14} />
              360°
            </span>
          )}
          {popular && (
            <span className="mt-badge mt-badge--sun-soft">
              <IconFlame width={14} height={14} />
              {t("places.popular")}
            </span>
          )}
        </span>

        <span className="mt-card__body">
          <span className="mt-card__essence">{profile.essence}</span>
          <span className="mt-card__title">{place.name}</span>
          <span className="mt-card__text">{place.shortDescription}</span>
          <span className="mt-card__foot">
            <span className="mt-card__addr">
              <IconMapPin width={14} height={14} />
              <span>{place.address}</span>
            </span>
            <span className="mt-card__cta">
              <span className="mt-card__cta-label">{t("places.details")}</span>
              <IconArrowRight width={16} height={16} />
            </span>
          </span>
        </span>
      </button>

      {onToggleSave && (
        <button
          type="button"
          className={`mt-card__save mt-press mt-focusable${saved ? " is-saved" : ""}`}
          onClick={() => onToggleSave(place.slug)}
          aria-pressed={saved}
          aria-label={saved ? t("sheet.saved") : t("sheet.save")}
        >
          <IconHeart width={20} height={20} />
        </button>
      )}
    </article>
  );
}

/** Marcador de carga con la misma forma que una tarjeta real (3:4). */
export function PlaceCardSkeleton() {
  return <div className="mt-card mt-card--skeleton mt-skeleton" aria-hidden="true" />;
}

/** Grilla de tarjetas: sin desbordes a 320 px y entrada escalonada (máx. 8). */
export function PlaceGrid({ children, busy = false }: { children: ReactNode; busy?: boolean }) {
  return (
    <div className="mt-grid mt-stagger" aria-busy={busy || undefined}>
      {children}
    </div>
  );
}
