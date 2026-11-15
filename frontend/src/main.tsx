import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
// Los estilos globales van primero: el CSS de cada componente se carga después y gana en la cascada.
import "./styles/tokens.css";
import "./styles/glass.css";
import "./styles/animations.css";
import "./styles/typography.css";
import "./styles/layout.css";
import "./styles/buttons.css";
import "./styles.css";
import "./theme.css";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "./theme/ThemeProvider";

// Service worker: guarda la app y los datos para usarla sin conexión (solo en build de producción).
// Cuando hay una versión nueva, el service worker nuevo toma el control y la página se recarga una sola vez
// para mostrarla. Además se busca actualización al volver a la pestaña y cada hora.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateSW(true);
  },
  onRegisteredSW(_url, registration) {
    if (!registration) return;
    const check = () => void registration.update().catch(() => undefined);
    window.setInterval(check, 60 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check();
    });
  },
});

if ("serviceWorker" in navigator) {
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    // La primera instalación (sin controlador previo) no necesita recarga.
    if (!hadController || reloaded) return;
    reloaded = true;
    window.location.reload();
  });
}

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró #root");

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </I18nProvider>
  </StrictMode>
);
