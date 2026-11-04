# Contrato de la API

Base: `http://localhost:3001` (desarrollo) · en producción, la URL del backend (`VITE_API_URL` en el front).
Todas las respuestas son JSON. Solo lectura por ahora.

## Tipo `Place`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `slug` | string | Identificador único y legible (`teatro-baralt`). Se usa en la URL del front: `#/lugar/<slug>`. |
| `name` | string | |
| `category` | string | Slug de categoría: `historia`, `cultura`, `religioso`, `naturaleza`. |
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
{ "status": "ok", "source": "postgres", "time": "2026-10-30T00:00:00.000Z" }
```
`503` con `"status": "degraded"` si la base de datos no responde. `source` es `postgres` o `memory`.

### `GET /api/places?category=<slug>&q=<texto>`
```json
{ "data": [ /* Place[] */ ], "meta": { "count": 6 } }
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
