import "./SkyMotifs.css";

/** Sol (modo claro) · luna + rayo del Catatumbo (modo oscuro). Se alterna por CSS con data-theme. */
export function CelestialBody({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-sky ${className}`.trim()} aria-hidden="true">
      <svg className="mt-sky__sun" viewBox="0 0 240 240" fill="none">
        <circle cx="120" cy="120" r="118" fill="var(--mt-sun-300)" opacity=".5" />
        <g stroke="var(--mt-sun-500)" strokeWidth="5" strokeLinecap="round">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="120" y1="22" x2="120" y2="40" transform={`rotate(${i * 30} 120 120)`} />
          ))}
        </g>
        <circle cx="120" cy="120" r="62" fill="var(--mt-sun-500)" />
      </svg>

      <svg className="mt-sky__night" viewBox="0 0 280 300" fill="none">
        <defs>
          <radialGradient id="mt-moon-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#bfe4ff" stopOpacity=".38" />
            <stop offset="1" stopColor="#bfe4ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="108" fill="url(#mt-moon-halo)" />
        {/* luna creciente */}
        <path d="M138 52a58 58 0 1 0 32 98 48 48 0 0 1-32-98Z" fill="#EAF7FF" />
        <circle cx="86" cy="92" r="5" fill="#B7CFE3" opacity=".6" />
        <circle cx="104" cy="128" r="3.5" fill="#B7CFE3" opacity=".5" />
        {/* estrellas */}
        <g fill="#FFE08A">
          <circle cx="196" cy="40" r="2.4" />
          <circle cx="232" cy="84" r="1.8" />
          <circle cx="40" cy="36" r="1.8" />
          <circle cx="212" cy="140" r="2" />
        </g>
        {/* nube y relámpago del Catatumbo */}
        <path className="mt-sky__cloud" d="M170 150c-14 0-22 9-22 19 0 3 .8 6 2 8h68c10 0 16-7 16-15 0-9-7-15-15-15-2-11-11-19-22-19-9 0-16 5-19 12-3-6-5-10-8-10Z" fill="#2B4D6E" opacity=".85" />
        <path className="mt-sky__bolt" d="M202 176l-22 40h15l-11 46 34-56h-16l14-30Z" fill="#FFE08A" stroke="#FFC83D" strokeWidth="1.5" strokeLinejoin="round" />
        <path className="mt-sky__glow" d="M170 150c-14 0-22 9-22 19 0 3 .8 6 2 8h68c10 0 16-7 16-15 0-9-7-15-15-15z" fill="#FFE08A" />
      </svg>
    </div>
  );
}

/**
 * Puente sobre el Lago de Maracaibo (General Rafael Urdaneta): calzada larga que sube en el tramo
 * atirantado, cinco pilonos en V invertida con tirantes en abanico, farolas, pilas bajas,
 * una silueta lejana para dar profundidad, y el lago con su reflejo y una lancha.
 */
export function UrdanetaBridge({ className = "" }: { className?: string }) {
  const towers = [300, 450, 600, 750, 900];
  const piers = [...Array.from({ length: 8 }, (_, i) => 24 + i * 28), ...Array.from({ length: 8 }, (_, i) => 976 + i * 28)];
  const lamps = Array.from({ length: 22 }, (_, i) => 20 + i * 54).filter((x) => !towers.some((t) => Math.abs(t - x) < 20));
  const deck = (x: number) => (x < 220 || x > 980 ? 150 : x < 300 ? 150 - ((x - 220) / 80) * 24 : x > 900 ? 126 + ((x - 900) / 80) * 24 : 126);
  const pylon = (x: number) => `M${x - 21} 192L${x - 4} 16H${x + 4}L${x + 21} 192H${x + 13}L${x} 58L${x - 13} 192Z`;
  const cables = (x: number) =>
    [0, 1, 2, 3, 4].map((k) => {
      const top = 26 + k * 9;
      const reach = 78 - k * 15;
      return `M${x} ${top}L${x - reach} ${deck(x - reach)}M${x} ${top}L${x + reach} ${deck(x + reach)}`;
    }).join("");
  return (
    <svg className={`mt-urdaneta ${className}`.trim()} viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="mt-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="mt-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".16" />
        </linearGradient>
        <clipPath id="mt-below"><rect x="0" y="192" width="1200" height="48" /></clipPath>
      </defs>

      {/* bruma del horizonte y lago */}
      <rect x="0" y="120" width="1200" height="72" fill="url(#mt-haze)" />
      <rect x="0" y="192" width="1200" height="48" fill="url(#mt-lake)" />

      {/* silueta lejana (profundidad) */}
      <g stroke="currentColor" strokeLinecap="round" opacity=".28" transform="translate(0 38) scale(1 .62)">
        <path d="M0 150H1200" strokeWidth="4" />
        {[150, 350, 560, 780, 1010].map((x) => (
          <path key={x} d={`M${x - 14} 150L${x} 40L${x + 14} 150M${x} 46L${x - 60} 150M${x} 46L${x + 60} 150`} strokeWidth="2.4" />
        ))}
      </g>

      {/* puente principal */}
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {piers.map((x) => (
          <g key={x}>
            <path d={`M${x} ${deck(x)}V192`} strokeWidth="5" />
            <path d={`M${x - 6} ${deck(x) + 6}H${x + 6}`} strokeWidth="3" />
          </g>
        ))}
        <path d="M0 150H220C250 150 268 126 300 126H900C932 126 950 150 980 150H1200" strokeWidth="8" />
        <path d="M0 158H214C246 158 266 134 300 134H900C934 134 954 158 986 158H1200" strokeWidth="2" opacity=".6" />
        <path d="M0 144H220C250 144 268 120 300 120H900C932 120 950 144 980 144H1200" strokeWidth="1.5" opacity=".7" />
        {lamps.map((x) => (
          <path key={x} d={`M${x} ${deck(x) - 1}V${deck(x) - 11}`} strokeWidth="1.8" opacity=".75" />
        ))}
      </g>
      <g fill="currentColor">
        {towers.map((x) => (
          <path key={x} d={pylon(x)} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".85">
        {towers.map((x) => (
          <path key={x} d={cables(x)} />
        ))}
      </g>

      {/* reflejo en el lago */}
      <g clipPath="url(#mt-below)" opacity=".22" fill="currentColor" transform="translate(0 384) scale(1 -1)">
        {towers.map((x) => (
          <path key={x} d={pylon(x)} />
        ))}
        <path d="M0 146H1200V154H0Z" />
      </g>
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".35">
        <path d="M0 204C60 198 120 210 180 204S300 198 360 204 480 210 540 204 660 198 720 204 840 210 900 204 1020 198 1080 204 1140 210 1200 204" />
        <path d="M0 220C80 214 160 226 240 220S400 214 480 220 640 226 720 220 880 214 960 220 1120 226 1200 220" />
        <path d="M0 233C100 228 200 238 300 233S500 228 600 233 800 238 900 233 1100 228 1200 233" opacity=".6" />
      </g>

      {/* lancha */}
      <g className="mt-urdaneta__boat" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" opacity=".7">
        <path d="M1040 208h44l-7 9h-30z" fill="currentColor" />
        <path d="M1062 208V184l18 22z" fill="currentColor" />
        <path d="M1062 208V180" strokeWidth="1.6" />
      </g>
    </svg>
  );
}
