import { useDeferredValue, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import { LANGUAGES } from "../i18n/messages";
import { useModal } from "../hooks/useModal";
import { normalizeText } from "../lib/places";
import { IconCheck, IconClose, IconGlobe, IconSearch } from "./icons";

export function LanguagePicker({ onClose }: { onClose: () => void }) {
  const { lang, setLang, t } = useI18n();
  const focusRef = useModal<HTMLInputElement>(onClose);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const needle = normalizeText(deferredQuery);
  const languages = LANGUAGES.filter((language) => {
    if (!needle) return true;
    return normalizeText(`${language.native} ${language.label} ${language.code}`).includes(needle);
  });

  return (
    <div className="overlay overlay--center" onClick={onClose}>
      <div
        className="language-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="language-sheet__head">
          <span className="language-sheet__icon" aria-hidden="true">
            <IconGlobe width={24} height={24} />
          </span>
          <div>
            <h2 id="language-title" className="language-sheet__title">
              {t("lang.title")}
            </h2>
            <p className="language-sheet__subtitle">{t("lang.subtitle")}</p>
          </div>
          <button type="button" className="icon-btn icon-btn--flat" onClick={onClose} aria-label={t("common.close")}>
            <IconClose />
          </button>
        </div>

        <label className="language-search">
          <IconSearch width={18} height={18} />
          <input
            ref={focusRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("lang.search")}
            aria-label={t("lang.search")}
          />
        </label>

        <div className="language-grid">
          {languages.map((language) => {
            const active = language.code === lang;
            return (
              <button
                key={language.code}
                type="button"
                className="language-option"
                aria-pressed={active}
                onClick={() => {
                  setLang(language.code);
                  onClose();
                }}
              >
                <span className="language-option__code" aria-hidden="true">
                  {language.code.toUpperCase()}
                </span>
                <span className="language-option__names">
                  <strong>{language.native}</strong>
                  <small>{language.label}</small>
                </span>
                {active && (
                  <span className="language-option__check" aria-hidden="true">
                    <IconCheck width={16} height={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {languages.length === 0 && <p className="explore-empty__hint">{t("lang.noResults")}</p>}
        <p className="language-sheet__soon">{t("lang.soon")}</p>
      </div>
    </div>
  );
}
