# Cómo cargar tus fotos, videos y 360°

La app ya usa fotos reales de Wikimedia Commons como punto de partida. Cuando
grabes tu propio material, reemplaza archivos sin tocar el diseño.

## 1. Fotos de portada y galería

Guarda las fotos en:

```
frontend/public/media/lugares/<slug>.jpg
```

- Tamaño recomendado: **1600 × 1000 px** (horizontal), JPG de buena calidad.
- El `<slug>` es el identificador del lugar, por ejemplo `basilica-chiquinquira`,
  `vereda-del-lago`, `sambil-maracaibo`. La lista completa está en
  `frontend/src/data/catalog.ts` (`slug` de cada lugar).
- Si el archivo se llama igual que el slug, **se usa automáticamente** y no hay
  que editar código.
- Para una galería adicional, añade entradas en `frontend/src/data/media.ts`
  dentro del lugar correspondiente:

```ts
"basilica-chiquinquira": {
  image: photo("basilica-chiquinquira"),
  gallery: [
    photo("basilica-chiquinquira"),
    "/media/lugares/basilica-chiquinquira-2.jpg",
  ],
  credit: "Foto: tu nombre · Uso propio",
  source: "",
},
```

Los lugares sin foto muestran una portada generada con los colores de su
categoría; no queda ningún espacio roto.

## 2. Panoramas 360°

Guarda los 360 en:

```
frontend/public/media/360/<slug>.jpg
```

- Deben ser **equirectangulares**, relación **2:1** (por ejemplo 4096 × 2048).
- Luego conéctalo en `frontend/src/data/media.ts`:

```ts
"vereda-del-lago": {
  image: photo("vereda-del-lago"),
  pano: "/media/360/vereda-del-lago.jpg",
},
```

Solo los lugares con `pano` muestran el botón **Vista 360°** en su ficha.

## 3. Videos cortos

Guarda los videos en:

```
frontend/public/media/video/<slug>.mp4
```

y conéctalos igual:

```ts
"puente-rafael-urdaneta": {
  image: photo("puente-rafael-urdaneta"),
  video: "/media/video/puente-rafael-urdaneta.mp4",
},
```

- Formato recomendado: MP4 (H.264) de 10–30 segundos, menos de 15 MB.
- Se muestran en la ficha cuando el campo `videoUrl` tiene valor.

## 4. Carrusel de la portada

El carrusel de bienvenida usa fotos de lugares. Para reemplazarlas por las
tuyas, coloca las imágenes en:

```
frontend/public/media/carrusel/
```

y cambia las rutas en `frontend/src/data/welcome.ts`:

```ts
{
  src: "/media/carrusel/mi-foto.jpg",
  kicker: "Atardeceres",
  title: "Vereda del Lago",
  caption: "Mi propia foto del atardecer.",
},
```

## 5. Créditos

En `frontend/src/data/media.ts`, cada lugar acepta:

- `credit`: texto visible en la ficha.
- `source`: enlace a la fuente original.

Si la foto es tuya, usa algo como
`credit: "Foto: Tu Nombre · Todos los derechos reservados"` y deja `source` vacío.

## 6. Después de subir archivos

```bash
npm run dev        # recarga automática en http://localhost:5173
npm run typecheck  # confirma que no faltan datos
npm run build      # versión de producción
```

No hace falta reiniciar la base de datos para cambiar imágenes.
