import { useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useModal } from "../hooks/useModal";
import { IconClose, IconDownload, IconShare, IconWave } from "./icons";

export function Header() {
  const { mode, install } = useInstallPrompt();
  const [iosHelp, setIosHelp] = useState(false);

  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="#top" aria-label="Visita Maracaibo, inicio">
          <span className="brand__logo">
            <IconWave width={20} height={20} />
          </span>
          <span className="brand__name">Visita Maracaibo</span>
        </a>

        <nav className="nav" aria-label="Secciones">
          <a href="#mapa">Mapa</a>
          <a href="#lugares">Lugares</a>
        </nav>

        {mode === "prompt" && (
          <button type="button" className="btn btn--primary btn--sm" onClick={install}>
            <IconDownload width={16} height={16} /> Instalar app
          </button>
        )}
        {mode === "ios" && (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setIosHelp(true)}>
            <IconDownload width={16} height={16} /> Instalar
          </button>
        )}
      </div>
      {iosHelp && <IosInstallHelp onClose={() => setIosHelp(false)} />}
    </header>
  );
}

function IosInstallHelp({ onClose }: { onClose: () => void }) {
  const closeRef = useModal<HTMLButtonElement>(onClose);
  return (
    <div className="overlay overlay--center" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ios-title" className="dialog__title">
          Instalar en iPhone o iPad
        </h2>
        <ol className="dialog__steps">
          <li>
            Abre esta página en <strong>Safari</strong>.
          </li>
          <li>
            Toca el botón <strong>Compartir</strong> <IconShare width={18} height={18} style={{ verticalAlign: "-3px" }} />.
          </li>
          <li>
            Elige <strong>Agregar a pantalla de inicio</strong>.
          </li>
        </ol>
        <button ref={closeRef} type="button" className="btn btn--dark" onClick={onClose}>
          Entendido
        </button>
        <button type="button" className="icon-btn dialog__close" onClick={onClose} aria-label="Cerrar">
          <IconClose />
        </button>
      </div>
    </div>
  );
}
