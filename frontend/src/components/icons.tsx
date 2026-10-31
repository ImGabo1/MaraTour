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

export type CategoryIconName = "landmark" | "palette" | "church" | "tree";

export function CategoryIcon({ name, ...rest }: P & { name: CategoryIconName }) {
  switch (name) {
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
    case "tree":
      return (
        <svg {...base} {...rest}>
          <path d="M12 21V11" />
          <path d="M12 11c-5 0-8-3-8-7 5 0 8 3 8 7zM12 14c4 0 7-2.5 7-6-4 0-7 2.5-7 6z" />
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
