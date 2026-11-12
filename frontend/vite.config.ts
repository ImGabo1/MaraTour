import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const apiProxy = {
  "/api": {
    target: process.env.DEV_API_TARGET ?? "http://localhost:3001",
    changeOrigin: true,
    configure: (proxy: { on: (event: string, handler: () => void) => void }) => {
      proxy.on("error", () => {
        /* backend apagado: la app cae al respaldo local sin ensuciar la consola */
      });
    },
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/favicon-64.png",
        "img/logo-emblema-192.png",
        "img/logo-maratours.png",
        "icons/apple-touch-icon.png",
        "img/mapa-maracaibo.jpg",
        "panos/*.svg",
        "data/places.json",
      ],
      manifest: {
        name: "Maratours · Turismo en Maracaibo",
        short_name: "Maratours",
        description: "Descubre los lugares turísticos del municipio Maracaibo: mapa, historia y vistas 360°.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        background_color: "#f5fbff",
        theme_color: "#f5fbff",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,json,woff2}"],
        // Las fotos de los lugares se guardan al verlas (runtimeCaching), no en la
        // instalación: son varios MB y no deben bloquear la primera visita.
        globIgnores: ["**/media/lugares/**", "**/media/360/**", "**/media/video/**", "**/media/galeria/**"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Datos de la API (cualquier origen): muestra lo guardado y refresca en segundo plano.
            urlPattern: /\/api\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "api-lugares", expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } },
          },
          {
            // Fotos y panoramas añadidos después (p. ej. subidos a un CDN): se guardan al verlos.
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "imagenes",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  // Navegadores un poco antiguos (Android 7+, iOS 12+ aprox.). Para más, añadir @vitejs/plugin-legacy.
  build: { target: ["es2018", "safari12"] },
  // /api va al backend local (npm run dev levanta ambos). Sin backend, la app usa
  // el respaldo public/data/places.json; DEV_API_TARGET permite apuntar a otro.
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
});
