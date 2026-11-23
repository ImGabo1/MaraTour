import "./SkyMotifs.css";

/** Sol (modo claro) · luna + rayo del Catatumbo (modo oscuro). Se alterna por CSS con data-theme. */
export function CelestialBody({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-sky ${className}`.trim()} aria-hidden="true">
      <svg className="mt-sky__sun" viewBox="0 0 240 240" fill="none">
        <defs>
          <radialGradient id="mt-sun-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--mt-sun-300)" stopOpacity=".55" />
            <stop offset="58%" stopColor="var(--mt-sun-300)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--mt-sun-300)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="mt-sun-disc" cx="38%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#FFF6D2" />
            <stop offset="55%" stopColor="var(--mt-sun-500)" />
            <stop offset="100%" stopColor="var(--mt-sun-700)" />
          </radialGradient>
        </defs>
        <circle cx="120" cy="120" r="118" fill="url(#mt-sun-halo)" />
        <g stroke="var(--mt-sun-500)" strokeWidth="4" strokeLinecap="round" opacity=".55">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="120" y1="34" x2="120" y2="48" transform={`rotate(${i * 30} 120 120)`} />
          ))}
        </g>
        <circle cx="120" cy="120" r="58" fill="url(#mt-sun-disc)" />
        <circle cx="120" cy="120" r="58" stroke="#FFF3C4" strokeWidth="1.5" opacity=".55" />
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
 * Rayo del Catatumbo: descarga grande que cae sobre el puente. El CSS lo oculta en modo claro,
 * así que solo aparece de noche, y parpadea con el mismo ritmo que el relámpago del cielo.
 */
export function CatatumboBolt({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`mt-bolt ${className}`.trim()}
      viewBox="60 0 400 460"
      fill="none"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mt-bolt-core" x1="300" y1="0" x2="230" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#FFF0B8" />
          <stop offset="100%" stopColor="#FFC83D" />
        </linearGradient>
        <filter id="mt-bolt-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      {/* halo difuso detrás de la descarga */}
      <g filter="url(#mt-bolt-blur)" stroke="#FFE08A" strokeLinecap="round" strokeLinejoin="round" opacity=".8">
        <path d="M320 8 248 150 312 158 228 302 294 310 198 452" strokeWidth="22" />
        <path d="M312 158 404 112 448 58M228 302 146 252 104 198M294 310 372 268 414 224" strokeWidth="12" />
      </g>
      {/* núcleo brillante */}
      <g stroke="url(#mt-bolt-core)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M320 8 248 150 312 158 228 302 294 310 198 452" strokeWidth="12" />
        <path d="M312 158 404 112 448 58M228 302 146 252 104 198M294 310 372 268 414 224" strokeWidth="6" />
      </g>
    </svg>
  );
}

/**
 * Puente sobre el Lago de Maracaibo (Rafael Urdaneta): calzada larga, cinco pilonos en A con
 * tirantes y pilas bajas. El dibujo vive en la franja inferior del lienzo para que el recorte
 * (`slice` anclado abajo) nunca corte las puntas de los pilonos en pantallas anchas.
 */
export function UrdanetaBridge({ className = "" }: { className?: string }) {
  const towers = [400, 600, 800, 1000, 1200];
  const piers = [
    ...Array.from({ length: 5 }, (_, i) => 20 + i * 80),
    ...Array.from({ length: 5 }, (_, i) => 1260 + i * 80),
  ];
  const stays = [40, 80, 120, 160];
  return (
    <svg
      className={`mt-urdaneta ${className}`.trim()}
      viewBox="0 0 1600 300"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* agua */}
        <path d="M0 268h1600" strokeWidth="2" opacity=".35" />
        <g strokeWidth="2" opacity=".22">
          <path d="M60 282h90M220 288h70M470 280h110M760 286h80M1080 280h100M1330 288h90" />
        </g>

        {/* pilas bajas */}
        <g strokeWidth="3" opacity=".7">
          {piers.map((x) => (
            <path key={x} d={`M${x} 214V252`} />
          ))}
        </g>

        {/* calzada: baja en los extremos y sube en el tramo atirantado */}
        <path
          d="M0 214H300C340 214 350 196 380 196H1220C1250 196 1260 214 1300 214H1600"
          strokeWidth="8"
        />
        <path
          d="M0 208H300C340 208 350 190 380 190H1220C1250 190 1260 208 1300 208H1600"
          strokeWidth="2"
          opacity=".45"
        />

        {/* pilonos en A con tirantes */}
        {towers.map((x) => (
          <g key={x}>
            <path d={`M${x - 18} 252L${x} 132L${x + 18} 252`} strokeWidth="7" />
            <path d={`M${x - 9} 196H${x + 9}`} strokeWidth="5" />
            <g strokeWidth="1.6" opacity=".7">
              {stays.map((d) => (
                <g key={d}>
                  <path d={`M${x} 136L${x - d} 196`} />
                  <path d={`M${x} 136L${x + d} 196`} />
                </g>
              ))}
            </g>
            <path d={`M${x - 18} 252V264M${x + 18} 252V264`} strokeWidth="5" />
          </g>
        ))}
      </g>
    </svg>
  );
}
