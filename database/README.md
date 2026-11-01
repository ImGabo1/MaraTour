# database — PostgreSQL

Esquema, migraciones y datos semilla del proyecto.

```
database/
├── migrations/001_init.sql          # tablas categories y places
├── migrations/002_media_search.sql  # place_media, updated_at y búsqueda (tsvector + GIN)
├── seed/categories.json             # FUENTE DE VERDAD de las categorías
├── seed/places.json                 # FUENTE DE VERDAD de los lugares (contenido)
└── scripts/                         # migrate.ts, seed.ts y check.ts (TypeScript)
```

## Uso

```bash
cp .env.example .env          # desde la raíz del repo
npm run db:up                 # levanta Postgres con Docker
npm run db:migrate            # aplica migraciones pendientes
npm run db:seed               # carga/actualiza categorías y lugares (idempotente)
npm run db:check              # diagnóstico: versión, migraciones aplicadas y conteos
```

Sin Docker puedes usar cualquier Postgres gratuito (Neon, Supabase, Render) y poner su `DATABASE_URL`
en `.env` (con `DATABASE_SSL=true`). La guía paso a paso está en `docs/DESPLIEGUE.md`.

## Esquema

| Tabla | Para qué |
| --- | --- |
| `categories` | Slugs y orden de las categorías (`historia`, `cultura`, `religioso`, `naturaleza`). |
| `places` | Un lugar por fila. `search_vector` se calcula solo (columna generada) e indexa en GIN. |
| `place_media` | Varias fotos (`photo`) y panoramas (`pano`) por lugar, con pie y crédito. |
| `schema_migrations` | Registro de migraciones aplicadas (lo crea `migrate.ts`). |

Búsqueda desde la API:

```bash
curl "http://localhost:3001/api/places?q=basilica"          # ignora acentos
curl "http://localhost:3001/api/places?q=teatro&category=cultura"
```

## Reglas del equipo

- **Nunca edites una migración ya aplicada**: crea `003_...sql`, `004_...sql`.
- `seed/places.json` también alimenta al backend cuando corre **sin base de datos** (modo memoria) y al respaldo sin conexión del frontend (`npm run sync-data -w frontend` lo copia). Editar este archivo cambia los tres.
- Cada lugar nuevo empieza con `"coordsVerified": false` hasta que alguien confirme el punto en Google Maps.
- El proyecto cubre **solo el municipio Maracaibo**: el esquema tiene una restricción de coordenadas aproximada (mejora pendiente: PostGIS con el polígono real).
- El seed es idempotente: hace upsert por `slug` y reemplaza la galería de `place_media` de cada lugar.

## Pendientes sugeridos para quien lleve esta área

- [x] Tabla `place_media` (varias fotos 2D y panoramas por lugar) en `002_media_search.sql`.
- [x] Índice de búsqueda de texto (`tsvector` en español) para el buscador.
- [x] `updated_at` automático con trigger.
- [x] Diagnóstico de conexión (`npm run db:check`).
- [ ] Verificar y corregir coordenadas de los 6 lugares de ejemplo.
- [ ] Búsqueda sin acentos en PostgreSQL (extensión `unaccent`; hoy el front sí los ignora).
- [ ] Copias de seguridad automáticas programadas (`pg_dump` + cron) y prueba de restauración.
- [ ] Revisar el plan de ejecución cuando el catálogo crezca (`EXPLAIN ANALYZE`).
