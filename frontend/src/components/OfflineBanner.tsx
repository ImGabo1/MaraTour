import type { DataSource } from "../api";
import { useI18n } from "../i18n/I18nProvider";
import { IconOffline } from "./icons";

interface Props {
  online: boolean;
  source: DataSource | null;
}

export function OfflineBanner({ online, source }: Props) {
  const { t } = useI18n();
  if (online && source !== "respaldo") return null;
  return (
    <div className="banner" role="status">
      <div className="container banner__inner">
        <IconOffline width={18} height={18} />
        {online ? t("offline.saved") : t("offline.offline")}
      </div>
    </div>
  );
}
