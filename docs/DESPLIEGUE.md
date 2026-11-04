# Despliegue

La app son **tres piezas** que se publican por separado y en este orden:

| # | Pieza | Dónde | Plan gratis | Qué obtienes |
| - | ----- | ----- | ----------- | ------------ |
| 1 | PostgreSQL | **Neon** | Sí, permanente, sin tarjeta | `DATABASE_URL` |
| 2 | API (Express) | **Render** (Docker) | Sí, 512 MB, se duerme a los 15 min | `https://algo.onrender.com` |
| 3 | PWA (React) | **Vercel** o **Netlify** | Sí | `https://algo.vercel.app` |

> Todo lo gratuito alcanza de sobra para este proyecto: son 6 lugares y lecturas pequeñas.

## ¿Por qué Neon y no la base de datos de Render?

| | Neon | Render Postgres | Supabase |
| --- | --- | --- | --- |
| Plan gratis | Permanente, **sin tarjeta** | **Caduca a los 30 días** y luego se borra | Permanente, pausa el proyecto tras ~1 semana sin uso |
| Arranque en frío | Suspende a los 5 min; despierta en <1 s | — | El proyecto entero se pausa |
| Copias / historial | 6 h de historial en el plan gratis | Sin backups en el plan gratis | Backups diarios |
| Ideal si… | solo necesitas Postgres | quieres todo en un panel | necesitas login, storage y APIs automáticas |

Para MaraTour **Neon es la mejor opción**: es Postgres normal (el mismo driver `pg` que ya usa el
código), no caduca y no pide tarjeta. Supabase también sirve, pero aquí no hace falta su capa extra
(autenticación, storage) y su pausa por inactividad es más molesta para una demo.

---

## Paso 0 · Subir el código a GitHub

Render y Vercel se conectan a un repositorio. El repo puede ser **privado**.

```bash
git add .
git commit -m "db: medios, búsqueda y despliegue"
git push
```

Nunca subas el archivo `.env` (ya está en `.gitignore`). Las claves van en el panel de cada servicio.

---

## Paso 1 · Crear la base de datos en Neon

1. Entra a <https://neon.com> → **Sign up** (puedes usar tu cuenta de GitHub, sin tarjeta).
2. **Create project**. Nombre: `maratour`. Región: la más cercana, por ejemplo **AWS us-east-1**
   (Virginia) o `us-east-2` (Ohio). Postgres 16 o superior.
3. En el panel del proyecto abre **Connect** y copia la **Pooled connection**. Se ve así:

   ```
   postgresql://neondb_owner:AbC123...@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

   > Usa la que dice **Pooled** (`-pooler` en el host). Así el backend no agota las conexiones
   > cuando Render reinicia el servicio.

4. Guarda esa URL. Es la única credencial de la base de datos.

## Paso 2 · Crear las tablas y cargar los datos (desde tu PC)

Las migraciones se corren **desde tu máquina** apuntando a Neon (`database/` no se despliega):

```bash
# Linux / macOS
export DATABASE_URL="postgresql://...-pooler...neon.tech/neondb?sslmode=require"
export DATABASE_SSL=true

npm install
npm run db:migrate   # crea categories, places, place_media, búsqueda, triggers
npm run db:seed      # carga las 4 categorías y los 6 lugares
npm run db:check     # imprime la versión, las tablas y los conteos
```

En **Windows PowerShell**:

```powershell
$env:DATABASE_URL="postgresql://...-pooler...neon.tech/neondb?sslmode=require"
$env:DATABASE_SSL="true"
npm run db:migrate
npm run db:seed
npm run db:check
```

`db:check` debe terminar con `✔ Todo listo: el backend puede usar esta base de datos.`

> También puedes pegar la URL en tu `.env` local y correr solo `npm run db:migrate`, `db:seed`
> y `db:check`. Ese `.env` no se sube al repo.
>
> Si usaste `neon init`, la URL ya está en `.env.local` y estos comandos la leen sin configurar nada.

## Paso 3 · Publicar la API en Render

1. <https://dashboard.render.com> → **New** → **Blueprint** (o **Web Service** si prefieres a mano).
2. Conecta el repositorio. Si usas **Blueprint**, Render lee `render.yaml` y crea `maratour-api`
   con Docker, plan Free y el health check ya configurados.
3. Si lo haces **a mano**, estos son los valores:

   | Campo | Valor |
   | --- | --- |
   | Runtime | Docker |
   | Dockerfile | `backend/Dockerfile` |
   | Contexto (Docker) | `.` (la raíz del repo) |
   | Health check | `/api/health` |
   | Plan | Free |

4. En **Environment** agrega:

   | Variable | Valor |
   | --- | --- |
   | `DATABASE_URL` | la URL *Pooled* de Neon |
   | `DATABASE_SSL` | `true` |
   | `CORS_ORIGINS` | la URL de Vercel **sin barra final** (puedes ponerla después de crearla) |

   `PORT` lo inyecta Render solo; el código ya lee `process.env.PORT`.

5. Deploy. Cuando termine, abre:

   ```
   https://maratour-api.onrender.com/api/health
   ```

   Debe responder:

   ```json
   { "status": "ok", "source": "postgres", "time": "..." }
   ```

   - `"source": "postgres"` → está usando Neon.
   - `"source": "memory"` → **falta `DATABASE_URL`** en Render; el backend está usando el JSON local.
   - `503` / `"degraded"` → la URL o el SSL están mal (revisa el log del servicio).

6. Prueba la búsqueda y los medios:

   ```
   https://maratour-api.onrender.com/api/places?q=teatro&category=cultura
   ```

## Paso 4 · Publicar la PWA en Vercel

1. <https://vercel.com/new> → importa el repo.
2. Configuración del proyecto (Vercel normalmente toma `vercel.json`, que ya está en la raíz):

   | Campo | Valor |
   | --- | --- |
   | Framework | Vite |
   | Install Command | `npm ci` |
   | Build Command | `npm run build -w frontend` |
   | Output Directory | `frontend/dist` |

3. En **Environment Variables** agrega, **antes de compilar**:

   | Variable | Valor |
   | --- | --- |
   | `VITE_API_URL` | `https://maratour-api.onrender.com` (sin barra final) |

   > `VITE_*` se incrusta en el JavaScript al compilar. Si cambias la URL del backend, haz
   > **Redeploy**, no basta con guardar la variable.

4. Deploy. Abre la URL y comprueba en DevTools → **Network** que las peticiones van a
   `https://maratour-api.onrender.com/api/places` y responden `200`.

   **Netlify** es equivalente: importa el repo y usa `netlify.toml` (ya incluido). Allí la variable
   también se llama `VITE_API_URL`.

## Paso 5 · Cerrar CORS (obligatorio antes de entregar)

El backend solo acepta peticiones del front que le indiques:

1. Copia la URL final de Vercel (por ejemplo `https://maratour.vercel.app`).
2. En Render → `maratour-api` → **Environment** → edita `CORS_ORIGINS` con esa URL **sin `/` final**.
   Para varios orígenes, sepáralos con coma.
3. **Manual Deploy → Deploy latest commit** (o guarda; Render redespliega solo).

Si no lo haces, la API responde pero el navegador bloquea la respuesta y la PWA cae al respaldo
sin conexión (verás el aviso "sin conexión" con datos viejos).

---

## Checklist final

- [ ] `GET /api/health` → `"source": "postgres"` y `200`.
- [ ] `GET /api/places` devuelve 6 lugares.
- [ ] `GET /api/places?q=chiquinquira` devuelve la basílica.
- [ ] La PWA carga lugares desde la API (Network → 200, no respaldo).
- [ ] Se puede abrir una ficha, ver la galería y el botón de 360°.
- [ ] Chrome → Application → Manifest y Service Worker sin errores.
- [ ] `CORS_ORIGINS` tiene la URL real del front.
- [ ] El repo no contiene `.env` ni claves.

## Límites de los planes gratuitos (verificados en noviembre de 2026)

| Servicio | Incluye | Ojo con |
| --- | --- | --- |
| **Neon Free** | 1 GB de datos, 100 horas de cómputo al mes, 5 GB de tráfico, 100 proyectos | Se suspende a los 5 min sin uso y despierta en menos de 1 s |
| **Render Free** | 512 MB RAM, 750 horas de instancia al mes, HTTPS y dominio propio | Se duerme a los 15 min; la primera petición tarda ~1 min |
| **Vercel Hobby** | Sitios estáticos, 100 despliegues al día, HTTPS | Solo uso personal / no comercial |

La PWA ya tolera el arranque en frío de Render: el service worker muestra los datos guardados y
refresca en segundo plano.

## Actualizar los lugares en producción

El contenido vive en `database/seed/places.json` (es la fuente de verdad). Para publicar cambios:

```bash
# 1. editar database/seed/places.json
npm run db:seed        # con DATABASE_URL apuntando a Neon
npm run build -w frontend  # regenera el respaldo sin conexión (public/data/places.json)
# 2. commit + push → Vercel y Render redespliegan solos
```

Si agregas una migración nueva (`003_...sql`), corre `npm run db:migrate` contra Neon antes del
deploy. **Nunca edites una migración ya aplicada**: crea la siguiente.

## Copias de seguridad

Neon guarda 6 horas de historial en el plan gratis (permite volver atrás desde el panel). Para una
copia propia:

```bash
pg_dump "$DATABASE_URL" --no-owner --no-acl -f respaldo-$(date +%F).sql
```

Restaurar:

```bash
psql "$DATABASE_URL" -f respaldo-2026-11-01.sql
```

(`pg_dump`/`psql` vienen con PostgreSQL; si no los tienes, usa el contenedor de `docker-compose.yml`.)

## Problemas comunes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `source: "memory"` en `/api/health` | Render no tiene `DATABASE_URL` | Agrégala en Environment y redespliega |
| `503 degraded` | URL mal copiada, SSL apagado o base suspendida | Revisa `DATABASE_SSL=true` y los logs |
| `self-signed certificate in certificate chain` | SSL no configurado | `DATABASE_SSL=true` |
| `password authentication failed` | Copiaste la URL sin la contraseña o con caracteres sin codificar | Vuelve a copiar la *Pooled connection* |
| `too many connections` | Usaste la conexión directa, no la *pooled* | Usa el host con `-pooler` |
| El front muestra "sin conexión" con datos viejos | CORS | Pon la URL de Vercel en `CORS_ORIGINS` y redespliega |
| `CORS` con `www` o barra final | El origen debe coincidir exacto | `https://tu-app.vercel.app`, sin `/` |
| La primera carga tarda ~1 min | Render Free está dormido | Es normal; la PWA muestra lo guardado |
| El build de Vercel falla en `sync-data` | El proyecto no se desplegó desde la raíz del repo | Usa la raíz del repo (no la carpeta `frontend`) |
| Cambié `VITE_API_URL` y no se aplica | Es una variable de compilación | **Redeploy** |
