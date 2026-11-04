import { useEffect, useRef, useState } from "react";

export interface PresenceEntry<T> {
  item: T;
  leaving: boolean;
}

/**
 * Mantiene los elementos que salen durante unos milisegundos para poder animar su
 * despedida. Los que entran se montan de inmediato y su animación la hace el CSS.
 * Sin librerías ni mediciones de layout: solo un temporizador por tanda.
 */
export function usePresencePlaces<T extends { slug: string }>(
  items: readonly T[],
  exitMs = 220
): PresenceEntry<T>[] {
  const [entries, setEntries] = useState<PresenceEntry<T>[]>(() =>
    items.map((item) => ({ item, leaving: false }))
  );
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const incoming = new Set(items.map((item) => item.slug));
    setEntries((previous) => {
      const leaving = previous
        .filter((entry) => !entry.leaving && !incoming.has(entry.item.slug))
        .map((entry) => ({ item: entry.item, leaving: true }));

      if (leaving.length > 0) {
        const leavingSlugs = new Set(leaving.map((entry) => entry.item.slug));
        const timer = window.setTimeout(() => {
          setEntries((current) =>
            current.filter((entry) => !(entry.leaving && leavingSlugs.has(entry.item.slug)))
          );
        }, exitMs);
        timers.current.push(timer);
      }

      return [...items.map((item) => ({ item, leaving: false })), ...leaving];
    });
  }, [items, exitMs]);

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
    },
    []
  );

  return entries;
}
