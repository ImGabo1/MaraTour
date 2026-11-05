import { useId } from "react";
import { useI18n } from "../i18n/I18nProvider";

export const MAP_W = 800;
export const MAP_H = 520;

/** Fondo dibujado de respaldo: barrios, parques, avenidas, el lago y el puente. */
export function MapBackdrop({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const land = `map-land-${uid}`;
  const water = `map-water-${uid}`;
  const park = `map-park-${uid}`;

  return (
    <g aria-hidden="true" className={`map-backdrop${compact ? " map-backdrop--compact" : ""}`}>
      <defs>
        <linearGradient id={land} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#F8F1E3" />
          <stop offset="100%" stopColor="#EFE3CF" />
        </linearGradient>
        <linearGradient id={water} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0%" stopColor="#8FD3D8" />
          <stop offset="100%" stopColor="#2A8D9B" />
        </linearGradient>
        <linearGradient id={park} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#CFE6B4" />
          <stop offset="100%" stopColor="#A8D09A" />
        </linearGradient>
      </defs>

      <rect width={MAP_W} height={MAP_H} fill={`url(#${land})`} />

      {/* Barrios */}
      <path d="M0 0h430l-34 148H0z" fill="#FBF6EC" opacity="0.8" />
      <path d="M0 148h396l-26 146H0z" fill="#F3E7D1" opacity="0.65" />
      <path d="M0 294h370l-22 132H0z" fill="#FBF4E8" opacity="0.7" />
      <path d="M0 426h348l-18 94H0z" fill="#F1E4CE" opacity="0.6" />

      {/* Parques */}
      <rect x="76" y="96" width="148" height="104" rx="24" fill={`url(#${park})`} />
      <rect x="352" y="338" width="170" height="108" rx="26" fill={`url(#${park})`} opacity="0.9" />
      <rect x="206" y="414" width="96" height="62" rx="18" fill={`url(#${park})`} opacity="0.8" />
      <g fill="#6FA96B" opacity="0.5">
        <circle cx="112" cy="126" r="5" />
        <circle cx="140" cy="154" r="4" />
        <circle cx="176" cy="122" r="5" />
        <circle cx="196" cy="164" r="4" />
        <circle cx="386" cy="370" r="5" />
        <circle cx="420" cy="404" r="4" />
        <circle cx="466" cy="368" r="5" />
        <circle cx="238" cy="440" r="4" />
      </g>

      {/* Lago de Maracaibo */}
      <path
        d="M638 0c42 64-8 132 36 196 34 50 8 98 38 146 20 32 16 74 10 178h78V0z"
        fill={`url(#${water})`}
      />
      <path
        d="M638 0c42 64-8 132 36 196 34 50 8 98 38 146 20 32 16 74 10 178"
        fill="none"
        stroke="#D9F2F1"
        strokeWidth="5"
        opacity="0.85"
      />
      <g stroke="#EAFBFA" strokeWidth="3.4" strokeLinecap="round" opacity="0.5">
        <path d="M676 74h42M660 118h52M690 262h46M672 306h54M700 402h44M684 446h48" />
      </g>

      {/* Avenidas principales */}
      <g fill="none" stroke="#DCCBAF" strokeWidth="10" strokeLinecap="round">
        <path d="M0 150h612M0 296h584M0 438h548M170 0v520M342 0v520M512 0v452" />
        <path d="M0 520C160 392 306 314 448 236S606 112 642 16" />
      </g>
      <g fill="none" stroke="#FFFDF7" strokeWidth="6" strokeLinecap="round">
        <path d="M0 150h612M0 296h584M0 438h548M170 0v520M342 0v520M512 0v452" />
        <path d="M0 520C160 392 306 314 448 236S606 112 642 16" />
      </g>
      <g fill="none" stroke="#FFFDF7" strokeWidth="3" opacity="0.75">
        <path d="M64 0v520M252 0v520M428 0v520" />
        <path d="M0 220h604M0 360h570M0 480h540" />
      </g>

      {/* Puente sobre el Lago */}
      <g className="map-bridge">
        <path d="M606 252c64-24 124-42 204-52" fill="none" stroke="#F7ECD8" strokeWidth="4" />
        <path d="M606 257c64-24 124-42 204-52" fill="none" stroke="#F7ECD8" strokeWidth="1.4" opacity="0.7" />
        <g stroke="#F7ECD8" strokeWidth="3" strokeLinecap="round">
          <path d="M660 241v-44M668 239v-44M732 211v-38M740 209v-38" />
          <path d="M654 197h20M726 173h20" />
        </g>
        <path
          d="M606 247c54-8 84-42 112-42s48 30 84 18 54-28 108-34"
          fill="none"
          stroke="#F7ECD8"
          strokeWidth="2"
          opacity="0.9"
        />
        <g stroke="#F7ECD8" strokeWidth="0.9" opacity="0.55">
          <path d="M624 250v-26M644 246v-34M682 236v-34M708 227v-32M760 212v-30M782 208v-30" />
        </g>
      </g>

      {/* Brújula */}
      {!compact && (
        <g className="map-compass" transform="translate(744 466)">
          <circle r="22" fill="rgba(255,255,255,.74)" />
          <path d="M0 -14l6 20-6-5-6 5z" fill="#0B6A73" />
          <text y="-26" textAnchor="middle">
            N
          </text>
        </g>
      )}

      {/* Etiquetas */}
      {!compact && (
        <g className="map-labels">
          <text className="map-label map-label--district" x="238" y="196" textAnchor="middle">
            Centro
          </text>
          <text className="map-label map-label--district" x="436" y="352" textAnchor="middle">
            Bella Vista
          </text>
          <text className="map-label map-label--district" x="150" y="480" textAnchor="middle">
            La Chinita
          </text>
          <text
            className="map-label map-label--water"
            x="756"
            y="336"
            textAnchor="middle"
            transform="rotate(-90 756 336)"
          >
            {t("map.lake")}
          </text>
          <text className="map-label map-label--bridge" x="700" y="146" textAnchor="middle">
            {t("map.bridge")}
          </text>
        </g>
      )}
    </g>
  );
}
