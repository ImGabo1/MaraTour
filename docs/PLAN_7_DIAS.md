# Plan de 7 días

Punto de partida (día 0): repo preliminar que ya corre completo. Los 7 días se dedican a **verificar, pulir y publicar**, no a empezar de cero.

Leyenda: **F** front · **B** back/despliegue (Gabriel) · **D** base de datos · **C** contenido/360°/UX (4ª persona)

| Día | Objetivo | F | B | D | C |
| --- | --- | --- | --- | --- | --- |
| **1** | Todos corren el proyecto; reparto confirmado | Revisar UI y lista de mejoras | Backend en local + primer despliegue de prueba | Postgres local con `db:*`; verificar esquema | Lista de lugares definitiva (8–12) y plan de fotos |
| **2** | Contenido real entra al sistema | Mapa real (`MAP_IMAGE`) y ajustes responsivos | Rate limit, logs, CORS por entorno | Crear `002_media.sql` (varias fotos por lugar) | Textos verificados + coordenadas confirmadas |
| **3** | Fotos y 360° reales | Visor 360° con imágenes reales; carga progresiva | API: endpoint de media si hace falta | Cargar datos reales con el seed | Fotos 2D y panorámicas optimizadas |
| **4** | **Despliegue completo en internet** | Variables de producción, ícono y nombre finales | Front + API + BD publicados con HTTPS | Base en proveedor gratuito + respaldo | Spike VR/WebXR → recomendación escrita |
| **5** | Pruebas en dispositivos | Corregir fallas de la matriz | Ejecutar `PRUEBAS_DISPOSITIVOS.md` en todas las plataformas | Revisar rendimiento de consultas | Pruebas de usabilidad con 3–5 personas |
| **6** | Pulido y accesibilidad | Foco/teclado, contraste, Lighthouse > 90 | Monitoreo del `/api/health`, caché | Copias de seguridad probadas | Ajustes de textos y fotos según pruebas |
| **7** | Congelar y entregar | Solo correcciones críticas | Despliegue final desde `main` | Datos finales | Guion de demo y capturas |

## Definición de «terminado» (para la entrega)

- [ ] Desde `main` se despliegan front, API y BD en HTTPS; `/api/health` dice `"source": "postgres"`.
- [ ] Lighthouse PWA: instalable; rendimiento y accesibilidad > 90 en móvil.
- [ ] La app abre y muestra lugares **sin conexión** tras la primera visita.
- [ ] Al menos 8 lugares con coordenadas verificadas, historia con fuentes, foto 2D y 360° real.
- [ ] «Cómo llegar» abre la ubicación correcta en Google Maps en Android e iPhone.
- [ ] 360° funciona arrastrando en todos los dispositivos y con movimiento en Android e iPhone (o se oculta el botón con un aviso claro).
- [ ] Matriz de dispositivos completada, sin fallas críticas abiertas.

## Backlog de ideas (si sobra tiempo)

- Buscador y favoritos guardados en el dispositivo (IndexedDB / `localStorage`).
- Rutas sugeridas (varios lugares en un recorrido a pie).
- Photo Sphere Viewer o three.js: mirada completa, zoom y modo visor (WebXR).
- Idiomas (inglés).
- Compartir un lugar (`navigator.share` con el enlace `#/lugar/<slug>`).
- Panel de administración protegido para editar lugares.

## Sobre Unity y Meta Quest

Una PWA **no puede** ser una app de Unity. Opciones, de menos a más trabajo:

1. **El navegador del Quest abre la PWA** y muestra el 360° (WebXR / A-Frame). Reutiliza todo lo que ya hay. **Recomendada para 7 días.**
2. App de Unity aparte para Quest que consuma la misma API `/api/places`. Es otro proyecto; solo después de la entrega.

La persona 4 entrega en el día 4 un spike para decidir entre estas opciones con evidencia.
