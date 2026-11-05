import type { SVGProps } from "react";
import type { PlaceEmblemName } from "../data/placeProfiles";
import {
  CategoryIcon,
  IconBoat,
  IconBook,
  IconBridge,
  IconCake,
  IconCamera,
  IconChinita,
  IconCoffee,
  IconKey,
  IconMusic,
  IconPlane,
  IconShield,
  IconStar,
  IconSun,
  IconTheater,
} from "./icons";

type Props = SVGProps<SVGSVGElement> & { name: PlaceEmblemName };

/**
 * Emblema del lugar. Reutiliza los iconos de categoría y suma símbolos
 * propios para que cada ficha tenga una marca reconocible.
 */
export function PlaceEmblem({ name, ...rest }: Props) {
  switch (name) {
    case "chinita":
      return <IconChinita {...rest} />;
    case "bridge":
      return <IconBridge {...rest} />;
    case "sun":
      return <IconSun {...rest} />;
    case "theater":
      return <IconTheater {...rest} />;
    case "coffee":
      return <IconCoffee {...rest} />;
    case "cake":
      return <IconCake {...rest} />;
    case "plane":
      return <IconPlane {...rest} />;
    case "music":
      return <IconMusic {...rest} />;
    case "camera":
      return <IconCamera {...rest} />;
    case "key":
      return <IconKey {...rest} />;
    case "star":
      return <IconStar {...rest} />;
    case "shield":
      return <IconShield {...rest} />;
    case "boat":
      return <IconBoat {...rest} />;
    case "book":
      return <IconBook {...rest} />;
    default:
      return <CategoryIcon name={name} {...rest} />;
  }
}
