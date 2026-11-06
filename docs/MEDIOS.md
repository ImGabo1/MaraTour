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

## 7. Fotos de las categorías

Las tarjetas de «Ocho formas de sentir Maracaibo» usan una foto por tema.
Están centralizadas en `frontend/src/data/categories.ts` → `CATEGORY_MEDIA`:

```ts
gastronomia: {
  image: "/media/categorias/gastronomia.jpg",
  credit: "Foto: Jdvillalobos · CC BY-SA 3.0 · Wikimedia Commons",
},
```

- Para cambiar una categoría, reemplaza el archivo en
  `frontend/public/media/categorias/` o apunta `image` a otra ruta.
- **Todas** las categorías deben tener `image`; si falta una, la tarjeta se ve
  incompleta.
- El `credit` se muestra como tooltip y debe conservarse cuando la licencia lo
  exija (CC BY, CC BY-SA).

## 8. Logo

El logo de la app es `frontend/public/icons/icon.svg` (sol, lago y puente). Se
usa en la cabecera, la bienvenida, el registro y como icono de la PWA. Para
cambiar el logo, reemplaza ese archivo (y, si quieres, los PNG de
`frontend/public/icons/` para la instalación en el teléfono).

## 9. Mapa base

El mapa no depende de Google Maps ni de una clave de API. Es una imagen local:

```
frontend/public/img/mapa-maracaibo.jpg   (1800 × 1170)
```

Se renderizó una sola vez desde **OpenStreetMap** con el estilo *Positron* de
**OpenFreeMap**, recoloreado con la paleta de la app y con las etiquetas en
español. Leaflet aporta zoom, arrastre, gestos táctiles y agrupación de pines.

- Bordes geográficos: `frontend/src/config.ts` → `MAP_IMAGE.bounds`
  (`north`, `south`, `west`, `east`).
- Si reemplazas la imagen, mantén la misma proporción (ancho/alto ≈ 1.538) y
  actualiza los bordes. Si no, los pines quedarán desalineados.
- Crédito visible en la esquina del mapa: **© OpenStreetMap · OpenFreeMap**.
- La imagen se precarga en el service worker para que el mapa siga funcionando
  sin conexión.

## 10. Fotos referenciales pendientes

Estas fichas usan una foto de la categoría como referencia temporal. Cuando el
equipo envíe la foto correcta, reemplaza el archivo y actualiza `credit` en
`frontend/src/data/media.ts`:

- `jardin-botanico-maracaibo`, `rincon-zuliano`, `mi-vaquita`
- `hospital-universitario-maracaibo`, `hospital-clinico-maracaibo`,
  `clinica-paraiso`
- `terminal-pasajeros-maracaibo`, `doral-center`

Las demás fotos son del lugar o de un espacio equivalente (malecón / Paseo del
Lago). Los créditos completos están en `frontend/src/data/media.ts` y
`frontend/src/data/categories.ts`.
