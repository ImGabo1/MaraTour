# backend — API REST (Node + Express + TypeScript)

```
backend/src/
├── server.ts          # arranque: elige Postgres o modo memoria según DATABASE_URL
├── app.ts             # rutas, validación (zod), CORS, helmet, caché
├── config.ts          # variables de entorno
├── types.ts           # contrato de la API (Place)
├── auth/password.ts   # hash scrypt y verificación de contraseñas
└── repo/              # acceso a datos (interfaces + Postgres + memoria, lugares y usuarios)
backend/tests/         # vitest + supertest
```

## Desarrollo

```bash
npm install                 # desde la raíz del repo
npm run dev:back            # http://localhost:3001  (sin DATABASE_URL usa database/seed)
npm test -w backend
```

## Endpoints

| Método | Ruta                      | Descripción                                       |
| ------ | ------------------------- | ------------------------------------------------- |
| GET    | `/api/health`             | Estado y fuentes de datos (lugares y cuentas)     |
| POST   | `/api/auth/register`      | Crea una cuenta en `users`                        |
| POST   | `/api/auth/login`         | Verifica correo/contraseña y registra el acceso   |
| GET    | `/api/places`             | Lista; filtros opcionales `?category=` y `?q=`     |
| GET    | `/api/places/:slug`       | Detalle de un lugar                               |

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
