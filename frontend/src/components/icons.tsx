import type { SVGProps } from "react";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

type P = SVGProps<SVGSVGElement>;

export const IconExternal = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export const IconRotate = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12a8 8 0 1 1-3-6.2" />
    <path d="M20 4v5h-5" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v11" />
    <path d="M7 11l5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

export const IconWave = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 15c3-4 6 4 9 0s6 4 9 0" />
    <path d="M3 9c3-4 6 4 9 0s6 4 9 0" />
  </svg>
);

export const IconBridge = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2 18h20" />
    <path d="M5 18c0-6 3-9 7-9s7 3 7 9" />
    <path d="M9 18v-4M12 18v-7M15 18v-4" />
    <path d="M3 21h18" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8" y="3" width="8" height="18" rx="2" />
    <path d="M4 9c-1 2-1 4 0 6M20 9c1 2 1 4 0 6" />
  </svg>
);

export const IconOffline = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 3l18 18" />
    <path d="M8.5 16.5a5 5 0 0 1 7 0" />
    <path d="M5 12.5a10 10 0 0 1 3-2" />
    <path d="M12 20h.01" />
  </svg>
);

export const IconShare = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 15V4" />
    <path d="M8 8l4-4 4 4" />
    <path d="M6 12H5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-1" />
  </svg>
);

export const IconGlobe = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.4 4 5.5 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.5-4-9s1.4-6.6 4-9z" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const IconChevronDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 12h16" />
    <path d="M14 6l6 6-6 6" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3c.7 3.4-1.8 4.7-2.7 6.3A5.5 5.5 0 0 0 12 21a6 6 0 0 0 6-6c0-4.2-3.4-6.3-4.7-9.2-.4 2.4-1 3.5-1.3 3.6-.2-.4-.2-3 0-6.4z" />
  </svg>
);

export const IconSparkles = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    <path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6L5 15z" />
  </svg>
);

export const IconMapPin = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconSort = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h9M4 12h6M4 17h3" />
    <path d="M17 6v12" />
    <path d="M14 15l3 3 3-3" />
  </svg>
);

export const IconHeart = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.3-7-9.4A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 7 3.6C19 15.7 12 20 12 20z" />
  </svg>
);

export const IconExpand = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
  </svg>
);

export const IconMinimize = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9h5V4M20 9h-5V4M20 15h-5v5M4 15h5v5" />
  </svg>
);

export const IconLayers = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 16l9 5 9-5" />
  </svg>
);

export const IconCompass = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);

export const IconStar = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9L12 3z" />
  </svg>
);

export const IconHome = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
  </svg>
);

export const IconBook = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22V5.5z" />
    <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5A2.5 2.5 0 0 1 20 22V5.5z" />
    <path d="M7 7h2M7 11h2M15 7h2M15 11h2" />
  </svg>
);

export const IconChat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 3v-5.2A7.5 7.5 0 0 1 8.5 4h5A7.5 7.5 0 0 1 21 11.5z" />
    <path d="M8 10h.01M12 10h.01M16 10h.01" />
  </svg>
);

export const IconMenu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconSend = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 3L10 14" />
    <path d="M21 3l-7 18-4-7-7-4 18-7z" />
  </svg>
);

export const IconVolume = (p: P) => (
  <svg {...base} {...p}>
    <path d="M11 5L6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconWallet = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
    <path d="M20 10h-4a2 2 0 0 0 0 4h4" />
  </svg>
);

export const IconUsers = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6" />
    <path d="M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
);

export const IconGrid = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconMap = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 4L3 6.5v14L9 18l6 2 6-2.5v-14L15 6 9 4z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);

export const IconList = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 6h12M9 12h12M9 18h12" />
    <path d="M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);

export const IconArrowUp = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20V4" />
    <path d="M6 10l6-6 6 6" />
  </svg>
);

export const IconArrowDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v16" />
    <path d="M6 14l6 6 6-6" />
  </svg>
);

export const IconRoute = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18H14a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h5.5" />
  </svg>
);

export const IconBulb = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M8.5 15.5a6 6 0 1 1 7 0c-.9.8-1.5 1.6-1.5 2.5h-4c0-.9-.6-1.7-1.5-2.5z" />
  </svg>
);

export const IconLeaf = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 10-6 10-16z" />
    <path d="M4 21c2-7 7-11 13-13" />
  </svg>
);

export const IconCamera = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

export type CategoryIconName =
  | "landmark"
  | "bank"
  | "palette"
  | "church"
  | "museum"
  | "leaf"
  | "waves"
  | "utensils"
  | "bag"
  | "cross"
  | "cap"
  | "ball"
  | "moon"
  | "bus"
  | "tower"
  | "tree";

export function CategoryIcon({ name, ...rest }: P & { name: CategoryIconName }) {
  switch (name) {
    case "bank":
      return (
        <svg {...base} {...rest}>
          <path d="M3 10l9-6 9 6" />
          <path d="M4 10v9M9 10v9M15 10v9M20 10v9" />
          <path d="M2 21h20M2 10h20" />
          <circle cx="12" cy="14" r="1.4" />
        </svg>
      );
    case "palette":
      return (
        <svg {...base} {...rest}>
          <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2.2-.5-1.3.3-2.3 1.7-2.3H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3z" />
          <circle cx="7.5" cy="11" r="1" />
          <circle cx="10" cy="7.5" r="1" />
          <circle cx="14.5" cy="7.5" r="1" />
        </svg>
      );
    case "church":
      return (
        <svg {...base} {...rest}>
          <path d="M12 2v5M10 4.5h4" />
          <path d="M6 21V12l6-5 6 5v9z" />
          <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
        </svg>
      );
    case "museum":
      return (
        <svg {...base} {...rest}>
          <path d="M3 9l9-5 9 5" />
          <path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" />
          <path d="M3 21h18" />
          <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
        </svg>
      );
    case "leaf":
    case "tree":
      return (
        <svg {...base} {...rest}>
          <path d="M12 21V11" />
          <path d="M12 11c-5 0-8-3-8-7 5 0 8 3 8 7zM12 14c4 0 7-2.5 7-6-4 0-7 2.5-7 6z" />
        </svg>
      );
    case "waves":
      return (
        <svg {...base} {...rest}>
          <path d="M3 8c2.5-2 4.5 2 7 0s4.5 2 7 0 4.5 2 7 0" />
          <path d="M3 13c2.5-2 4.5 2 7 0s4.5 2 7 0 4.5 2 7 0" />
          <path d="M3 18c2.5-2 4.5 2 7 0s4.5 2 7 0 4.5 2 7 0" />
        </svg>
      );
    case "utensils":
      return (
        <svg {...base} {...rest}>
          <path d="M6 3v8a2.5 2.5 0 0 0 5 0V3" />
          <path d="M8.5 11v10" />
          <path d="M17 3c-1.6 2.2-2 4.6-2 7a2.5 2.5 0 0 0 4 0c0-2.4-.4-4.8-2-7z" />
          <path d="M17 12v9" />
        </svg>
      );
    case "bag":
      return (
        <svg {...base} {...rest}>
          <path d="M5 8h14l-1.2 13H6.2L5 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          <path d="M9 12v2M15 12v2" />
        </svg>
      );
    case "cross":
      return (
        <svg {...base} {...rest}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
    case "cap":
      return (
        <svg {...base} {...rest}>
          <path d="M2 9l10-5 10 5-10 5L2 9z" />
          <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
          <path d="M22 9v6" />
        </svg>
      );
    case "ball":
      return (
        <svg {...base} {...rest}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7l4 3-1.5 5h-5L8 10l4-3z" />
          <path d="M12 3v4M4 10l4 .2M6.5 19l2.7-3.5M17.5 19l-2.7-3.5M20 10l-4 .2" />
        </svg>
      );
    case "moon":
      return (
        <svg {...base} {...rest}>
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
          <path d="M18 4l.5 1.5L20 6l-1.5.5L18 8l-.5-1.5L16 6l1.5-.5L18 4z" />
        </svg>
      );
    case "bus":
      return (
        <svg {...base} {...rest}>
          <rect x="4" y="3" width="16" height="15" rx="3" />
          <path d="M4 10h16" />
          <path d="M8 18v2M16 18v2" />
          <circle cx="8" cy="14" r="1" />
          <circle cx="16" cy="14" r="1" />
          <path d="M7 3V1M17 3V1" />
        </svg>
      );
    case "tower":
      return (
        <svg {...base} {...rest}>
          <path d="M7 21V6l5-4 5 4v15" />
          <path d="M4 21h16" />
          <path d="M10 21v-4h4v4" />
          <path d="M9.5 9h1M13.5 9h1M9.5 13h1M13.5 13h1" />
          <path d="M12 2V0" />
        </svg>
      );
    default:
      return (
        <svg {...base} {...rest}>
          <path d="M3 9l9-5 9 5" />
          <path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" />
          <path d="M3 21h18" />
        </svg>
      );
  }
}
