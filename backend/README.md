# backend — API REST (Node + Express + TypeScript)

```
backend/src/
├── server.ts          # arranque: elige Postgres o modo memoria según DATABASE_URL
├── app.ts             # rutas, validación (zod), CORS, helmet, caché
├── config.ts          # variables de entorno
├── types.ts           # contrato de la API (Place)
└── repo/              # acceso a datos (interfaz + Postgres + memoria)
backend/tests/         # vitest + supertest
```

## Desarrollo

```bash
npm install                 # desde la raíz del repo
npm run dev:back            # http://localhost:3001  (sin DATABASE_URL usa database/seed)
npm test -w backend
```

## Endpoints

| Método | Ruta                      | Descripción                          |
| ------ | ------------------------- | ------------------------------------ |
| GET    | `/api/health`             | Estado y fuente de datos             |
| GET    | `/api/places`             | Lista; filtro opcional `?category=`  |
| GET    | `/api/places/:slug`       | Detalle de un lugar                  |

Formato de respuesta y campos: ver `docs/API.md`.

## Despliegue (resumen)

- Render / Railway / Fly.io con el `Dockerfile` (contexto = raíz del repo) o con `npm ci && npm run build -w backend` + `npm start -w backend`.
- Variables: `DATABASE_URL`, `DATABASE_SSL=true` si el proveedor lo exige, `CORS_ORIGINS=https://tu-front`, `PORT` (lo pone la plataforma).
- Comprobar `/api/health`: debe responder `"source": "postgres"`.

## Pendientes sugeridos

- [ ] Limitar peticiones (`express-rate-limit`) antes de publicar.
- [ ] Endpoints de administración protegidos (crear/editar lugares) o carga solo por seed.
- [ ] Logs estructurados y monitoreo del `/api/health`.
- [ ] Tests contra Postgres real en CI (servicio `postgres` en GitHub Actions).
