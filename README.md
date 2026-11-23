# ☀️ Visita Maracaibo (MaraTour) — PWA de Turismo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-orange.svg?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Status](https://img.shields.io/badge/Estado-Demo%20Funcional%20Avanzada-success.svg)]()

> Aplicación web progresiva (PWA) de turismo diseñada para explorar el **municipio Maracaibo (Zulia, Venezuela)**: mapa interactivo, catálogo curado de sitios de interés, vistas panorámicas 360°, planificador de rutas, diccionario maracucho, asistente virtual y soporte sin conexión (*Offline-First*). Todo desarrollado en **TypeScript** de extremo a extremo.

---

## 🏛️ Arquitectura del Proyecto

El repositorio es un monorepo gestionado con **npm workspaces**:

```text
MaraTour/
├── frontend/   → PWA en React 18 + Vite + vite-plugin-pwa (UI, 360°, mapa, 10 idiomas y modo oscuro)
├── backend/    → API REST en Node.js + Express + zod + pg (Docker listo para Render)
├── database/   → Migraciones SQL, scripts de seed y datos del catálogo (Neon / PostgreSQL)
└── docs/       → Arquitectura, contrato de API, medios, pruebas y despliegue
```

### ☁️ Despliegue en Producción
* **Base de Datos:** [Neon](https://neon.tech) (PostgreSQL en la nube, con SSL y *Connection Pooling*).
* **API Backend:** [Render](https://render.com) (Contenedor Docker basado en [`backend/Dockerfile`](backend/Dockerfile)).
* **Frontend PWA:** [Vercel](https://vercel.com) o [Netlify](https://netlify.com) (distribución global vía CDN con HTTPS).

---

## ✨ Características Principales

| Característica | Implementación |
| :--- | :--- |
| **PWA instalable** | Funciona como app nativa en Android, iOS, Windows y macOS. Botón de instalación (`beforeinstallprompt`) y guía para Safari en iPhone/iPad. Se recarga sola cuando hay una versión nueva. |
| **Offline-First** | Service Worker con Workbox: guarda activos, fotos y panorámicas. Si la API no responde o no hay internet, usa el respaldo local empaquetado (`public/data/places.json`). |
| **Catálogo de 43 lugares** | Plazas, historia, cultura, fe, gastronomía, salud, deportes y vida nocturna, con descripción, historia, fotos, etiquetas y sector. |
| **Fichas verticales** | Foto principal en formato vertical con galería de miniaturas, créditos solo cuando la foto es de Wikimedia, botón «Ver en 360°», mapa y «Cómo llegar». |
| **Visor 360°** | Visor esférico propio, sin librerías pesadas ([`PanoViewer.tsx`](frontend/src/components/PanoViewer.tsx)). Arrastre táctil/ratón y **giroscopio** en teléfonos. El botón «Atrás» del navegador cierra el visor en vez de salir de la sección. |
| **Mapa interactivo** | Leaflet con agrupación de pines ([`MapView.tsx`](frontend/src/components/MapView.tsx)). Usa teselas de CARTO y, si fallan, de OpenStreetMap, sin claves de API; si ninguna carga, queda una imagen local de respaldo. «Cómo llegar» abre Google Maps. |
| **Planificador y Mi ruta** | Itinerarios con estimación de tiempo ([`PlannerPage.tsx`](frontend/src/pages/PlannerPage.tsx), [`RoutePage.tsx`](frontend/src/pages/RoutePage.tsx)); la ruta queda guardada en el dispositivo. |
| **Cuentas** | Registro e inicio de sesión con contraseñas protegidas con **`scrypt`** (salt + verificación en tiempo constante). Modo invitado sin registro. |
| **Buscador** | Filtros por texto y categoría, sin distinguir acentos ni mayúsculas; funciona sin conexión. |
| **Diccionario maracucho** | Glosario de expresiones y modismos zulianos con ejemplos. |
| **Asistente «Zulmita»** | Chat integrado que responde dudas frecuentes y recomienda lugares (las palabras clave del texto libre se entienden en español). |
| **10 idiomas** | Interfaz en español, inglés, portugués, francés, alemán, italiano, ruso, chino, japonés y árabe (con escritura de derecha a izquierda). Las historias de los lugares también se traducen y se cargan solo en el idioma elegido. |
| **Modo claro y oscuro** | Claro: cielo, sol y puente. Oscuro: noche con luna y el relámpago del Catatumbo. Todo el fondo es SVG/CSS, sin imágenes pesadas. |

---

## 🎨 Sistema de diseño

Interfaz tipo **glassmorphism** con paleta propia de Maracaibo, definida como variables `--mt-*` en [`frontend/src/styles/tokens.css`](frontend/src/styles/tokens.css):

| Token | Uso |
| :--- | :--- |
| Cielo `#4FC3F7` / `#7FD3F7` / `#EAF7FF` | Fondos y superficies |
| Tinta `#0B2A4A` | Texto principal |
| Sol `#FFC83D` / `#FFE08A` | Etiquetas, «Ver en 360°» y acentos |
| Rojo `#C22B38` / `#E63946` | Solo la acción principal y los pines del mapa |
| Vidrio `rgba(255,255,255,.55)` + blur 16 px | Barras, tarjetas y paneles |

Reglas: fotos con `aspect-ratio` y `object-fit: cover`, animaciones solo con `transform`/`opacity` (respetan *reduced motion*), áreas táctiles de al menos 44 px y sin desborde horizontal desde 320 px. El modo oscuro se activa con `html[data-theme="dark"]`.

---

## 🚀 Arranque Rápido en Local

### Requisitos previos
* **Node.js 20+** y **npm**
* *(Opcional)* Docker si deseas levantar PostgreSQL localmente en lugar de Neon.

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/ImGabo1/MaraTour.git
cd MaraTour
npm install
```

### 2. Variables de entorno
Copia la plantilla base:
```bash
cp .env.example .env
```
*(Si no configuras `DATABASE_URL`, el backend iniciará automáticamente en **modo memoria** utilizando los archivos de `database/seed/` sin necesidad de base de datos).*

### 3. Ejecutar en desarrollo
Abre dos terminales:

```bash
# Terminal 1 — Backend API (http://localhost:3001)
npm run dev:back

# Terminal 2 — Frontend PWA (http://localhost:5173)
npm run dev:front
```

---

## 🖼️ Fotos y panorámicas

Los medios viven por sitio en `frontend/public/media/sitios/<slug>/` (`portada.jpg`, `foto-01.jpg`…, `360.jpg`, `video.mp4`). `npm run sync-data -w frontend` los indexa en `frontend/src/data/media-manifest.json`. Recomendado: fotos verticales 3:4 (1200 × 1600 px, JPG) y panorámicas 2:1. Detalles en [`docs/MEDIOS.md`](docs/MEDIOS.md).

---

## 🗄️ Base de Datos (Neon / PostgreSQL)

Las migraciones son idempotentes y versionadas numéricamente:

```bash
# 1. Aplicar migraciones pendientes (tablas, índices, búsqueda, usuarios, sectores)
npm run db:migrate

# 2. Cargar o actualizar el catálogo de 43 lugares oficiales
npm run db:seed

# 3. Verificar estado de tablas y conteo de registros
npm run db:check
```

---

## 🛠️ Scripts del Repositorio

| Comando | Acción |
| :--- | :--- |
| `npm run typecheck` | Verifica tipos TypeScript en `frontend`, `backend` y `database`. |
| `npm test` | Ejecuta las pruebas con Vitest (26 en total: 19 del backend y 7 del frontend). |
| `npm run build` | Sincroniza datos, empaqueta el frontend con Service Worker y compila el backend. |
| `npm run preview` | Previsualiza en local la versión compilada de producción de la PWA. |

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Estado del servicio, origen de datos (PostgreSQL/memoria) y hora. |
| `GET` | `/api/places` | Lista de lugares turísticos (filtros opcionales: `?category=...&q=...`). |
| `GET` | `/api/places/:slug` | Ficha detallada de un lugar por su identificador. |
| `POST` | `/api/auth/register` | Registro de nuevo usuario (nombre, correo y contraseña). |
| `POST` | `/api/auth/login` | Inicio de sesión seguro con correo y contraseña. |

---

## 👥 Reparto del Equipo

* **Frontend:** UI responsiva, animaciones, accesibilidad, PWA, mapa, visor 360° e i18n.
* **Backend y Despliegue:** API REST, seguridad, autenticación, contenedor Docker y despliegue en Render.
* **Base de Datos:** Modelado relacional, índices de búsqueda, migraciones y conexión en Neon.
* **Contenido y Medios:** Curaduría histórica, fotografías de lugares, panorámicas 360° y validación de coordenadas.

---

## 📚 Documentación Adicional

* 📖 [`docs/API.md`](docs/API.md) — Especificación y esquemas del contrato de la API.
* 🚀 [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md) — Guía detallada para publicar en Neon, Render y Vercel.
* 📸 [`docs/MEDIOS.md`](docs/MEDIOS.md) — Cómo incorporar fotos 2D, panorámicas 360° y videos propios.
* 📱 [`docs/PRUEBAS_DISPOSITIVOS.md`](docs/PRUEBAS_DISPOSITIVOS.md) — Matriz de pruebas y compatibilidad móvil.
* 🗓️ [`docs/PLAN_7_DIAS.md`](docs/PLAN_7_DIAS.md) — Cronograma de trabajo y criterios de entrega.
