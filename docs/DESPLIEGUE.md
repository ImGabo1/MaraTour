# Despliegue

Una PWA **necesita HTTPS** para instalarse, usar service worker y (en iPhone) pedir el permiso de movimiento del 360°. Todos los proveedores de abajo lo dan gratis.

## Orden recomendado

1. **Base de datos** → 2. **Backend** → 3. **Frontend** (el front necesita la URL del backend).

### 1. Base de datos (PostgreSQL gratuito)

Opciones: Neon, Supabase o Render Postgres. Copia su `DATABASE_URL` y, desde tu computadora:

```bash
DATABASE_URL="postgres://..." DATABASE_SSL=true npm run db:migrate
DATABASE_URL="postgres://..." DATABASE_SSL=true npm run db:seed
```

### 2. Backend (Render, Railway o Fly.io)

- **Con Docker**: `backend/Dockerfile`, contexto = raíz del repo.
- **Sin Docker**: Build `npm ci && npm run build -w backend` · Start `npm start -w backend`.
- Variables: `DATABASE_URL`, `DATABASE_SSL=true` (si el proveedor lo pide), `CORS_ORIGINS=https://<tu-front>`. El puerto lo asigna la plataforma (`PORT`).
- Verifica: `https://<api>/api/health` → `"source": "postgres"`.

Nota: algunos planes gratuitos «duermen» el servidor y la primera petición tarda. La PWA lo tolera porque muestra los datos guardados mientras tanto.

### 3. Frontend (Vercel, Netlify o Cloudflare Pages)

- Directorio raíz: `frontend` (o la raíz del repo con los comandos de abajo).
- Build: `npm ci && npm run build -w frontend` · Salida: `frontend/dist`.
- Variable de entorno de **build**: `VITE_API_URL=https://<api>` (sin barra final).
- Para que el respaldo sin conexión se actualice con la base de datos, el build debe ver la carpeta `database/` (despliega desde la raíz del repo).

## Después de desplegar

- Abre la URL en Chrome → DevTools → Application → *Manifest* y *Service Workers* sin errores.
- Corre Lighthouse (categoría PWA) en móvil.
- Ejecuta `docs/PRUEBAS_DISPOSITIVOS.md`.
- Al publicar una versión nueva, la PWA se actualiza sola (`registerType: autoUpdate`); el usuario la ve al reabrirla.
