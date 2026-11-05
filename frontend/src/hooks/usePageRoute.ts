import { useEffect, useState } from "react";

export type Page =
  | "bienvenida"
  | "entrar"
  | "registro"
  | "inicio"
  | "explorar"
  | "plan"
  | "diccionario"
  | "mi-ruta";

const PAGES: readonly Page[] = [
  "bienvenida",
  "entrar",
  "registro",
  "inicio",
  "explorar",
  "plan",
  "diccionario",
  "mi-ruta",
];

const PAGE_PATTERN =
  /^#\/?(bienvenida|entrar|registro|inicio|explorar|plan|diccionario|mi-ruta)(?:\/|$)/;

function readPage(): Page {
  // Un enlace compartido a una ficha (#/lugar/<slug>) se abre sobre Inicio:
  // así el botón «atrás» y la recarga no pierden el lugar.
  if (window.location.hash.startsWith("#/lugar/")) return "inicio";
  const match = PAGE_PATTERN.exec(window.location.hash);
  const page = match?.[1] as Page | undefined;
  return page && PAGES.includes(page) ? page : "bienvenida";
}

/**
 * Navegación por páginas con hash. La ficha de un lugar (#/lugar/<slug>) se
 * superpone a la página actual, así que no cambia la pestaña de fondo.
 */
export function usePageRoute(): {
  page: Page;
  navigate: (page: Page) => void;
} {
  const [page, setPage] = useState<Page>(readPage);

  useEffect(() => {
    const onChange = () => {
      if (window.location.hash.startsWith("#/lugar/")) return;
      setPage(readPage());
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (next: Page) => {
    if (readPage() === next && !window.location.hash.startsWith("#/lugar/")) {
      window.location.hash = `/${next}`;
      return;
    }
    window.location.hash = `/${next}`;
  };

  return { page, navigate };
}
