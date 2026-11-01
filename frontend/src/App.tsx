import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import { OfflineBanner } from "./components/OfflineBanner";
import { PanoViewer } from "./components/PanoViewer";
import { PlaceCard } from "./components/PlaceCard";
import { PlaceSheet } from "./components/PlaceSheet";
import { useHashRoute } from "./hooks/useHashRoute";
import { useOnline } from "./hooks/useOnline";
import { usePlaces } from "./hooks/usePlaces";
import { matchesQuery } from "./lib/search";
import type { Place } from "./types";

export default function App() {
  const { places, source, loading, error } = usePlaces();
  const online = useOnline();
  const route = useHashRoute();

  const [category, setCategory] = useState<string>("todos");
  const [query, setQuery] = useState<string>("");
  const [mapFocus, setMapFocus] = useState<string | null>(null);
  const [pano, setPano] = useState<Place | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of places) if (!seen.has(p.category)) seen.set(p.category, p.categoryName);
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }, [places]);

  const visible = useMemo(() => {
    const byCategory = category === "todos" ? places : places.filter((p) => p.category === category);
    return byCategory.filter((p) => matchesQuery(p, query));
  }, [places, category, query]);

  const openPlace = places.find((p) => p.slug === route.slug) ?? null;

  return (
    <>
      <Header />
      <OfflineBanner online={online} source={source} />

      <main id="top">
        <section className="hero">
          <span className="hero__blob hero__blob--a" aria-hidden="true" />
          <span className="hero__blob hero__blob--b" aria-hidden="true" />
          <div className="container hero__inner">
            <p className="eyebrow reveal" style={{ ["--i" as string]: 0 }}>
              Municipio Maracaibo · Zulia
            </p>
            <h1 className="hero__title reveal" style={{ ["--i" as string]: 1 }}>
              Maracaibo, a un toque
            </h1>
            <p className="hero__lead reveal" style={{ ["--i" as string]: 2 }}>
              Descubre sus lugares, conoce su historia y míralos en 360° desde tu teléfono. Instálala y úsala también
              sin conexión.
            </p>
            <div className="hero__cta reveal" style={{ ["--i" as string]: 3 }}>
              <a className="btn btn--amber" href="#mapa">
                Explorar el mapa
              </a>
              <a className="btn btn--outline" href="#lugares">
                Ver lugares
              </a>
            </div>
          </div>
        </section>

        <section id="mapa" className="section">
          <div className="container">
            <h2 className="section__title">Mapa de lugares</h2>
            <p className="section__lead">Toca un punto para ver el lugar y abrirlo en Google Maps.</p>
            {loading ? (
              <div className="skeleton" aria-busy="true" aria-label="Cargando mapa" />
            ) : (
              <MapView
                places={places}
                selectedSlug={mapFocus}
                onSelect={setMapFocus}
                onOpenPlace={route.open}
              />
            )}
          </div>
        </section>

        <section id="lugares" className="section section--tint">
          <div className="container">
            <h2 className="section__title">Lugares para visitar</h2>

            <div className="search">
              <label className="search__label" htmlFor="buscar">
                Buscar un lugar
              </label>
              <input
                id="buscar"
                className="search__input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, etiqueta o palabra: teatro, iglesia, atardecer…"
                autoComplete="off"
              />
            </div>

            {categories.length > 1 && (
              <div className="filters" role="group" aria-label="Filtrar por categoría">
                <button
                  type="button"
                  className="filter"
                  aria-pressed={category === "todos"}
                  onClick={() => setCategory("todos")}
                >
                  Todos
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    className="filter"
                    aria-pressed={category === c.slug}
                    onClick={() => setCategory(c.slug)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <p className="notice" role="alert">
                No pudimos cargar los lugares. Conéctate a internet y vuelve a intentarlo.
              </p>
            )}

            {!loading && !error && visible.length === 0 && (
              <p className="notice" role="status">
                No encontramos lugares para «{query.trim()}». Prueba con otra palabra o quita el filtro.
              </p>
            )}

            <div className="grid" key={category}>
              {visible.map((p, i) => (
                <PlaceCard key={p.slug} place={p} index={i} onOpen={route.open} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Proyecto universitario para impulsar el turismo en el municipio Maracaibo.</p>
          <p className="footer__small">Contenido preliminar: los textos y ubicaciones están en revisión.</p>
        </div>
      </footer>

      {openPlace && <PlaceSheet place={openPlace} onClose={route.close} onOpenPano={setPano} />}
      {pano && pano.panoUrl && <PanoViewer src={pano.panoUrl} title={pano.name} onClose={() => setPano(null)} />}
    </>
  );
}
