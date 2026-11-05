import { useI18n } from "../i18n/I18nProvider";
import { IconOffline } from "./icons";

interface Props {
  online: boolean;
}

/**
 * Muestra un aviso solo cuando realmente no hay conectividad con el servidor.
 * Si hay internet, no se muestra aunque los lugares vengan del respaldo.
 */
export function OfflineBanner({ online }: Props) {
  const { t } = useI18n();

  if (online) return null;

  return (
    <div className="banner" role="status">
      <div className="container banner__inner">
        <IconOffline width={18} height={18} />
        <p>{t("offline.offline")}</p>
      </div>
    </div>
  );
}
