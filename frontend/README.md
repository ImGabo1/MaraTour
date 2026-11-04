# frontend — PWA (React + Vite + TypeScript)

```
frontend/
├── index.html
├── vite.config.ts            # PWA: manifest, service worker, caché, proxy /api en desarrollo
├── scripts/
│   ├── sync-data.mjs         # database/seed -> public/data/places.json (respaldo sin conexión)
│   └── generate-icons.py     # regenera los PNG de public/icons desde el logo
├── public/                   # icons/, panos/ (360°), data/places.json; aquí van img/ y más panos
└── src/
    ├── App.tsx               # estructura de la página
    ├── api.ts, config.ts     # llamada a la API con respaldo; ajustes (MAP_IMAGE, URL de la API)
    ├── hooks/                # datos, estado de conexión, instalación, ruta por hash, modales
    ├── lib/                  # enlaces a Google Maps, proyección lat/lng -> mapa, estilos de categoría, búsqueda
    ├── components/           # MapView, PlaceCard, PlaceSheet, PanoViewer, Header, ...
    └── styles.css            # tokens, responsive, animaciones
```

## Desarrollo

```bash
npm run dev:front        # http://localhost:5173  (/api se redirige al backend en :3001)
npm test -w frontend
npm run build -w frontend && npm run preview -w frontend   # probar PWA/offline (el SW solo existe en build)
```

## Cómo agregar contenido sin tocar código

1. Fotos en `frontend/public/img/<slug>.jpg` y panorámicas en `frontend/public/panos/<slug>.jpg` (2:1, idealmente < 1 MB).
2. En `database/seed/places.json`: `"imageUrl": "/img/<slug>.jpg"`, `"panoUrl": "/panos/<slug>.jpg"`.
3. `npm run db:seed` (si usan Postgres) y recargar.

Para una galería con varias fotos, agrega `media` al lugar en `database/seed/places.json`:

```json
"media": [
  { "kind": "photo", "url": "/img/teatro-baralt-1.jpg", "caption": "Fachada", "credit": "Foto: equipo" },
  { "kind": "photo", "url": "/img/teatro-baralt-2.jpg" },
  { "kind": "pano",  "url": "/panos/teatro-baralt.jpg" }
]
```

`imageUrl`/`panoUrl` siguen siendo la imagen principal; `npm run sync-data` copia todo al respaldo
sin conexión.

## Búsqueda

El buscador filtra el catálogo ya descargado (`lib/search.ts`), así funciona también sin conexión.
La API ofrece la misma búsqueda en `GET /api/places?q=` (con índice de texto en PostgreSQL) para
cuando el catálogo crezca o lo consuma otro cliente.

## Pendientes sugeridos para quien lleve esta área

- [ ] Reemplazar el mapa ilustrativo por la captura real (`config.ts` → `MAP_IMAGE`).
- [ ] Visor 360°: pasar a esfera real (Photo Sphere Viewer / three.js), zoom y modo visor VR (WebXR).
- [ ] Atrapar el foco con Tab dentro de los diálogos (`hooks/useModal.ts`).
- [ ] Tipografía propia empaquetada (hoy usa la del sistema para funcionar sin conexión).
- [x] Buscador (local y en la API). Favoritos guardados en el dispositivo: pendiente.
- [ ] Aviso cuando hay una versión nueva (hoy se actualiza sola al reabrir).
- [ ] Pruebas de componentes (Testing Library) y Lighthouse en CI.
