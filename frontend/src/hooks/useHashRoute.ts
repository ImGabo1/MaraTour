import { useCallback, useEffect, useRef, useState } from "react";

const PATTERN = /^#\/lugar\/([a-z0-9-]+)/;

function read(): string | null {
  const match = PATTERN.exec(window.location.hash);
  return match?.[1] ?? null;
}

/**
 * Ruta mínima por hash: #/lugar/<slug>. Permite compartir enlaces a un lugar
 * y que el botón «atrás» del teléfono cierre la ficha (sin instalar un router).
 */
export function useHashRoute(): {
  slug: string | null;
  open: (slug: string) => void;
  close: () => void;
} {
  const [slug, setSlug] = useState<string | null>(read);
  const pushed = useRef(false);

  useEffect(() => {
    const onChange = () => {
      const next = read();
      if (next === null) pushed.current = false;
      setSlug(next);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const open = useCallback((next: string) => {
    pushed.current = true;
    window.location.hash = `/lugar/${next}`;
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
      setSlug(null);
    }
  }, []);

  return { slug, open, close };
}
