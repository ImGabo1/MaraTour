import { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nProvider";
import type { MessageKey } from "../i18n/messages";
import { ThemeToggle } from "../components/ThemeToggle";
import { WELCOME_SLIDES } from "../data/welcome";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCompass,
  IconMapPin,
  IconSparkles,
  IconSun,
  IconWave,
} from "../components/icons";
import "./welcome.css";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

const pad = (value: number) => String(value + 1).padStart(2, "0");
const FALLBACK_SLIDE = WELCOME_SLIDES[0]!;
const SLIDE_KEYS: Record<string, string> = {
  "basilica-chiquinquira": "basilica",
  "vereda-del-lago": "vereda",
  "puente-rafael-urdaneta": "puente",
  "plaza-baralt": "baralt",
  "teatro-baralt": "teatro",
  "plaza-monumento-chinita": "monumento",
  "galerias-mall": "galerias",
};

export function WelcomePage({ onLogin, onRegister, onGuest }: Props) {
  const { t } = useI18n();
  const slideText = (slide: (typeof WELCOME_SLIDES)[number], field: "kicker" | "caption") => {
    const id = slide.slug ? SLIDE_KEYS[slide.slug] : undefined;
    return id ? t(`shell.slide.${id}.${field}` as MessageKey) : slide[field];
  };
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = WELCOME_SLIDES.length;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % total);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const go = (step: number) =>
    setActive((index) => (index + step + total) % total);


  const side = (offset: number) => WELCOME_SLIDES[(active + offset) % total] ?? FALLBACK_SLIDE;

  return (
    <main className="mtw-page">
      <div className="mtw-bg" aria-hidden="true">
        <svg className="mtw-sun" viewBox="0 0 240 240" fill="none">
          <circle cx="120" cy="120" r="118" fill="var(--mt-sun-300)" opacity=".5" />
          <g stroke="var(--mt-sun-500)" strokeWidth="5" strokeLinecap="round">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="120" y1="22" x2="120" y2="40" transform={`rotate(${i * 30} 120 120)`} />
            ))}
          </g>
          <circle cx="120" cy="120" r="62" fill="var(--mt-sun-500)" />
        </svg>
        <svg className="mtw-bridge" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" fill="none">
          <g stroke="currentColor" strokeLinecap="round">
            <path d="M0 150H1200" strokeWidth="4" />
            <path d="M200 150L238 30H262L300 150" strokeWidth="4" />
            <path d="M520 150L568 10H632L680 150" strokeWidth="5" />
            <path d="M900 150L938 30H962L1000 150" strokeWidth="4" />
            <path d="M600 14L400 148M600 14L500 148M600 14L700 148M600 14L800 148" strokeWidth="1.2" />
          </g>
        </svg>
      </div>

      <header className="mtw-top">
        <div className="mtw-bar glass">
          <a className="mtw-brand" href="#/bienvenida" aria-label="MaraTour · Visita Maracaibo">
            <img src="/img/logo-emblema-192.png" alt="" width={44} height={44} />
            <span>
              <strong>Mara<b>Tour</b></strong>
              <small>Visita Maracaibo</small>
            </span>
          </a>
          <div className="mtw-bar__actions">
            <ThemeToggle variant="switch" className="mtw-theme" />
            <button type="button" className="mt-btn mt-btn--soft mtw-login" onClick={onLogin}>
              {t("shell.welcome.haveAccount")}
            </button>
          </div>
        </div>
      </header>

      <section className="mtw-hero">
        <div className="mtw-copy">
          <p className="mtw-kicker">
            <IconSun width={15} height={15} />
            {t("shell.welcome.kicker")}
          </p>
          <h1 className="mtw-title">
            Maracaibo
            <span>{t("shell.welcome.titleLine")}</span>
          </h1>
          <p className="mtw-lead">{t("shell.welcome.lead")}</p>

          <div className="mtw-actions">
            <button type="button" className="mt-btn mt-btn--primary mtw-cta" onClick={onRegister}>
              {t("shell.welcome.create")}
              <IconArrowRight width={18} height={18} />
            </button>
            <button type="button" className="mt-btn mt-btn--soft mtw-cta" onClick={onLogin}>
              <IconCompass width={18} height={18} />
              {t("shell.welcome.login")}
            </button>
            <button type="button" className="mtw-guest" onClick={onGuest}>
              {t("shell.guestExplore")}
            </button>
          </div>

          <ul className="mtw-perks">
            <li><IconSparkles width={14} height={14} />{t("shell.welcome.free")}</li>
            <li><IconMapPin width={14} height={14} />{t("shell.welcome.places", { n: 43 })}</li>
            <li><IconWave width={14} height={14} />{t("shell.welcome.saveRoute")}</li>
          </ul>
        </div>

        <div
          className="mtw-showcase"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => window.setTimeout(() => setPaused(false), 4000)}
        >
          <figure className="mtw-peek mtw-peek--a" aria-hidden="true">
            <img src={side(1).src} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="mtw-peek mtw-peek--b" aria-hidden="true">
            <img src={side(2).src} alt="" loading="lazy" decoding="async" />
          </figure>

          <div className="mtw-card" aria-live="polite">
            {WELCOME_SLIDES.map((slide, index) => (
              <figure
                key={`${slide.slug ?? slide.title}-${index}`}
                className={`mtw-slide${index === active ? " is-active" : ""}`}
                aria-hidden={index !== active}
              >
                <img
                  src={slide.src}
                  alt={`${slide.title} · ${slideText(slide, "caption")}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className="mtw-slide__scrim" />
                <span className="mtw-slide__tag">{slideText(slide, "kicker")}</span>
                <figcaption>
                  <strong>{slide.title}</strong>
                  <p>{slideText(slide, "caption")}</p>
                </figcaption>
              </figure>
            ))}
            <button type="button" className="mtw-arrow mtw-arrow--prev glass" onClick={() => go(-1)} aria-label={t("shell.welcome.prev")}>
              <IconArrowLeft width={18} height={18} />
            </button>
            <button type="button" className="mtw-arrow mtw-arrow--next glass" onClick={() => go(1)} aria-label={t("shell.welcome.next")}>
              <IconArrowRight width={18} height={18} />
            </button>
          </div>

          <div className="mtw-foot">
            <span className="mtw-count">{pad(active)} <i>/</i> {pad(total - 1)}</span>
            <div className="mtw-dots" role="tablist" aria-label={t("shell.welcome.pick")}>
              {WELCOME_SLIDES.map((slide, index) => (
                <button
                  key={`dot-${slide.slug ?? slide.title}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={t("shell.welcome.goTo", { title: slide.title })}
                  className={index === active ? "is-active" : ""}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <svg className="mtw-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40C240 90 480 0 720 40S1200 80 1440 30V80H0Z" />
      </svg>
    </main>
  );
}
