import type { Place } from "../types";
import { Cover } from "./Cover";
import { IconRotate } from "./icons";

interface Props {
  place: Place;
  index: number;
  onOpen: (slug: string) => void;
}

export function PlaceCard({ place, index, onOpen }: Props) {
  return (
    <button
      type="button"
      className="card reveal"
      style={{ ["--i" as string]: index }}
      onClick={() => onOpen(place.slug)}
    >
      <Cover place={place} className="card__cover" />
      <span className="card__body">
        <span className="card__category">{place.categoryName}</span>
        <span className="card__title">{place.name}</span>
        <span className="card__text">{place.shortDescription}</span>
        {place.panoUrl && (
          <span className="chip chip--teal">
            <IconRotate width={14} height={14} /> Vista 360°
          </span>
        )}
      </span>
    </button>
  );
}
