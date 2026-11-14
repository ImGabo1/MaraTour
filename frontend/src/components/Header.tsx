import { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { LANGUAGES } from "../i18n/messages";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useModal } from "../hooks/useModal";
import type { Page } from "../hooks/usePageRoute";
import { initials, type AuthSession } from "../lib/auth";
import { LanguagePicker } from "./LanguagePicker";
import { ThemeToggle } from "./ThemeToggle";
import {
  IconBook,
  IconCalendar,
  IconChat,
  IconClose,
  IconCompass,
  IconDownload,
  IconGlobe,
  IconHome,
  IconLogout,
  IconMapPin,
  IconMenu,
  IconShare,
  IconUser,
} from "./icons";
import "./Header.css";

interface Props {
  page: Page;
  savedCount?: number;
  onOpenChat?: () => void;
  session: AuthSession;
  onLogout: () => void;
}

const NAV: readonly {
  page: Page;
  key: "nav.home" | "nav.explore" | "nav.planner" | "nav.dictionary" | "nav.saved";
  icon: typeof IconHome;
}[] = [
  { page: "inicio", key: "nav.home", icon: IconHome },
  { page: "explorar", key: "nav.explore", icon: IconCompass },
  { page: "plan", key: "nav.planner", icon: IconCalendar },
  { page: "diccionario", key: "nav.dictionary", icon: IconBook },
  { page: "mi-ruta", key: "nav.saved", icon: IconMapPin },
];

export function Header({ page, savedCount = 0, onOpenChat, session, onLogout }: Props) {
  const { lang, t } = useI18n();
  const { mode, install } = useInstallPrompt();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const currentLanguage = LANGUAGES.find((language) => language.code === lang);

  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  // Transparente arriba; al bajar, la barra se vuelve vidrio.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onInstall = () => (mode === "prompt" ? install() : setIosHelp(true));

  return (
    <>
      <header className={`mt-topbar${scrolled ? " is-scrolled" : ""}`}>
        <div className="mt-topbar__bar">
          {/* Capa de vidrio: aparece con un fundido al hacer scroll (solo opacity). */}
          <div className="mt-topbar__glass glass glass-strong" aria-hidden="true" />

          <a className="mt-brand mt-focusable" href="#/inicio" aria-label={`MaraTour · ${t("nav.home")}`}>
            <img className="mt-brand__mark" src="/img/logo-emblema-192.png" alt="" width={44} height={44} />
            <span className="mt-brand__text">
              <strong>
                Mara<span>Tour</span>
              </strong>
              <small>Visita Maracaibo</small>
            </span>
          </a>

          <nav className="mt-nav" aria-label={t("nav.home")}>
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = page === item.page;
              return (
                <a
                  key={item.page}
                  href={`#/${item.page}`}
                  className={`mt-focusable${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon width={18} height={18} />
                  <span>{t(item.key)}</span>
                  {item.page === "mi-ruta" && savedCount > 0 && (
                    <b className="mt-nav__count" aria-label={`${savedCount}`}>
                      {savedCount}
                    </b>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="mt-actions">
            <ThemeToggle variant="switch" className="mt-actions__theme" />

            <button
              type="button"
              className="mt-pill mt-press mt-focusable mt-actions__lang"
              onClick={() => setLanguageOpen(true)}
              aria-label={`${t("nav.language")}: ${currentLanguage?.native ?? "Español"}`}
              aria-haspopup="dialog"
            >
              <IconGlobe width={18} height={18} />
              <span>{currentLanguage?.native ?? "Español"}</span>
            </button>

            {onOpenChat && (
              <button
                type="button"
                className="mt-pill mt-pill--icon mt-press mt-focusable mt-actions__chat"
                onClick={onOpenChat}
                aria-label={t("nav.chat")}
                title={t("nav.chat")}
              >
                <IconChat width={20} height={20} />
              </button>
            )}

            <button
              type="button"
              className="mt-install mt-press mt-focusable mt-actions__install"
              onClick={onInstall}
              aria-label="Descargar MaraTour en tu dispositivo"
              title="Descargar MaraTour en tu dispositivo"
            >
              <IconDownload width={18} height={18} />
              <span>{t("nav.installShort")}</span>
            </button>

            <div className="mt-user" title={session.kind === "guest" ? "Sesión de invitado" : session.email}>
              <span className="mt-user__avatar" aria-hidden="true">
                {session.kind === "guest" ? <IconUser width={18} height={18} /> : initials(session.name)}
              </span>
              <span className="mt-user__name">{session.name}</span>
            </div>

            <button
              type="button"
              className="mt-pill mt-pill--icon mt-press mt-focusable mt-actions__logout"
              onClick={onLogout}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <IconLogout width={18} height={18} />
            </button>

            <button
              type="button"
              className="mt-pill mt-pill--icon mt-press mt-focusable mt-actions__menu"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mt-drawer"
              aria-label={menuOpen ? t("common.close") : t("nav.more")}
            >
              {menuOpen ? <IconClose width={20} height={20} /> : <IconMenu width={20} height={20} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mt-drawer" onClick={() => setMenuOpen(false)}>
          <nav
            id="mt-drawer"
            className="mt-drawer__panel glass glass-strong mt-reveal"
            aria-label={t("nav.more")}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="mt-drawer__who">
              <span className="mt-user__avatar" aria-hidden="true">
                {session.kind === "guest" ? <IconUser width={18} height={18} /> : initials(session.name)}
              </span>
              <span>
                <strong>{session.name}</strong>
                <small>{session.kind === "guest" ? "Sesión de invitado" : session.email}</small>
              </span>
            </p>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setLanguageOpen(true);
              }}
            >
              <IconGlobe width={20} height={20} />
              <span>
                {t("nav.language")}: {currentLanguage?.native ?? "Español"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onInstall();
              }}
            >
              <IconDownload width={20} height={20} />
              <span>{t("nav.install")}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenChat?.();
              }}
            >
              <IconChat width={20} height={20} />
              <span>{t("nav.chat")}</span>
            </button>
            <button
              type="button"
              className="mt-drawer__logout"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              <IconLogout width={20} height={20} />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      )}

      {/* Barra inferior fija (móvil y tablet). */}
      <nav className="mt-tabbar glass glass-strong" aria-label={t("nav.home")}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = page === item.page;
          return (
            <a
              key={item.page}
              href={`#/${item.page}`}
              className={`mt-press mt-focusable${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="mt-tabbar__icon">
                <Icon width={22} height={22} />
                {item.page === "mi-ruta" && savedCount > 0 && (
                  <b className="mt-nav__count" aria-label={`${savedCount}`}>
                    {savedCount}
                  </b>
                )}
              </span>
              <span>{t(item.key)}</span>
            </a>
          );
        })}
      </nav>

      {languageOpen && <LanguagePicker onClose={() => setLanguageOpen(false)} />}
      {iosHelp && <IosInstallHelp onClose={() => setIosHelp(false)} />}
    </>
  );
}

function IosInstallHelp({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const closeRef = useModal<HTMLButtonElement>(onClose);
  return (
    <div className="mt-modal" onClick={onClose}>
      <div
        className="mt-modal__card glass glass-strong mt-reveal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="ios-title" className="mt-modal__title">
          {t("ios.title")}
        </h2>
        <ol className="mt-modal__steps">
          <li>{t("ios.step1")}</li>
          <li>
            {t("ios.step2")}
            <IconShare width={18} height={18} className="mt-modal__inline-icon" />
          </li>
          <li>{t("ios.step3")}</li>
        </ol>
        <button ref={closeRef} type="button" className="mt-install mt-press mt-focusable" onClick={onClose}>
          {t("common.gotIt")}
        </button>
        <button
          type="button"
          className="mt-pill mt-pill--icon mt-press mt-focusable mt-modal__close"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <IconClose width={18} height={18} />
        </button>
      </div>
    </div>
  );
}
