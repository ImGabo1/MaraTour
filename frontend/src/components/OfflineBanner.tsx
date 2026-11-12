import { useI18n } from "../i18n/I18nProvider";
import { IconOffline } from "./icons";
import "./OfflineBanner.css";

interface Props {
  online: boolean;
}

/**
 * Muestra un aviso solo cuando realmente no hay conectividad con el servidor.
 * Si hay internet, no se muestra aunque los lugares vengan del respaldo.
 *
 * La región aria-live vive siempre en el DOM: así los lectores de pantalla
 * anuncian el aviso cuando aparece y cuando desaparece.
 */
export function OfflineBanner({ online }: Props) {
  const { t } = useI18n();

  return (
    <div className="mt-offline-live" role="status" aria-live="polite">
      {!online && (
        <div className="mt-offline mt-reveal">
          <div className="mt-offline__card glass glass--md glass--flat">
            <IconOffline width={22} height={22} />
            <p>{t("offline.offline")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
