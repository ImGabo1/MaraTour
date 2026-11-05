import type { AuthSession } from "./auth";

/** Lugares guardados en «Mi ruta». Separados por usuario para privacidad. */

export const LEGACY_STORAGE_KEY = "maracaibo.saved";
export const GUEST_STORAGE_KEY = "maracaibo.saved.guest";

export function storageKeyFor(session?: AuthSession | null): string {
  if (session && session.kind === "user" && session.email) {
    return `maracaibo.saved.${session.email.toLowerCase().trim()}`;
  }
  return GUEST_STORAGE_KEY;
}

function sanitize(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))];
}

export function readSaved(key: string = GUEST_STORAGE_KEY): string[] {
  try {
    let raw = window.localStorage.getItem(key);
    // Migración transparente si viene de la versión previa con clave global única
    if (!raw && key === GUEST_STORAGE_KEY) {
      raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function writeSaved(slugs: readonly string[], key: string = GUEST_STORAGE_KEY): void {
  const clean = sanitize(slugs);
  try {
    window.localStorage.setItem(key, JSON.stringify(clean));
  } catch {
    /* sin localStorage la app sigue funcionando */
  }
}

export function toggleSavedList(slugs: readonly string[], slug: string): string[] {
  return slugs.includes(slug) ? slugs.filter((item) => item !== slug) : [...slugs, slug];
}

/**
 * Cuando un usuario invitado decide registrarse o iniciar sesión, transferimos
 * las paradas que ya había elegido para que no las pierda.
 */
export function transferGuestSavedToUser(userEmail: string): void {
  try {
    const guest = readSaved(GUEST_STORAGE_KEY);
    if (guest.length === 0) return;
    const userKey = `maracaibo.saved.${userEmail.toLowerCase().trim()}`;
    const userSaved = readSaved(userKey);
    const merged = [...new Set([...userSaved, ...guest])];
    writeSaved(merged, userKey);
    // Vaciamos el temporal de invitado tras transferir
    window.localStorage.removeItem(GUEST_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Sincroniza «Mi ruta» entre pestañas abiertas para la clave activa. */
export function onSavedChange(key: string, handler: (slugs: string[]) => void): () => void {
  const storage = (event: StorageEvent) => {
    if (event.key === key) handler(readSaved(key));
  };
  window.addEventListener("storage", storage);
  return () => window.removeEventListener("storage", storage);
}
