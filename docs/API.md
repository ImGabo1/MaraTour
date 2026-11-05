# Contrato de la API

Base: `http://localhost:3001` (desarrollo) · en producción, la URL del backend (`VITE_API_URL` en el front).
Todas las respuestas son JSON. Lectura de lugares y autenticación de cuentas.

## Tipo `Place`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `slug` | string | Identificador único y legible (`teatro-baralt`). Se usa en la URL del front: `#/lugar/<slug>`. |
| `name` | string | |
| `category` | string | Slug de categoría: `plazas`, `historia`, `cultura`, `fe`, `museos`, `naturaleza`, `lago`, `gastronomia`, `compras`, `salud`, `educacion`, `deportes`, `noche`, `transporte`, `arquitectura`. |
| `categoryName` | string | Nombre para mostrar. |
| `shortDescription` | string | Una o dos frases (tarjeta y mapa). |
| `history` | string | Texto de la ficha. |
| `address` | string | |
| `latitude` / `longitude` | number | Dentro de la caja aproximada de Maracaibo. |
| `coordsVerified` | boolean | `false` hasta confirmar el punto en Google Maps. |
| `imageUrl` | string \| null | Foto 2D. `null` → el front genera una portada. |
| `panoUrl` | string \| null | Panorámica 360° (2:1). `null` → sin vista 360°. |
| `tags` | string[] | |
| `media` | `PlaceMedia[]` | Galería (tabla `place_media`). Siempre incluye `imageUrl`/`panoUrl` si no están ya en la galería. |
| `sector` | `"publico"` \| `"privado"` \| ausente | Solo hospitales, clínicas y servicios de salud. |

### Tipo `PlaceMedia`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `kind` | `"photo"` \| `"pano"` | Foto 2D o panorama 360°. |
| `url` | string | Ruta relativa (`/panos/...`) o URL absoluta (CDN). |
| `caption` | string \| null | Pie de foto opcional. |
| `credit` | string \| null | Autor o fuente de la imagen. |

Tipos TypeScript: `backend/src/types.ts` y `frontend/src/types.ts` (mantener iguales).

## Endpoints

### `GET /api/health`
```json
{ "status": "ok", "source": "postgres", "authSource": "postgres", "time": "2026-10-30T00:00:00.000Z" }
```
`503` con `"status": "degraded"` si la base de datos no responde. `source` es `postgres` o `memory`; `authSource` indica de dónde salen las cuentas (`postgres` o `memory`).

### `POST /api/auth/register`
```json
{ "name": "Ana Pérez", "email": "ana@example.com", "password": "mínimo 8 caracteres" }
```
```json
{
  "data": {
    "id": "uuid",
    "name": "Ana Pérez",
    "email": "ana@example.com",
    "createdAt": "2026-10-30T00:00:00.000Z"
  }
}
```
- `201` si crea la cuenta. `409` si el correo ya existe (sin distinguir mayúsculas).
- `400` si el nombre tiene menos de 2 caracteres, el correo no es válido o la contraseña tiene menos de 8.
- El hash de la contraseña se genera en el backend con scrypt; la API nunca devuelve `passwordHash`.

### `POST /api/auth/login`
```json
{ "email": "ana@example.com", "password": "clave-segura-123" }
```
- `200` con el mismo objeto `data` del registro.
- `401` con `{ "error": "Correo o contraseña incorrectos." }` para credenciales inválidas.
- `400` si faltan datos o el correo no tiene formato válido.
- Actualiza `users.last_login_at` en cada inicio de sesión correcto.

### `GET /api/places?category=<slug>&q=<texto>`
```json
{ "data": [ /* Place[] */ ], "meta": { "count": 43 } }
```
- `category` (opcional): filtra por categoría; `400` si no cumple `^[a-z0-9-]+$`.
- `q` (opcional): búsqueda de texto libre en español sobre nombre, descripción, etiquetas, historia
  y dirección. Ignora acentos (`basilica` encuentra `Basílica`) y exige todas las palabras.
  `400` si viene vacío o supera 80 caracteres. Los resultados salen ordenados por relevancia.
- Se pueden combinar: `?q=teatro&category=cultura`.
- Caché: `public, max-age=300, stale-while-revalidate=86400`.

```bash
curl "https://<api>/api/places?q=iglesia"
curl "https://<api>/api/places?q=atardecer&category=naturaleza"
```

### `GET /api/places/:slug`
```json
{ "data": { /* Place */ } }
```
`404` si no existe, `400` si el slug es inválido.

## Respaldo sin conexión

`frontend/public/data/places.json` tiene exactamente el formato de `GET /api/places`. Se genera con `npm run sync-data -w frontend` a partir de `database/seed/` (corre solo antes de `dev` y `build`).
