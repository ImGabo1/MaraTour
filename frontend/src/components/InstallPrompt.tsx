import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
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
/** Convierte *texto* en negrita. */
function withBold(text: string) {
  return text.split(/\*([^*]+)\*/).map((part, index) => (index % 2 === 1 ? <b key={index}>{part}</b> : part));
}

export function InstallPrompt({ force = false }: Props = {}) {
  const { t } = useI18n();
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
        <section className="mt-install-banner__card glass glass--md" aria-label={t("shell.install.label")}>
          <span className="mt-install-banner__icon" aria-hidden="true">
            <IconShare width={22} height={22} />
          </span>
          <div className="mt-install-banner__text">
            <strong>{t("shell.install.iosTitle")}</strong>
            <p>{withBold(t("shell.install.iosBody"))}</p>
          </div>
          <button type="button" className="mt-install-banner__ok mt-press mt-focusable" onClick={dismiss}>
            {t("common.gotIt")}
          </button>
        </section>
      </div>
    );
  }

  if (!deferred && !force) return null;

  return (
    <div className="mt-install-banner mt-reveal">
      <section className="mt-install-banner__card glass glass--md" aria-label={t("shell.install.label")}>
        <span className="mt-install-banner__icon" aria-hidden="true">
          <IconDownload width={22} height={22} />
        </span>
        <div className="mt-install-banner__text">
          <strong>{t("shell.install.title")}</strong>
          <p>{t("shell.install.body")}</p>
        </div>
        <div className="mt-install-banner__actions">
          <button type="button" className="mt-install mt-press mt-focusable" onClick={install}>
            {t("nav.installShort")}
          </button>
          <button
            type="button"
            className="mt-install-banner__later mt-press mt-focusable"
            onClick={dismiss}
            aria-label={t("shell.install.later")}
          >
            <IconClose width={18} height={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
