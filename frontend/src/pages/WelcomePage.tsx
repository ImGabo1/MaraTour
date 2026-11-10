import { useEffect, useState } from "react";
import { WELCOME_SLIDES } from "../data/welcome";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBoat,
  IconBridge,
  IconCamera,
  IconChinita,
  IconCoffee,
  IconCompass,
  IconMapPin,
  IconMusic,
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

export function WelcomePage({ onLogin, onRegister, onGuest }: Props) {
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

  const current = WELCOME_SLIDES[active] ?? FALLBACK_SLIDE;
  const miniOne = WELCOME_SLIDES[3] ?? FALLBACK_SLIDE;
  const miniTwo = WELCOME_SLIDES[1] ?? FALLBACK_SLIDE;

  return (
    <main className="vw-page">
      {/* ===== Fondo tropical animado ===== */}
      <div className="vw-bg" aria-hidden="true">
        <span className="vw-aurora vw-aurora--1" />
        <span className="vw-aurora vw-aurora--2" />
        <span className="vw-aurora vw-aurora--3" />

        <div className="vw-sun">
          <span className="vw-sun__glow" />
          <span className="vw-sun__rays" />
          <span className="vw-sun__core" />
        </div>

        <div className="vw-cloud vw-cloud--1" />
        <div className="vw-cloud vw-cloud--2" />
        <div className="vw-cloud vw-cloud--3" />

        <div className="vw-tokens">
          <span className="vw-token vw-token--1">
            <IconChinita width={22} height={22} />
          </span>
          <span className="vw-token vw-token--2">
            <IconBoat width={22} height={22} />
          </span>
          <span className="vw-token vw-token--3">
            <IconMusic width={20} height={20} />
          </span>
          <span className="vw-token vw-token--4">
            <IconCoffee width={20} height={20} />
          </span>
          <span className="vw-token vw-token--5">
            <IconCamera width={20} height={20} />
          </span>
          <span className="vw-token vw-token--6">
            <IconBridge width={22} height={22} />
          </span>
          <span className="vw-token vw-token--7">
            <IconSun width={20} height={20} />
          </span>
          <span className="vw-token vw-token--8">
            <IconWave width={22} height={22} />
          </span>
        </div>

        <div className="vw-lake">
          <span className="vw-lake__wave vw-lake__wave--1" />
          <span className="vw-lake__wave vw-lake__wave--2" />
          <svg
            className="vw-lake__bridge"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
          >
            <path
              d="M0 150C220 128 340 74 480 72s240 58 440 26 300-42 520 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              d="M210 132V58M226 130V58M690 92V32M706 90V32M1160 96V38M1176 94V38"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              d="M0 158C220 136 340 82 480 80s240 58 440 26 300-42 520 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity=".5"
            />
          </svg>
        </div>
      </div>

      {/* ===== Barra superior ===== */}
      <header className="vw-top container">
        <a className="vw-brand" href="#/bienvenida" aria-label="Maratour · Visita Maracaibo">
          <span className="vw-brand__mark" aria-hidden="true">
            <img src="/icons/icon.svg" alt="" width={44} height={44} />
          </span>
          <span className="vw-brand__text">
            <strong>Maratour</strong>
            <small>Visita Maracaibo</small>
          </span>
        </a>

        <div className="vw-top__actions">
          <span className="vw-top__tag">
            <IconSun width={14} height={14} />
            Tierra del Sol Amada
          </span>
          <button type="button" className="vw-btn vw-btn--ghost" onClick={onLogin}>
            Ya tengo cuenta
            <IconArrowRight width={15} height={15} />
          </button>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="vw-hero container">
        <div className="vw-copy">
          <p className="vw-kicker">
            <IconSparkles width={15} height={15} />
            Guía turística de Maracaibo
          </p>

          <h1 className="vw-title">
            Maracaibo
            <span>a todo color</span>
          </h1>

          <p className="vw-lead">
            La Chinita, el Puente sobre el Lago, la Calle Carabobo y los sabores
            que solo se entienden aquí. Descubre la ciudad y arma tu ruta.
          </p>

          <div className="vw-actions">
            <button type="button" className="vw-btn vw-btn--primary" onClick={onRegister}>
              Crear mi cuenta gratis
              <IconArrowRight width={18} height={18} />
            </button>
            <button type="button" className="vw-btn vw-btn--glass" onClick={onLogin}>
              <IconCompass width={18} height={18} />
              Ingresar
            </button>
            <button type="button" className="vw-guest" onClick={onGuest}>
              Explorar como invitado
            </button>
          </div>

          <ul className="vw-perks">
            <li>
              <IconSun width={14} height={14} />
              100% gratis
            </li>
            <li>
              <IconMapPin width={14} height={14} />
              43 lugares por descubrir
            </li>
            <li>
              <IconWave width={14} height={14} />
              Guarda tu ruta
            </li>
          </ul>
        </div>

        {/* ===== Postal principal + miniaturas ===== */}
        <div className="vw-showcase">
          <div
            className={`vw-postcard${paused ? " is-paused" : ""}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span className="vw-postcard__stamp">Maracaibo · Zulia</span>

            <div className="vw-postcard__stage" aria-live="polite">
              {WELCOME_SLIDES.map((slide, index) => (
                <figure
                  key={`${slide.slug ?? slide.title}-${index}`}
                  className={`vw-postcard__slide${index === active ? " is-active" : ""}`}
                  aria-hidden={index !== active}
                >
                  <img
                    src={slide.src}
                    alt={`${slide.title} · ${slide.caption}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="vw-postcard__shade" />
                  <figcaption>
                    <span className="vw-postcard__kicker">
                      <IconMapPin width={12} height={12} />
                      {slide.kicker}
                    </span>
                    <strong>{slide.title}</strong>
                    <p>{slide.caption}</p>
                  </figcaption>
                </figure>
              ))}

              <button
                type="button"
                className="vw-postcard__arrow vw-postcard__arrow--prev"
                onClick={() => go(-1)}
                aria-label="Postal anterior"
              >
                <IconArrowLeft width={18} height={18} />
              </button>
              <button
                type="button"
                className="vw-postcard__arrow vw-postcard__arrow--next"
                onClick={() => go(1)}
                aria-label="Postal siguiente"
              >
                <IconArrowRight width={18} height={18} />
              </button>
            </div>

            <div className="vw-postcard__foot">
              <span className="vw-postcard__count">
                {pad(active)} <i>/</i> {pad(total - 1)}
              </span>
              <div className="vw-postcard__dots" role="tablist" aria-label="Elige una postal">
                {WELCOME_SLIDES.map((slide, index) => (
                  <button
                    key={`dot-${slide.slug ?? slide.title}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={index === active}
                    aria-label={`Ir a ${slide.title}`}
                    className={index === active ? "is-active" : ""}
                    onClick={() => setActive(index)}
                  />
                ))}
              </div>
              <span className="vw-postcard__caption-line">{current.kicker}</span>
            </div>
          </div>

          <figure className="vw-minicard vw-minicard--one">
            <img src={miniOne.src} alt={miniOne.title} loading="lazy" decoding="async" />
            <figcaption>{miniOne.title}</figcaption>
          </figure>
          <figure className="vw-minicard vw-minicard--two">
            <img src={miniTwo.src} alt={miniTwo.title} loading="lazy" decoding="async" />
            <figcaption>{miniTwo.title}</figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
