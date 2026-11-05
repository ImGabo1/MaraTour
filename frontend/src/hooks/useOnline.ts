import { useEffect, useState } from "react";
import { API_URL } from "../config";

/**
 * Detecta conectividad real con el backend, no solo si el navegador dice
 * que está "online" (navigator.onLine puede ser true aunque no haya
 * internet). Hace un fetch ligero a /api/health y reintenta cada 30 s.
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${API_URL}/api/health`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!cancelled) setOnline(res.ok);
      } catch {
        if (!cancelled) setOnline(false);
      }
    };

    check();

    // Revisa cada 30 segundos para recuperar el banner cuando vuelve internet.
    const interval = setInterval(check, 30_000);

    const onOnline = () => void check();
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return online;
}
