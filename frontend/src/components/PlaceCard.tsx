import { categoryBySlug } from "../data/categories";
import { profileFor } from "../data/placeProfiles";
import { useI18n } from "../i18n/I18nProvider";
import { isPopular, popularityScore } from "../lib/popularity";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { PlaceEmblem } from "./PlaceEmblem";
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
  const profile = profileFor(place);
  const score = popularityScore(place.slug);
  const popular = isPopular(score);

  return (
    <article
      className={`vm-place-card vm-place-card--themed reveal${onToggleSave ? " vm-place-card--save" : ""}`}
      style={{
        ["--i" as string]: Math.min(index, 14),
        ["--place-from" as string]: profile.colors.from,
        ["--place-to" as string]: profile.colors.to,
        ["--place-accent" as string]: profile.colors.accent,
        ["--place-soft" as string]: profile.colors.soft,
        ["--place-ink" as string]: profile.colors.ink,
      }}
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
          <span className="vm-place-card__emblem" aria-hidden="true">
            <PlaceEmblem name={profile.emblem} width={18} height={18} />
          </span>
          <span
            className="vm-place-card__cat"
            style={{
              ["--from" as string]: profile.colors.from,
              ["--to" as string]: profile.colors.to,
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
          <span className="vm-place-card__essence">{profile.essence}</span>
          <span className="vm-place-card__text">{place.shortDescription}</span>
          <span className="vm-place-card__meta">
            <span className="vm-place-card__score">
              <IconStar width={14} height={14} />
              {score}
              <span>/100</span>
            </span>
            <span className="vm-place-card__addr">
              <IconMapPin width={13} height={13} />
              <span>{place.address}</span>
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
