import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { I18nProvider } from "./i18n/I18nProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./styles/tokens.css";
import "./styles/glass.css";
import "./styles/animations.css";
import "./styles/typography.css";
import "./styles.css";
import "./theme.css";

// Service worker: guarda la app y los datos para usarla sin conexión (solo en build de producción).
registerSW({ immediate: true });

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
