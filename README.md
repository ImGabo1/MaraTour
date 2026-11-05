# Visita Maracaibo — PWA de turismo del municipio Maracaibo

Aplicación web progresiva (PWA) para impulsar el turismo **solo en el municipio Maracaibo**: mapa con lugares, fichas con historia, vistas 360° y modo sin conexión. Todo en **TypeScript**.

> Estado: **demo funcional**. Portada, acceso con cuentas en la API, catálogo de 43 lugares, planificador, diccionario, mapa, fichas y 360°. Las coordenadas siguen sin verificar en campo.

```
turismo-maracaibo-pwa/
├── frontend/   React + Vite + vite-plugin-pwa   (la app que ve el usuario)
├── backend/    Node + Express + zod + pg        (API REST /api/places)
├── database/   PostgreSQL: migraciones y datos  (también fuente del contenido)
└── docs/       Plan de 7 días, API, pruebas en dispositivos, despliegue
```

## Arranque rápido (5 minutos)

Requisitos: Node 20+ (Docker solo si quieres Postgres local).

```bash
npm install                # instala las 3 carpetas (npm workspaces)
cp .env.example .env

# Terminal 1 — API (sin DATABASE_URL usa database/seed: no necesitas base de datos para empezar)
npm run dev:back           # http://localhost:3001/api/health

# Terminal 2 — app
npm run dev:front          # http://localhost:5173
```

Con base de datos real:

```bash
npm run db:up && npm run db:migrate && npm run db:seed   # Postgres en Docker
npm run db:check                                        # confirma tablas y conteos
# luego reinicia el backend: /api/health debe decir "source": "postgres"
```

Otros comandos: `npm run typecheck`, `npm test`, `npm run build` (los corre también la CI de GitHub en cada PR).

## Qué ya hace

| Idea del equipo | Cómo está resuelta |
| --- | --- |
| Mapa como imagen que lleva a Google Maps, sin pagar API | `frontend/src/components/MapView.tsx`: mapa SVG ilustrativo con puntos tocables; botones «Cómo llegar» abren `google.com/maps/search/?api=1&query=lat,lng` (gratis, sin clave). Se puede cambiar por una captura real (`config.ts` → `MAP_IMAGE`). |
| Fotos 2D con enfoque + historia + enlace a Maps | `PlaceSheet.tsx`: ficha que se abre con efecto de enfoque sobre la foto. Si no hay foto, genera una portada por categoría. |
| Vista 360° para quien tenga o no visor | `PanoViewer.tsx`: arrastrar con el dedo, flechas del teclado o **mover el teléfono** (giroscopio). Sin librerías. |
| ¿Funciona en Apple? | Sí, con el permiso de movimiento de iOS (botón explícito) y HTTPS. Si se niega, queda el arrastre. Falta probarlo en iPhone real (ver `docs/PRUEBAS_DISPOSITIVOS.md`). |
| Casi sin internet | Service worker: guarda la app y la API; si el servidor falla, usa `public/data/places.json`. Las imágenes se guardan al verlas. |
| Responsiva, animada, retrocompatible | CSS con `clamp`, grid y safe-areas; animaciones que respetan «reducir movimiento»; build para ES2018 / Safari 12. |
| Instalable | Botón «Instalar app» (Chrome/Android/escritorio) y guía de «Agregar a inicio» en iPhone. |
| Buscar sin pelear con los acentos | `frontend/src/lib/search.ts` filtra el catálogo ya descargado; la API replica la búsqueda con un índice de texto en PostgreSQL (`GET /api/places?q=`). |
| Varias fotos y panoramas por lugar | Tabla `place_media` (`database/migrations/002_media_search.sql`) y galería en la ficha; el seed acepta un arreglo `media`. |
| Unity / Meta Quest | **No implementado** (ver «4ª persona» y `docs/PLAN_7_DIAS.md`). |

## Cómo nos repartimos (4 personas)

| Persona | Carpeta | Responsabilidad |
| --- | --- | --- |
| **1 — Front-end** | `frontend/` | UI, animaciones, accesibilidad, visor 360°, mapa real. |
| **2 — Back-end + despliegue + verificación** (Gabriel) | `backend/`, `docs/DESPLIEGUE.md` | API, seguridad, publicar los 3 servicios, probar en todas las plataformas. |
| **3 — Base de datos** | `database/` | Esquema, migraciones, datos, copias de seguridad, rendimiento. |
| **4 — Contenido, 360° y experiencia** | `database/seed/`, `frontend/public/` | Lo que hace que la app valga la pena (abajo). |

### ¿Qué hace la 4ª persona?

Hay trabajo que no es código y es lo que más pesa en un proyecto de turismo; además descarga al resto:

1. **Contenido verificado**: escribir la historia real de cada lugar con fuentes, corregir direcciones y confirmar cada coordenada en Google Maps (luego pone `"coordsVerified": true` en `database/seed/places.json`). Reemplaza los `[BORRADOR]`.
2. **Fotografía y 360°**: fotos 2D de cada sitio y panorámicas 360° (relación 2:1) hechas con el teléfono (modo panorámica esférica, p. ej. Google Street View o apps de fotos 360°). Las optimiza a pocos cientos de KB y las coloca en `frontend/public/` (`img/`, `panos/`), apuntando `imageUrl`/`panoUrl` en el JSON.
3. **Mapa real**: captura del mapa del municipio y anotar las coordenadas de sus bordes para `MAP_IMAGE` en `frontend/src/config.ts`.
4. **Investigación VR (spike de 1–2 días)**: probar si basta **WebXR / A-Frame / Photo Sphere Viewer** dentro de la PWA para mostrar el 360° en un visor Meta Quest (el navegador del Quest abre la PWA), antes de pensar en **Unity**, que sería una app aparte y no una PWA. Entregar una recomendación de una página.
5. **Diseño y QA de usabilidad**: pruebas con 3–5 personas reales (¿entienden el mapa? ¿encuentran «Cómo llegar»?), textos de la interfaz, nombre y logo definitivos.
6. **Soporte a Gabriel en la matriz de dispositivos** (`docs/PRUEBAS_DISPOSITIVOS.md`): cada quien prueba con los teléfonos que tenga.

## Flujo de trabajo en GitHub

- Ramas: `main` (estable, es lo que se despliega) y una rama por tarea: `front/visor-360`, `back/rate-limit`, `db/media`, `contenido/lugares`.
- Cambios por **Pull Request** con revisión de otra persona; la CI debe estar en verde.
- Commits cortos y en español: `front: añade filtro por categoría`.
- **Contrato entre carpetas**: si cambias la forma de un `Place`, actualiza `backend/src/types.ts`, `frontend/src/types.ts` y `docs/API.md` en el mismo PR, y avisa al equipo.
- Nunca subas `.env` ni claves.

## Documentación

- [`docs/PLAN_7_DIAS.md`](docs/PLAN_7_DIAS.md) — plan día por día y criterios de «terminado».
- [`docs/API.md`](docs/API.md) — contrato de la API.
- [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) — cómo publicar front, API y base de datos (Neon + Render + Vercel).
- [`docs/PRUEBAS_DISPOSITIVOS.md`](docs/PRUEBAS_DISPOSITIVOS.md) — matriz de pruebas multiplataforma.
- [`docs/MEDIOS.md`](docs/MEDIOS.md) — cómo cargar fotos, videos y panoramas 360° propios.
- READMEs de cada carpeta con sus pendientes sugeridos.

## Limitaciones conocidas de esta versión

- Coordenadas, direcciones e historia son **borradores sin verificar** (por eso `coordsVerified: false`).
- El visor 360° es una aproximación cilíndrica: no hay mirada arriba/abajo completa, zoom ni modo visor VR.
- El mapa es ilustrativo; el este está dibujado como el lago pero no es a escala.
- Solo lectura: no hay panel para editar lugares (se editan en `database/seed/places.json`).
- Las cuentas se registran en PostgreSQL/Neon a través de la API (`users`); la sesión y el modo invitado se guardan en el navegador. Falta límite de peticiones y verificación de correo antes de publicar.
