# database — PostgreSQL

Esquema, migraciones y datos semilla del proyecto.

```
database/
├── migrations/001_init.sql   # tablas categories y places
├── seed/categories.json      # FUENTE DE VERDAD de las categorías
├── seed/places.json          # FUENTE DE VERDAD de los lugares (contenido)
└── scripts/                  # migrate.ts y seed.ts (TypeScript)
```

## Uso

```bash
cp .env.example .env          # desde la raíz del repo
npm run db:up                 # levanta Postgres con Docker
npm run db:migrate            # aplica migraciones pendientes
npm run db:seed               # carga/actualiza categorías y lugares (idempotente)
```

Sin Docker puedes usar cualquier Postgres gratuito (Neon, Supabase, Render) y poner su `DATABASE_URL` en `.env`.

## Reglas del equipo

- **Nunca edites una migración ya aplicada**: crea `002_...sql`, `003_...sql`.
- `seed/places.json` también alimenta al backend cuando corre **sin base de datos** (modo memoria) y al respaldo sin conexión del frontend (`npm run sync-data -w frontend` lo copia). Editar este archivo cambia los tres.
- Cada lugar nuevo empieza con `"coordsVerified": false` hasta que alguien confirme el punto en Google Maps.
- El proyecto cubre **solo el municipio Maracaibo**: el esquema tiene una restricción de coordenadas aproximada (mejora pendiente: PostGIS con el polígono real).

## Pendientes sugeridos para quien lleve esta área

- [ ] Verificar y corregir coordenadas de los 6 lugares de ejemplo.
- [ ] Tabla `place_media` (varias fotos 2D y panoramas por lugar) en `002_media.sql`.
- [ ] Índice de búsqueda de texto (`tsvector`) para un buscador.
- [ ] Copias de seguridad / plan de restauración en producción.
