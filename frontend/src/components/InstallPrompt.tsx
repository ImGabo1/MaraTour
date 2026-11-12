import { useEffect, useRef, useState } from "react";
import { IconClose, IconDownload, IconShare } from "./icons";
import "./InstallPrompt.css";

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
      <div className="mt-install-banner mt-reveal">
        <section className="mt-install-banner__card glass glass--md" aria-label="Instalar MaraTour">
          <span className="mt-install-banner__icon" aria-hidden="true">
            <IconShare width={22} height={22} />
          </span>
          <div className="mt-install-banner__text">
            <strong>Instala MaraTour en tu iPhone</strong>
            <p>
              Toca <b>Compartir</b> en Safari y luego <b>Agregar a pantalla de inicio</b>.
            </p>
          </div>
          <button type="button" className="mt-install-banner__ok mt-press mt-focusable" onClick={dismiss}>
            Entendido
          </button>
        </section>
      </div>
    );
  }

  if (!deferred && !force) return null;

  return (
    <div className="mt-install-banner mt-reveal">
      <section className="mt-install-banner__card glass glass--md" aria-label="Instalar MaraTour">
        <span className="mt-install-banner__icon" aria-hidden="true">
          <IconDownload width={22} height={22} />
        </span>
        <div className="mt-install-banner__text">
          <strong>Instala MaraTour</strong>
          <p>Ten los lugares, mapas y vistas 360° a la mano, incluso sin internet.</p>
        </div>
        <div className="mt-install-banner__actions">
          <button type="button" className="mt-install mt-press mt-focusable" onClick={install}>
            Instalar
          </button>
          <button
            type="button"
            className="mt-install-banner__later mt-press mt-focusable"
            onClick={dismiss}
            aria-label="Quizás después"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
