import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icons/icon.svg",
        "icons/apple-touch-icon.png",
        "img/mapa-maracaibo.jpg",
        "panos/*.svg",
        "data/places.json",
      ],
      manifest: {
        name: "Visita Maracaibo",
        short_name: "Maracaibo",
        description: "Descubre los lugares turísticos del municipio Maracaibo: mapa, historia y vistas 360°.",
        lang: "es",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "any",
        background_color: "#FBF4E8",
        theme_color: "#0F6B79",
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
        globIgnores: ["**/media/lugares/**", "**/media/360/**", "**/media/video/**"],
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
  server: {
    proxy: { "/api": { target: "http://localhost:3001", changeOrigin: true } },
  },
});
