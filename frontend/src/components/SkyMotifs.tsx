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

/** Puente sobre el Lago de Maracaibo (Rafael Urdaneta): calzada larga, cinco pilonos en A con tirantes y pilas bajas. */
export function UrdanetaBridge({ className = "" }: { className?: string }) {
  const towers = [300, 450, 600, 750, 900];
  const piers = [...Array.from({ length: 9 }, (_, i) => 20 + i * 30), ...Array.from({ length: 9 }, (_, i) => 960 + i * 30)];
  return (
    <svg className={`mt-urdaneta ${className}`.trim()} viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* calzada: baja en los extremos y sube en el tramo atirantado */}
        <path d="M0 150H220C260 150 270 126 300 126H900C930 126 940 150 980 150H1200" strokeWidth="5" />
        {piers.map((x) => (
          <path key={x} d={`M${x} ${x < 220 || x > 980 ? 150 : 150}V182`} strokeWidth="3" />
        ))}
        {towers.map((x) => (
          <g key={x}>
            <path d={`M${x - 16} 182L${x} 20L${x + 16} 182`} strokeWidth="5" />
            <path d={`M${x - 8} 126H${x + 8}`} strokeWidth="4" />
            <path d={`M${x} 28L${x - 70} 126M${x} 40L${x - 50} 126M${x} 52L${x - 30} 126M${x} 28L${x + 70} 126M${x} 40L${x + 50} 126M${x} 52L${x + 30} 126`} strokeWidth="1.2" opacity=".85" />
            <path d={`M${x - 16} 182V196M${x + 16} 182V196`} strokeWidth="5" />
          </g>
        ))}
      </g>
    </svg>
  );
}
