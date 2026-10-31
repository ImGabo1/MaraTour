import { useEffect, useRef } from "react";

// Pila de modales abiertos: Escape solo cierra el de arriba.
const stack: object[] = [];

/**
 * Comportamiento común de diálogos: Escape para cerrar, bloquear el scroll de la página,
 * llevar el foco al diálogo y devolverlo al cerrar. Devuelve la ref del elemento que recibe el foco.
 * Pendiente (accesibilidad): atrapar el foco con Tab dentro del diálogo.
 */
export function useModal<T extends HTMLElement>(onClose: () => void) {
  const focusRef = useRef<T>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const token = {};
    stack.push(token);
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === token) closeRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      const i = stack.indexOf(token);
      if (i >= 0) stack.splice(i, 1);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, []);

  return focusRef;
}
