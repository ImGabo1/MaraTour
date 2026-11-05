import { IconBridge, IconMapPin, IconRotate } from "./icons";

/**
 * Escena ilustrada de Maracaibo en clave 3D: sol brillante, lago, puente,
 * Basílica de la Chinita, palmeras y casco histórico. Es SVG + CSS para que
 * cargue al instante y se pueda animar sin depender de fotos externas.
 */
export function MaracaiboScene({ className = "" }: { className?: string }) {
  return (
    <div className={`vm-scene ${className}`.trim()} role="img" aria-label="Maracaibo ilustrado: el lago, el puente, la Basílica y el sol">
      <svg viewBox="0 0 560 520" className="vm-scene__svg" aria-hidden="true">
        <defs>
          <linearGradient id="vm-sky" x1="0" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#8FE0F4" />
            <stop offset="42%" stopColor="#C8F0F1" />
            <stop offset="74%" stopColor="#FBE8C6" />
            <stop offset="100%" stopColor="#FFD9AE" />
          </linearGradient>
          <radialGradient id="vm-sun" cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="42%" stopColor="#FFE79B" />
            <stop offset="100%" stopColor="#FFB84D" />
          </radialGradient>
          <radialGradient id="vm-sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE7A3" stopOpacity="0.92" />
            <stop offset="52%" stopColor="#FFD57A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFD57A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vm-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#59C7D2" />
            <stop offset="38%" stopColor="#2FA6BC" />
            <stop offset="100%" stopColor="#0A5E79" />
          </linearGradient>
          <linearGradient id="vm-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6E0C0" />
            <stop offset="100%" stopColor="#E8C89C" />
          </linearGradient>
          <linearGradient id="vm-tower" x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0%" stopColor="#FFF7E6" />
            <stop offset="52%" stopColor="#F7DCC4" />
            <stop offset="100%" stopColor="#D9A9A0" />
          </linearGradient>
          <linearGradient id="vm-tower-side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D9A9A0" />
            <stop offset="100%" stopColor="#B97C7C" />
          </linearGradient>
          <linearGradient id="vm-dome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4B7C8" />
            <stop offset="100%" stopColor="#C96A91" />
          </linearGradient>
          <linearGradient id="vm-building" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6C98A" />
            <stop offset="100%" stopColor="#D9865D" />
          </linearGradient>
          <linearGradient id="vm-building-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4E1B9" />
            <stop offset="100%" stopColor="#D4B077" />
          </linearGradient>
          <filter id="vm-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0B4A5A" floodOpacity="0.18" />
          </filter>
          <filter id="vm-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <rect width="560" height="520" fill="url(#vm-sky)" />

        {/* Sol */}
        <g className="vm-scene__sun">
          <circle cx="424" cy="124" r="120" fill="url(#vm-sun-glow)" />
          <g className="vm-scene__rays">
            {Array.from({ length: 12 }, (_, index) => (
              <rect
                key={index}
                x="420"
                y="-18"
                width="8"
                height="42"
                rx="4"
                fill="#FFE7A3"
                opacity="0.85"
                transform={`rotate(${index * 30} 424 124)`}
              />
            ))}
          </g>
          <circle cx="424" cy="124" r="45" fill="url(#vm-sun)" />
          <circle cx="424" cy="124" r="45" fill="none" stroke="#FFF8DC" strokeWidth="2" opacity="0.7" />
        </g>

        {/* Nubes */}
        <g className="vm-scene__cloud vm-scene__cloud--1" fill="#FFFFFF" opacity="0.82">
          <ellipse cx="110" cy="104" rx="46" ry="18" />
          <ellipse cx="86" cy="96" rx="25" ry="16" />
          <ellipse cx="138" cy="94" rx="28" ry="17" />
        </g>
        <g className="vm-scene__cloud vm-scene__cloud--2" fill="#FFFFFF" opacity="0.62">
          <ellipse cx="286" cy="74" rx="34" ry="13" />
          <ellipse cx="268" cy="68" rx="18" ry="11" />
          <ellipse cx="306" cy="68" rx="20" ry="12" />
        </g>
        <g className="vm-scene__cloud vm-scene__cloud--3" fill="#FFFFFF" opacity="0.5">
          <ellipse cx="492" cy="210" rx="38" ry="13" />
          <ellipse cx="474" cy="204" rx="20" ry="11" />
          <ellipse cx="512" cy="204" rx="22" ry="12" />
        </g>

        {/* Pájaros */}
        <g className="vm-scene__birds" fill="none" stroke="#0C4D5C" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          <path d="M142 178c6-6 12-6 18 0M166 166c5-5 10-5 15 0" />
          <path d="M312 138c5-5 10-5 15 0M332 128c4-4 8-4 12 0" />
        </g>

        {/* Lago */}
        <path
          d="M0 352c48-10 82 6 132 0 52-6 86-18 138-10 48 7 80 20 130 12 62-10 108-4 160 6v160H0z"
          fill="url(#vm-water)"
        />
        <path
          d="M0 352c48-10 82 6 132 0 52-6 86-18 138-10 48 7 80 20 130 12 62-10 108-4 160 6"
          fill="none"
          stroke="#BFF5F4"
          strokeWidth="5"
          opacity="0.75"
        />
        <g className="vm-scene__waves" stroke="#D8FBF8" strokeWidth="3" strokeLinecap="round" opacity="0.45" fill="none">
          <path d="M44 404h56M132 384h44M238 420h64M352 392h48M446 430h58M96 450h48M288 462h52M420 470h44" />
        </g>
        <g className="vm-scene__reflection" fill="#FFE7A3" opacity="0.4">
          <ellipse cx="424" cy="382" rx="46" ry="5" />
          <ellipse cx="424" cy="398" rx="30" ry="4" />
          <ellipse cx="424" cy="414" rx="20" ry="3" />
        </g>

        {/* Puente sobre el Lago */}
        <g className="vm-scene__bridge" filter="url(#vm-soft)">
          <path d="M-10 338C90 328 190 314 300 302s170-18 280-26" fill="none" stroke="#F8E9CF" strokeWidth="9" />
          <path d="M-10 334C90 324 190 310 300 298s170-18 280-26" fill="none" stroke="#FFFDF7" strokeWidth="3" opacity="0.8" />
          <g stroke="#F4D8B0" strokeWidth="4" strokeLinecap="round">
            <path d="M104 326v-54M112 325v-54M252 307v-50M260 306v-50M412 288v-46M420 287v-46" />
            <path d="M96 272h24M244 257h24M404 242h24" />
          </g>
          <path
            d="M-10 330C60 314 88 276 122 272s58 34 128 18 88-44 128-38 54 34 118 16"
            fill="none"
            stroke="#F4D8B0"
            strokeWidth="2.4"
            opacity="0.9"
          />
          <g stroke="#F4D8B0" strokeWidth="1.2" opacity="0.65">
            <path d="M20 326v-20M48 322v-26M76 316v-30M154 300v-26M186 294v-26M218 288v-26M300 274v-24M332 270v-24M364 264v-24M448 250v-22M480 246v-22M512 242v-22" />
          </g>
        </g>

        {/* Muelle / malecón del fondo */}
        <path d="M0 446c70-14 124 4 196-2 70-6 118-14 188-8 62 5 112 14 176 8v78H0z" fill="url(#vm-ground)" />
        <path d="M0 446c70-14 124 4 196-2 70-6 118-14 188-8 62 5 112 14 176 8" fill="none" stroke="#FFF6E4" strokeWidth="6" opacity="0.8" />

        {/* Casco histórico */}
        <g className="vm-scene__city" filter="url(#vm-soft)">
          <g>
            <rect x="18" y="286" width="72" height="112" rx="4" fill="url(#vm-building)" />
            <rect x="18" y="286" width="16" height="112" fill="#FFFFFF" opacity="0.14" />
            <rect x="32" y="302" width="14" height="20" rx="6" fill="#FFF6DF" opacity="0.9" />
            <rect x="58" y="302" width="14" height="20" rx="6" fill="#FFF6DF" opacity="0.9" />
            <rect x="32" y="334" width="14" height="20" rx="6" fill="#FFF6DF" opacity="0.9" />
            <rect x="58" y="334" width="14" height="20" rx="6" fill="#FFF6DF" opacity="0.9" />
            <rect x="26" y="370" width="56" height="28" rx="4" fill="#8A4E3D" opacity="0.7" />
          </g>
          <g>
            <rect x="96" y="268" width="86" height="130" rx="4" fill="url(#vm-building-2)" />
            <rect x="96" y="268" width="18" height="130" fill="#FFFFFF" opacity="0.16" />
            <rect x="112" y="286" width="16" height="22" rx="7" fill="#FFF6DF" />
            <rect x="142" y="286" width="16" height="22" rx="7" fill="#FFF6DF" />
            <rect x="112" y="320" width="16" height="22" rx="7" fill="#FFF6DF" />
            <rect x="142" y="320" width="16" height="22" rx="7" fill="#FFF6DF" />
            <path d="M96 268l43-18 43 18z" fill="#C98558" />
          </g>
          <g>
            <rect x="190" y="292" width="66" height="106" rx="4" fill="#E9A97B" />
            <rect x="190" y="292" width="14" height="106" fill="#FFFFFF" opacity="0.16" />
            <rect x="204" y="308" width="13" height="18" rx="5" fill="#FFF6DF" />
            <rect x="228" y="308" width="13" height="18" rx="5" fill="#FFF6DF" />
            <rect x="204" y="338" width="13" height="18" rx="5" fill="#FFF6DF" />
            <rect x="228" y="338" width="13" height="18" rx="5" fill="#FFF6DF" />
          </g>
          <g>
            <rect x="264" y="306" width="52" height="92" rx="4" fill="#D9B382" />
            <rect x="278" y="322" width="11" height="16" rx="4" fill="#FFF6DF" />
            <rect x="296" y="322" width="11" height="16" rx="4" fill="#FFF6DF" />
            <rect x="278" y="348" width="11" height="16" rx="4" fill="#FFF6DF" />
          </g>
        </g>

        {/* Basílica de la Chinita en 3D */}
        <g className="vm-scene__basilica" filter="url(#vm-soft)">
          {/* Cuerpo central */}
          <path d="M386 372V262l42-18 42 18v110z" fill="url(#vm-tower)" />
          <path d="M470 372V262l-42 18v92z" fill="#E9C1B2" opacity="0.7" />
          <path d="M386 372V262l42-18v128z" fill="#FFF9EC" opacity="0.5" />
          {/* Torres */}
          <g>
            <rect x="362" y="238" width="34" height="134" rx="4" fill="url(#vm-tower)" />
            <rect x="362" y="238" width="11" height="134" fill="#FFFFFF" opacity="0.42" />
            <rect x="386" y="238" width="10" height="134" fill="url(#vm-tower-side)" opacity="0.55" />
            <path d="M362 238l17-22 17 22z" fill="#D98AA7" />
            <rect x="375" y="198" width="8" height="20" fill="#B06A86" />
            <path d="M373 198h12" stroke="#B06A86" strokeWidth="3" strokeLinecap="round" />
            <rect x="370" y="264" width="8" height="16" rx="4" fill="#FFF7E7" />
            <rect x="382" y="264" width="8" height="16" rx="4" fill="#FFF7E7" />
            <rect x="370" y="296" width="8" height="16" rx="4" fill="#FFF7E7" />
          </g>
          <g>
            <rect x="470" y="238" width="34" height="134" rx="4" fill="url(#vm-tower)" />
            <rect x="470" y="238" width="11" height="134" fill="#FFFFFF" opacity="0.42" />
            <rect x="494" y="238" width="10" height="134" fill="url(#vm-tower-side)" opacity="0.55" />
            <path d="M470 238l17-22 17 22z" fill="#D98AA7" />
            <rect x="483" y="198" width="8" height="20" fill="#B06A86" />
            <path d="M481 198h12" stroke="#B06A86" strokeWidth="3" strokeLinecap="round" />
            <rect x="478" y="264" width="8" height="16" rx="4" fill="#FFF7E7" />
            <rect x="490" y="264" width="8" height="16" rx="4" fill="#FFF7E7" />
            <rect x="490" y="296" width="8" height="16" rx="4" fill="#FFF7E7" />
          </g>
          {/* Fachada y cúpula */}
          <path d="M410 372V290h36v82z" fill="#FBE8D2" />
          <path d="M446 372V290l-36 16v66z" fill="#E7BDAA" opacity="0.65" />
          <path d="M410 290h36l-18-16z" fill="#F7D8C2" />
          <path d="M404 278c0-18 12-30 24-30s24 12 24 30z" fill="url(#vm-dome)" />
          <path d="M404 278c0-18 12-30 24-30" fill="none" stroke="#F7C9D7" strokeWidth="3" opacity="0.8" />
          <rect x="424" y="228" width="8" height="22" fill="#B06A86" />
          <path d="M420 230h16M428 222v16" stroke="#B06A86" strokeWidth="3" strokeLinecap="round" />
          <path d="M420 372V310a8 8 0 0 1 16 0v62z" fill="#B06A86" opacity="0.75" />
          <rect x="404" y="294" width="8" height="14" rx="4" fill="#FFF7E7" />
        </g>

        {/* Palmeras */}
        <g className="vm-scene__palm vm-scene__palm--1">
          <path d="M78 456c-6-36-2-68 8-92" fill="none" stroke="#8D5A3B" strokeWidth="8" strokeLinecap="round" />
          <g fill="#2F8C6A">
            <path d="M86 364c-18-12-36-12-48-2 16-2 30 2 42 10z" />
            <path d="M86 364c-8-20-22-30-40-32 12 10 20 22 24 36z" />
            <path d="M86 364c8-20 22-30 40-32-12 10-20 22-24 36z" />
            <path d="M86 364c18-10 36-8 48 2-16-2-30 2-42 10z" />
            <path d="M86 362c-2-18 4-32 16-40-4 14-4 26 2 38z" />
          </g>
          <circle cx="86" cy="364" r="5" fill="#1E6B50" />
        </g>
        <g className="vm-scene__palm vm-scene__palm--2">
          <path d="M312 462c4-30 0-56-8-76" fill="none" stroke="#8D5A3B" strokeWidth="7" strokeLinecap="round" />
          <g fill="#379B74">
            <path d="M304 386c-16-10-32-10-42-2 14-2 26 2 36 8z" />
            <path d="M304 386c-6-18-18-26-34-28 10 8 18 18 20 30z" />
            <path d="M304 386c6-18 18-26 34-28-10 8-18 18-20 30z" />
            <path d="M304 386c16-8 32-6 42 2-14-2-26 2-36 8z" />
          </g>
          <circle cx="304" cy="386" r="4" fill="#1E6B50" />
        </g>

        {/* Malecón delantero */}
        <g className="vm-scene__boardwalk">
          <path d="M0 486h560v34H0z" fill="#C98B5E" opacity="0.55" />
          <path d="M0 486h560" stroke="#FFF4DE" strokeWidth="4" opacity="0.7" />
          <g stroke="#8C5A3D" strokeWidth="3" opacity="0.55">
            <path d="M36 486v34M108 486v34M180 486v34M252 486v34M324 486v34M396 486v34M468 486v34M540 486v34" />
          </g>
          <g stroke="#8C5A3D" strokeWidth="4" strokeLinecap="round" opacity="0.65">
            <path d="M20 486V456M160 486V456M300 486V456M440 486V456M520 486V456" />
          </g>
        </g>

        {/* Chispas */}
        <g className="vm-scene__sparkles" fill="#FFF8D9">
          <circle cx="178" cy="228" r="3" />
          <circle cx="222" cy="192" r="2" />
          <circle cx="352" cy="168" r="2.6" />
          <circle cx="530" cy="318" r="2.2" />
          <circle cx="72" cy="332" r="2" />
        </g>
      </svg>

      <span className="vm-scene__tag vm-scene__tag--bridge">
        <IconBridge width={14} height={14} />
        Puente sobre el Lago
      </span>
      <span className="vm-scene__tag vm-scene__tag--basilica">
        <IconMapPin width={14} height={14} />
        Basílica de la Chinita
      </span>
      <span className="vm-scene__tag vm-scene__tag--sun">
        <IconRotate width={14} height={14} />
        Maracaibo en 3D
      </span>
    </div>
  );
}
