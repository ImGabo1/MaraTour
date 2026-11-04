import { categoryBySlug } from "../data/categories";
import { useI18n } from "../i18n/I18nProvider";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";
import { Cover } from "./Cover";
import { IconArrowRight, IconRotate } from "./icons";

interface Props {
  places: readonly Place[];
  onOpen: (place: Place) => void;
}

/** Selección de lugares con vista 360°: una parada antes de la visita. */
export function PanoramaSection({ places, onOpen }: Props) {
  const { t } = useI18n();
  if (places.length === 0) return null;

  return (
    <section id="recorridos" className="section section--pano">
      <div className="container">
        <div className="section-heading section-heading--row">
          <div>
            <p className="eyebrow">{t("panos.kicker")}</p>
            <h2 className="section-title">{t("panos.title")}</h2>
            <p className="section-lead">{t("panos.lead")}</p>
          </div>
          <span className="section-count">{t("explore.results", { n: places.length })}</span>
        </div>

        <div className="pano-grid">
          {places.map((place) => {
            const category = categoryBySlug(primaryCategory(place));
            return (
              <button
                key={place.slug}
                type="button"
                className="pano-card"
                onClick={() => onOpen(place)}
                aria-label={`${place.name} · ${t("panos.open")}`}
              >
                <span className="pano-card__media">
                  <Cover place={place} className="pano-card__cover" />
                  <span className="pano-card__badge">
                    <IconRotate width={13} height={13} />
                    360°
                  </span>
                  <span className="pano-card__go" aria-hidden="true">
                    <IconArrowRight width={17} height={17} />
                  </span>
                </span>
                <span className="pano-card__body">
                  <strong>{place.name}</strong>
                  <span>{category ? t(category.nameKey) : place.categoryName}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
