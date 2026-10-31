import { useEffect, useState } from "react";
import { loadPlaces, type DataSource } from "../api";
import type { Place } from "../types";

interface State {
  places: Place[];
  source: DataSource | null;
  loading: boolean;
  error: boolean;
}

export function usePlaces(): State {
  const [state, setState] = useState<State>({ places: [], source: null, loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    loadPlaces()
      .then((r) => !cancelled && setState({ places: r.places, source: r.source, loading: false, error: false }))
      .catch(() => !cancelled && setState({ places: [], source: null, loading: false, error: true }));
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
