# frontend — PWA (React + Vite + TypeScript)

```
frontend/
├── index.html
├── vite.config.ts            # PWA: manifest, service worker, caché, proxy /api en desarrollo
├── scripts/
│   ├── sync-data.mjs         # database/seed -> public/data/places.json y media-manifest.json
│   └── generate-icons.py     # regenera los PNG de public/icons desde el logo
├── public/
│   ├── media/sitios/<slug>/  # portada.jpg, foto-NN.jpg, 360.jpg, video.mp4 de cada lugar
│   ├── data/places.json      # respaldo sin conexión del catálogo
│   └── img/                  # logos y mapa local de respaldo
└── src/
    ├── App.tsx               # rutas por hash (#/, #/explorar, #/plan, #/mi-ruta, #/diccionario, #/entrar…)
    ├── api.ts, config.ts     # llamada a la API con respaldo; proveedores de teselas del mapa
    ├── pages/                # Home, Explorar, Planificador, Mi ruta, Diccionario, Acceso y landing
    ├── components/           # Header, MapView, PlaceCard, PlaceSheet, PanoViewer, SkyMotifs, ChatWidget…
    ├── hooks/, lib/          # datos, conexión, instalación, búsqueda, enlaces a Google Maps
    ├── i18n/                 # textos base (messages.ts) y por idioma (extra/langs/*.json)
    ├── data/                 # media.ts, media-manifest.json, textos de lugares por idioma
    └── styles/               # tokens --mt-*, vidrio, botones, tipografía y animaciones
```

## Desarrollo

```bash
npm run dev:front        # http://localhost:5173  (/api se redirige al backend en :3001)
npm test -w frontend     # 7 pruebas
npm run build -w frontend && npm run preview -w frontend   # probar PWA/offline (el SW solo existe en build)
```

## Diseño

Glassmorphism con la paleta de Maracaibo (cielo, sol y rojo) como variables `--mt-*` en `src/styles/tokens.css`. Prefijos de clase: `mt-*` compartidas, `mth-*` Inicio, `mte-*` Explorar, `mts-*` ficha, `mtp-*` visor 360°, `mta-*` acceso, `mtw-*` landing. El modo oscuro usa `html[data-theme="dark"]`; sol y luna con el relámpago del Catatumbo están en `components/SkyMotifs.tsx`.

## Agregar fotos sin tocar código

1. Crea `public/media/sitios/<slug>/` con `portada.jpg` (vertical 3:4, 1200 × 1600 px), `foto-01.jpg`… y, si hay, `360.jpg` (2:1) o `video.mp4`.
2. Ejecuta `npm run sync-data -w frontend` (también corre solo en `dev` y `build`) para actualizar `src/data/media-manifest.json`.
3. Si la foto es de Wikimedia, agrega su `credit` y `source` en `PLACE_MEDIA` (`src/data/media.ts`); las fotos propias no llevan crédito.

## Idiomas

Español e inglés tienen paridad tipada en `src/i18n/extra/*.ts`. Los otros ocho idiomas viven en `src/i18n/extra/langs/<idioma>.json` y las historias de los lugares en `src/data/i18n/places.<idioma>.json` (se cargan solo al elegir ese idioma).

## Pendientes sugeridos

- [ ] Fotos propias para los 9 lugares que usan imagen de categoría.
- [ ] Traducir direcciones, salida del planificador y que el chat entienda texto libre en otros idiomas.
- [ ] Visor 360°: zoom y modo VR (WebXR).
- [ ] Atrapar el foco con Tab dentro de los diálogos (`hooks/useModal.ts`).
- [ ] Reducir el precaché de la PWA (~76 MB).
- [ ] Pruebas de componentes (Testing Library) y Lighthouse en CI.
