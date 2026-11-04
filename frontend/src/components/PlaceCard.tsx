import { categoryBySlug } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { isPopular, popularityScore } from "../lib/popularity";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { CategoryIcon, IconArrowRight, IconFlame, IconHeart, IconMapPin, IconRotate, IconStar } from "./icons";

interface Props {
  place: Place;
  index: number;
  onOpen: (slug: string) => void;
  onToggleSave?: (slug: string) => void;
  saved?: boolean;
}

export function PlaceCard({ place, index, onOpen, onToggleSave, saved = false }: Props) {
  const { t } = useI18n();
  const category = categoryBySlug(primaryCategory(place));
  const score = popularityScore(place.slug);
  const popular = isPopular(score);

  return (
    <article
      className={`vm-place-card reveal${onToggleSave ? " vm-place-card--save" : ""}`}
      style={{ ["--i" as string]: Math.min(index, 14) }}
    >
      <button
        type="button"
        className="vm-place-card__open"
        onClick={() => onOpen(place.slug)}
        aria-label={`${place.name} · ${t("places.details")}`}
      >
        <span className="vm-place-card__media">
          <Cover place={place} className="vm-place-card__cover" />
          <span className="vm-place-card__shade" aria-hidden="true" />
          <span
            className="vm-place-card__cat"
            style={{
              ["--from" as string]: category?.from ?? "#0D6B76",
              ["--to" as string]: category?.to ?? "#2FAFBE",
            }}
          >
            {category && <CategoryIcon name={category.icon} width={13} height={13} />}
            {category ? t(category.nameKey) : place.categoryName}
          </span>
          <span className="vm-place-card__badges">
            {place.panoUrl && (
              <span className="vm-place-card__pano">
                <IconRotate width={13} height={13} />
                360°
              </span>
            )}
            {popular && (
              <span className="vm-place-card__hot">
                <IconFlame width={13} height={13} />
                {t("places.popular")}
              </span>
            )}
          </span>
        </span>

        <span className="vm-place-card__body">
          <span className="vm-place-card__title">{place.name}</span>
          <span className="vm-place-card__text">{place.shortDescription}</span>
          <span className="vm-place-card__meta">
            <span className="vm-place-card__score">
              <IconStar width={14} height={14} />
              {score}
              <span>/100</span>
            </span>
            <span className="vm-place-card__addr">
              <IconMapPin width={13} height={13} />
              {place.address}
            </span>
          </span>
          <span className="vm-place-card__cta">
            {t("places.details")}
            <IconArrowRight width={16} height={16} />
          </span>
        </span>
      </button>

      {onToggleSave && (
        <button
          type="button"
          className={`vm-place-card__save${saved ? " is-saved" : ""}`}
          onClick={() => onToggleSave(place.slug)}
          aria-pressed={saved}
          aria-label={saved ? t("sheet.saved") : t("sheet.save")}
        >
          <IconHeart width={17} height={17} />
        </button>
      )}
    </article>
  );
}
