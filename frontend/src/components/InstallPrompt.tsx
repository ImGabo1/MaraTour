import { useEffect, useRef, useState } from "react";

interface Props {
  /** Si se quiere forzar a mostrar aunque ya esté instalado (solo pruebas). */
  force?: boolean;
}

/**
 * Banner discreto para instalar la PWA.
 *
 * Chrome/Android no permite forzar el aviso nativo sin interacción del
 * usuario, así que escuchamos `beforeinstallprompt`, guardamos el evento y
 * mostramos nuestro propio botón. Al hacer clic se dispara el prompt nativo.
 * En iOS no existe ese evento, así que mostramos instrucciones manuales.
 */
export function InstallPrompt({ force = false }: Props = {}) {
  const [deferred, setDeferred] = useState<Event | null>(null);
  const [shown, setShown] = useState(false);
  const [ios, setIos] = useState(false);
  const dismissed = useRef(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  useEffect(() => {
    if (isIOS) setIos(true);

    const onBeforeInstall = (event: Event) => {
      // Chrome intenta mostrar su propio aviso; lo bloqueamos para usar el nuestro.
      event.preventDefault();
      setDeferred(event);
      if (!dismissed.current && !shown && !force) setShown(true);
    };

    const onAppInstalled = () => {
      setDeferred(null);
      setShown(false);
      dismissed.current = true;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [force, shown]);

  const install = async () => {
    if (!deferred) return;
    try {
      (deferred as any).prompt?.();
    } catch {
      /* el usuario canceló o el navegador no lo soporta */
    } finally {
      setShown(false);
      dismissed.current = true;
    }
  };

  const dismiss = () => {
    setShown(false);
    dismissed.current = true;
  };

  if (dismissed.current && !force) return null;

  if (ios) {
    return (
      <div className="vm-install-banner vm-install-banner--ios">
        <span className="vm-install-banner__icon" aria-hidden="true">
          📱
        </span>
        <div className="vm-install-banner__text">
          <strong>Instala Visita Maracaibo</strong>
          <p>
            Toca <strong>Compartir</strong> en Safari y luego{" "}
            <strong>Agregar a pantalla de inicio</strong>.
          </p>
        </div>
        <button type="button" className="vm-btn vm-btn--soft vm-install-banner__close" onClick={dismiss}>
          Entendido
        </button>
      </div>
    );
  }

  if (!deferred && !force) return null;

  return (
    <div className="vm-install-banner vm-install-banner--android">
      <span className="vm-install-banner__icon" aria-hidden="true">
        ⬇️
      </span>
      <div className="vm-install-banner__text">
        <strong>Instala la app de Maracaibo</strong>
        <p>Tendrás los lugares, mapas y vistas 360° incluso sin internet.</p>
      </div>
      <div className="vm-install-banner__actions">
        <button type="button" className="vm-btn vm-btn--primary" onClick={install}>
          Instalar
        </button>
        <button type="button" className="vm-btn vm-btn--ghost vm-install-banner__close" onClick={dismiss}>
          Quizás después
        </button>
      </div>
    </div>
  );
}
