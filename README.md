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
turismo-maracaibo-pwa/
├── frontend/   → PWA en React 18 + Vite + vite-plugin-pwa (UI, 360°, mapa e i18n)
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
| **PWA Instalable** | Funciona como app nativa en Android, iOS, Windows y macOS. Botón de instalación nativo (`beforeinstallprompt`) y guía adaptada para Safari en iPhone/iPad. |
| **Offline-First** | Service Worker con Workbox. Guarda activos estáticos, fotos e imágenes en caché. Si la API no responde o no hay internet, la app recurre automáticamente a su respaldo local empaquetado. |
| **Catálogo de 43 Lugares** | Plazas, historia, cultura, fe, gastronomía, salud, deportes y vida nocturna con descripción, fotos, etiquetas y sector. |
| **Visor Panorámico 360°** | Visor esférico sin librerías pesadas en [`PanoViewer.tsx`](frontend/src/components/PanoViewer.tsx). Soporta arrastre táctil/ratón y **giroscopio** en teléfonos (con permisos para iOS). |
| **Mapa Interactivo Libre** | Visor Leaflet con zoom, arrastre, gestos táctiles y agrupación de pines en [`MapView.tsx`](frontend/src/components/MapView.tsx). La base es una imagen local renderizada desde OpenStreetMap / OpenFreeMap (`frontend/public/img/mapa-maracaibo.jpg`), así que funciona sin conexión y sin claves. Los botones «Cómo llegar» abren la ruta en Google Maps. |
| **Planificador de Rutas** | Itinerarios turísticos en [`PlannerPage.tsx`](frontend/src/pages/PlannerPage.tsx) y [`RoutePage.tsx`](frontend/src/pages/RoutePage.tsx) para organizar visitas con estimación de tiempo. |
| **Autenticación Segura** | Cuentas de usuario guardadas en PostgreSQL con contraseñas protegidas mediante hash criptográfico **`scrypt`** (salting + verificación de tiempo constante). Modo invitado disponible sin registro. |
| **Buscador Inteligente** | Filtros combinados por texto y categorías, normalizado sin problemas de acentos ni mayúsculas. |
| **Diccionario Maracucho** | Glosario interactivo de expresiones y modismos zulianos con ejemplos cotidianos. |
| **Asistente «Marac-IA»** | Widget de chat integrado para responder dudas frecuentes y dar recomendaciones de la ciudad. |
| **Multi-idioma (i18n)** | Soporte completo en español e inglés configurable desde la interfaz. |

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
| `npm test` | Ejecuta las pruebas unitarias e integración con Vitest (19 tests). |
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
