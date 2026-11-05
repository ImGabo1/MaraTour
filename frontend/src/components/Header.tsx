import { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { LANGUAGES } from "../i18n/messages";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useModal } from "../hooks/useModal";
import type { Page } from "../hooks/usePageRoute";
import { initials, type AuthSession } from "../lib/auth";
import { LanguagePicker } from "./LanguagePicker";
import {
  IconBook,
  IconBridge,
  IconChat,
  IconClose,
  IconCompass,
  IconDownload,
  IconGlobe,
  IconHeart,
  IconHome,
  IconLogout,
  IconMenu,
  IconShare,
  IconSparkles,
  IconUser,
} from "./icons";

interface Props {
  page: Page;
  savedCount?: number;
  onOpenChat?: () => void;
  session: AuthSession;
  onLogout: () => void;
}

const NAV: readonly { page: Page; key: "nav.home" | "nav.explore" | "nav.planner" | "nav.dictionary" | "nav.saved"; icon: typeof IconHome }[] = [
  { page: "inicio", key: "nav.home", icon: IconHome },
  { page: "explorar", key: "nav.explore", icon: IconCompass },
  { page: "plan", key: "nav.planner", icon: IconSparkles },
  { page: "diccionario", key: "nav.dictionary", icon: IconBook },
  { page: "mi-ruta", key: "nav.saved", icon: IconHeart },
];

export function Header({ page, savedCount = 0, onOpenChat, session, onLogout }: Props) {
  const { lang, t } = useI18n();
  const { mode, install } = useInstallPrompt();
  const [languageOpen, setLanguageOpen] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLanguage = LANGUAGES.find((language) => language.code === lang);

  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  return (
    <>
      <header className="vm-header">
        <div className="vm-header__inner container">
          <a className="vm-brand" href="#/inicio" aria-label={`Visita Maracaibo · ${t("nav.home")}`}>
            <span className="vm-brand__mark" aria-hidden="true">
              <IconBridge width={23} height={23} />
            </span>
            <span className="vm-brand__text">
              <strong>Visita Maracaibo</strong>
              <span>Zulia · Venezuela</span>
            </span>
          </a>

          <nav className="vm-nav" aria-label={t("nav.home")}>
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.page}
                  href={`#/${item.page}`}
                  className={page === item.page ? "is-active" : undefined}
                  aria-current={page === item.page ? "page" : undefined}
                >
                  <Icon width={16} height={16} />
                  <span>{t(item.key)}</span>
                </a>
              );
            })}
          </nav>

          <div className="vm-header__actions">
            <div className="vm-user">
              <span className="vm-user__avatar" aria-hidden="true">
                {session.kind === "guest" ? <IconUser width={17} height={17} /> : initials(session.name)}
              </span>
              <span className="vm-user__copy">
                <strong>{session.name}</strong>
                <small>{session.kind === "guest" ? "Invitado" : session.email}</small>
              </span>
              <button type="button" className="vm-user__out" onClick={onLogout} aria-label="Cerrar sesión" title="Cerrar sesión">
                <IconLogout width={17} height={17} />
              </button>
            </div>

            <a
              className="vm-saved-btn"
              href="#/mi-ruta"
              aria-label={`${t("nav.saved")}${savedCount > 0 ? ` · ${savedCount}` : ""}`}
            >
              <IconHeart width={18} height={18} />
              <span>{t("nav.saved")}</span>
              {savedCount > 0 && <b>{savedCount}</b>}
            </a>

            <button
              type="button"
              className="vm-lang-btn"
              onClick={() => setLanguageOpen(true)}
              aria-label={`${t("nav.language")}: ${currentLanguage?.native ?? "Español"}`}
              aria-haspopup="dialog"
            >
              <IconGlobe width={17} height={17} />
              <span>{currentLanguage?.native ?? "Español"}</span>
            </button>

            {onOpenChat && (
              <button
                type="button"
                className="vm-chat-btn"
                onClick={onOpenChat}
                aria-label={t("nav.chat")}
                title={t("nav.chat")}
              >
                <IconChat width={18} height={18} />
              </button>
            )}

            {(mode === "prompt" || mode === "ios") && (
              <button
                type="button"
                className="vm-install-btn"
                onClick={() => (mode === "prompt" ? install() : setIosHelp(true))}
              >
                <IconDownload width={15} height={15} />
                <span>{t("nav.installShort")}</span>
              </button>
            )}

            <button
              type="button"
              className="vm-menu-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t("common.close") : t("nav.home")}
            >
              {menuOpen ? <IconClose width={21} height={21} /> : <IconMenu width={21} height={21} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="vm-drawer" onClick={() => setMenuOpen(false)}>
          <nav
            className="vm-drawer__panel"
            aria-label={t("nav.home")}
            onClick={(event) => event.stopPropagation()}
          >
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.page}
                  href={`#/${item.page}`}
                  className={page === item.page ? "is-active" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon width={19} height={19} />
                  <span>{t(item.key)}</span>
                </a>
              );
            })}
            <button
              type="button"
              className="vm-drawer__chat"
              onClick={() => {
                setMenuOpen(false);
                onOpenChat?.();
              }}
            >
              <IconChat width={19} height={19} />
              <span>{t("nav.chat")}</span>
            </button>
            <button
              type="button"
              className="vm-drawer__logout"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              <IconLogout width={19} height={19} />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      )}

      <nav className="vm-tabbar" aria-label={t("nav.home")}>
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.page}
              href={`#/${item.page}`}
              className={page === item.page ? "is-active" : undefined}
              aria-current={page === item.page ? "page" : undefined}
            >
              <Icon width={20} height={20} />
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
    <div className="overlay overlay--center" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="ios-title" className="dialog__title">
          {t("ios.title")}
        </h2>
        <ol className="dialog__steps">
          <li>{t("ios.step1")}</li>
          <li>
            {t("ios.step2")}
            <IconShare width={18} height={18} className="dialog__inline-icon" />
          </li>
          <li>{t("ios.step3")}</li>
        </ol>
        <button ref={closeRef} type="button" className="btn btn--dark" onClick={onClose}>
          {t("common.gotIt")}
        </button>
        <button
          type="button"
          className="icon-btn dialog__close"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <IconClose />
        </button>
      </div>
    </div>
  );
}
