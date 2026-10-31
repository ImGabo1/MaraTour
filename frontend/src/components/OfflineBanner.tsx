import type { DataSource } from "../api";
import { IconOffline } from "./icons";

interface Props {
  online: boolean;
  source: DataSource | null;
}

export function OfflineBanner({ online, source }: Props) {
  if (online && source !== "respaldo") return null;
  return (
    <div className="banner" role="status">
      <div className="container banner__inner">
        <IconOffline width={18} height={18} />
        {online
          ? "No pudimos conectar con el servidor: mostramos la información guardada en tu dispositivo."
          : "Sin conexión: mostramos la información guardada. Las vistas 360° que no hayas abierto antes no estarán disponibles."}
      </div>
    </div>
  );
}
