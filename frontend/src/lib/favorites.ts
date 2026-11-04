/** Lugares guardados en «Mi ruta». Viven en el dispositivo, sin cuenta ni servidor. */

const STORAGE_KEY = "maracaibo.saved";

function sanitize(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && item.length > 0))];
}

export function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function writeSaved(slugs: readonly string[]): void {
  const clean = sanitize(slugs);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch {
    /* sin localStorage la app sigue funcionando */
  }
}

export function toggleSavedList(slugs: readonly string[], slug: string): string[] {
  return slugs.includes(slug) ? slugs.filter((item) => item !== slug) : [...slugs, slug];
}

/** Sincroniza «Mi ruta» entre pestañas abiertas. */
export function onSavedChange(handler: (slugs: string[]) => void): () => void {
  const storage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) handler(readSaved());
  };
  window.addEventListener("storage", storage);
  return () => window.removeEventListener("storage", storage);
}
