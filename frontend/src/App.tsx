import { useEffect, useMemo, useState } from "react";
import { ChatWidget } from "./components/ChatWidget";
import { Header } from "./components/Header";
import { OfflineBanner } from "./components/OfflineBanner";
import { PanoViewer } from "./components/PanoViewer";
import { PlaceSheet } from "./components/PlaceSheet";
import { IconBridge, IconChat, IconSparkles } from "./components/icons";
import { useHashRoute } from "./hooks/useHashRoute";
import { useOnline } from "./hooks/useOnline";
import { usePageRoute, type Page } from "./hooks/usePageRoute";
import { usePlaces } from "./hooks/usePlaces";
import { useI18n } from "./i18n/I18nProvider";
import {
  onSavedChange,
  readSaved,
  storageKeyFor,
  toggleSavedList,
  transferGuestSavedToUser,
  writeSaved,
} from "./lib/favorites";
import { withMedia } from "./data/media";
import { mergePlaces, primaryCategory, type CategoryFilter } from "./lib/places";
import { recordVisit } from "./lib/popularity";
import {
  clearSession,
  guestSession,
  readSession,
  writeSession,
  type AuthSession,
} from "./lib/auth";
import { AuthPage } from "./pages/AuthPage";
import { DictionaryPage } from "./pages/DictionaryPage";
import { ExplorePage } from "./pages/ExplorePage";
import { HomePage } from "./pages/HomePage";
import { PlannerPage } from "./pages/PlannerPage";
import { RoutePage } from "./pages/RoutePage";
import { WelcomePage } from "./pages/WelcomePage";
import type { Place } from "./types";

type ExploreView = "grid" | "map";

const AUTH_PAGES = new Set(["bienvenida", "entrar", "registro"]);

export default function App() {
  const { places: apiPlaces, source, loading } = usePlaces();
  const online = useOnline();
  const route = useHashRoute();
  const { page, navigate } = usePageRoute();
  const { t } = useI18n();
  const [session, setSession] = useState<AuthSession | null>(readSession);
  const activeKey = storageKeyFor(session);

  const places = useMemo(() => mergePlaces(apiPlaces).map(withMedia), [apiPlaces]);
  const [saved, setSaved] = useState<string[]>(() => readSaved(activeKey));

  const [pano, setPano] = useState<Place | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [exploreQuery, setExploreQuery] = useState("");
  const [exploreCategory, setExploreCategory] = useState<CategoryFilter>(null);
  const [exploreView, setExploreView] = useState<ExploreView>("grid");
  const [exploreKey, setExploreKey] = useState(0);

  const openPlace = places.find((place) => place.slug === route.slug) ?? null;
  const signedIn = session !== null;
  const viewPage = signedIn && AUTH_PAGES.has(page) ? "inicio" : page;

  useEffect(() => {
    setSaved(readSaved(activeKey));
  }, [activeKey]);

  useEffect(() => onSavedChange(activeKey, setSaved), [activeKey]);

  useEffect(() => {
    if (signedIn && AUTH_PAGES.has(page)) navigate("inicio");
  }, [signedIn, page, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [viewPage]);

  const open = (slug: string) => {
    recordVisit(slug);
    route.open(slug);
  };

  const toggleSave = (slug: string) => {
    setSaved((previous) => {
      const next = toggleSavedList(previous, slug);
      writeSaved(next, activeKey);
      return next;
    });
  };

  const savePlan = (slugs: readonly string[]) => {
    setSaved((previous) => {
      const next = [...new Set([...previous, ...slugs])];
      writeSaved(next, activeKey);
      return next;
    });
  };

  const reorder = (slugs: string[]) => {
    setSaved(slugs);
    writeSaved(slugs, activeKey);
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

  const handleAuthenticated = (next: AuthSession) => {
    writeSession(next);
    if (next.kind === "user") {
      transferGuestSavedToUser(next.email);
    }
    const nextKey = storageKeyFor(next);
    setSession(next);
    setSaved(readSaved(nextKey));
    route.close();
    navigate("inicio");
  };

  const handleGuest = () => {
    handleAuthenticated(guestSession());
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setSaved(readSaved(storageKeyFor(null)));
    setPano(null);
    setChatOpen(false);
    navigate("bienvenida");
  };

  if (!signedIn) {
    if (page === "entrar" || page === "registro") {
      return (
        <AuthPage
          mode={page}
          onAuthenticated={handleAuthenticated}
          onGuest={handleGuest}
        />
      );
    }
    return (
      <WelcomePage
        onLogin={() => navigate("entrar")}
        onRegister={() => navigate("registro")}
        onGuest={handleGuest}
      />
    );
  }

  return (
    <>
      <Header
        page={viewPage}
        savedCount={saved.length}
        onOpenChat={openChat}
        session={session}
        onLogout={handleLogout}
      />
      <OfflineBanner online={online} source={source} />

      <div id="top">
        {viewPage === "inicio" && (
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

        {viewPage === "explorar" && (
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

        {viewPage === "plan" && (
          <PlannerPage
            places={places}
            saved={saved}
            session={session}
            onOpenPlace={open}
            onSavePlan={savePlan}
            onNavigate={navigate}
          />
        )}

        {viewPage === "diccionario" && <DictionaryPage />}

        {viewPage === "mi-ruta" && (
          <RoutePage
            places={places}
            saved={saved}
            session={session}
            onOpenPlace={open}
            onRemove={toggleSave}
            onReorder={reorder}
            onNavigate={(page) => navigate(page as Page)}
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
        </div>
        <div className="container vm-footer__legal">
          <p>{t("footer.university")}</p>
          <p>
            <IconSparkles width={13} height={13} />
            {t("footer.draft")}
          </p>
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
