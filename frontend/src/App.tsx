import { useEffect, useMemo, useState } from "react";
import { ChatWidget } from "./components/ChatWidget";
import { Header } from "./components/Header";
import { OfflineBanner } from "./components/OfflineBanner";
import { PanoViewer } from "./components/PanoViewer";
import { PlaceSheet } from "./components/PlaceSheet";
import { IconBridge, IconChat, IconSparkles } from "./components/icons";
import { type CategoryFilter } from "./lib/places";
import { useHashRoute } from "./hooks/useHashRoute";
import { useOnline } from "./hooks/useOnline";
import { usePageRoute } from "./hooks/usePageRoute";
import { usePlaces } from "./hooks/usePlaces";
 HEAD
import { useI18n } from "./i18n/I18nProvider";
import { onSavedChange, readSaved, toggleSavedList, writeSaved } from "./lib/favorites";
import { mergePlaces, primaryCategory } from "./lib/places";
import { recordVisit } from "./lib/popularity";
import { DictionaryPage } from "./pages/DictionaryPage";
import { ExplorePage } from "./pages/ExplorePage";
import { HomePage } from "./pages/HomePage";
import { PlannerPage } from "./pages/PlannerPage";
import { RoutePage } from "./pages/RoutePage";

import { matchesQuery } from "./lib/search";
 
import type { Place } from "./types";

type ExploreView = "grid" | "map";

export default function App() {
  const { places: apiPlaces, source, loading } = usePlaces();
  const online = useOnline();
  const route = useHashRoute();
  const { page, navigate } = usePageRoute();
  const { t } = useI18n();

HEAD
  const places = useMemo(() => mergePlaces(apiPlaces), [apiPlaces]);
  const [saved, setSaved] = useState<string[]>(readSaved);

  const [category, setCategory] = useState<string>("todos");
  const [query, setQuery] = useState<string>("");
  const [mapFocus, setMapFocus] = useState<string | null>(null);

  const [pano, setPano] = useState<Place | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [exploreQuery, setExploreQuery] = useState("");
  const [exploreCategory, setExploreCategory] = useState<CategoryFilter>(null);
  const [exploreView, setExploreView] = useState<ExploreView>("grid");
  const [exploreKey, setExploreKey] = useState(0);

  const openPlace = places.find((place) => place.slug === route.slug) ?? null;

HEAD
  useEffect(() => onSavedChange(setSaved), []);

  const visible = useMemo(() => {
    const byCategory = category === "todos" ? places : places.filter((p) => p.category === category);
    return byCategory.filter((p) => matchesQuery(p, query));
  }, [places, category, query]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  const open = (slug: string) => {
    recordVisit(slug);
    route.open(slug);
  };

  const toggleSave = (slug: string) => {
    setSaved((previous) => {
      const next = toggleSavedList(previous, slug);
      writeSaved(next);
      return next;
    });
  };

  const savePlan = (slugs: readonly string[]) => {
    setSaved((previous) => {
      const next = [...new Set([...previous, ...slugs])];
      writeSaved(next);
      return next;
    });
  };

  const reorder = (slugs: string[]) => {
    setSaved(slugs);
    writeSaved(slugs);
  };

  const openPano = (place: Place) => {
    recordVisit(place.slug);
    setPano(place);
  };

  const openChat = () => setChatOpen(true);

  const startExplore = (category: CategoryFilter, query = "", view: ExploreView = "grid") => {
    setExploreCategory(category);
    setExploreQuery(query);
    setExploreView(view);
    setExploreKey((key) => key + 1);
    navigate("explorar");
  };

  const showOnMap = (slug: string) => {
    const place = places.find((item) => item.slug === slug);
    setExploreCategory(place ? primaryCategory(place) : null);
    setExploreQuery("");
    setExploreView("map");
    setExploreKey((key) => key + 1);
    // Reemplaza la ficha en el historial: «atrás» vuelve a la página anterior, no al lugar.
    window.location.replace(`${window.location.pathname}${window.location.search}#/explorar`);
  };

  return (
    <>
      <Header page={page} savedCount={saved.length} onOpenChat={openChat} />
      <OfflineBanner online={online} source={source} />

      <div id="top">
        {page === "inicio" && (
          <HomePage
            places={places}
            saved={saved}
            loading={loading}
            onOpenPlace={open}
            onToggleSave={toggleSave}
            onNavigate={navigate}
            onOpenCategory={(category) => startExplore(category)}
            onSearch={(query) => startExplore(null, query)}
            onOpenChat={openChat}
          />
        )}

        {page === "explorar" && (
          <ExplorePage
            key={`${exploreCategory ?? "todo"}-${exploreQuery}-${exploreView}-${exploreKey}`}
            places={places}
            saved={saved}
            loading={loading}
            initialQuery={exploreQuery}
            initialCategory={exploreCategory}
            initialView={exploreView}
            onOpenPlace={open}
            onToggleSave={toggleSave}
          />
        )}

        {page === "plan" && (
          <PlannerPage
            places={places}
            saved={saved}
            onOpenPlace={open}
            onSavePlan={savePlan}
            onNavigate={navigate}
          />
        )}

        {page === "diccionario" && <DictionaryPage />}

        {page === "mi-ruta" && (
          <RoutePage
            places={places}
            saved={saved}
            onOpenPlace={open}
            onRemove={toggleSave}
            onReorder={reorder}
          />
        )}
      </div>

      <footer className="vm-footer">
        <div className="container vm-footer__grid">
          <div className="vm-footer__brand">
            <span className="vm-footer__mark" aria-hidden="true">
              <IconBridge width={24} height={24} />
            </span>
            <div>
              <strong>Visita Maracaibo</strong>
              <p>{t("footer.tagline")}</p>
            </div>
          </div>

          <nav className="vm-footer__nav" aria-label={t("nav.home")}>
            <a href="#/inicio">{t("nav.home")}</a>
            <a href="#/explorar">{t("nav.explore")}</a>
            <a href="#/plan">{t("nav.planner")}</a>
            <a href="#/diccionario">{t("nav.dictionary")}</a>
            <a href="#/mi-ruta">{t("nav.saved")}</a>
          </nav>

          <div className="vm-footer__help">
            <p className="vm-kicker">¿Necesitas una mano?</p>
            <p>Pregúntale a Zulmita por lugares, comida o cómo moverte.</p>
            <button type="button" className="vm-btn vm-btn--soft" onClick={openChat}>
              <IconChat width={16} height={16} />
              Hablar con Zulmita
            </button>
          </div>
 HEAD
        </div>
        <div className="container vm-footer__legal">
          <p>{t("footer.university")}</p>
          <p>
            <IconSparkles width={13} height={13} />
            {t("footer.draft")}
          </p>

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

      {openPlace && (
        <PlaceSheet
          key={openPlace.slug}
          place={openPlace}
          places={places}
          saved={saved.includes(openPlace.slug)}
          onClose={route.close}
          onOpenPano={openPano}
          onToggleSave={toggleSave}
          onOpenPlace={open}
          onShowOnMap={showOnMap}
        />
      )}

      {pano && pano.panoUrl && (
        <PanoViewer src={pano.panoUrl} title={pano.name} onClose={() => setPano(null)} />
      )}

      {chatOpen && (
        <ChatWidget
          places={places}
          onClose={() => setChatOpen(false)}
          onOpenPlace={open}
          onNavigate={navigate}
        />
      )}
    </>
  );
}
