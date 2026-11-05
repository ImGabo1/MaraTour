import { useEffect, useRef, useState } from "react";
import { WELCOME_SLIDES } from "../data/welcome";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCamera,
  IconCompass,
  IconHeart,
  IconMapPin,
  IconSparkles,
  IconSun,
  IconUsers,
} from "../components/icons";

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

export function WelcomePage({ onLogin, onRegister, onGuest }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const total = WELCOME_SLIDES.length;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % total), 5200);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const go = (step: number) => setActive((index) => (index + step + total) % total);

  return (
    <main className="vm-welcome">
      <div className="vm-welcome__sky" aria-hidden="true">
        <div className="vm-welcome__sun">
          <span className="vm-welcome__sun-halo" />
          <span className="vm-welcome__sun-core" />
          <span className="vm-welcome__sun-ray vm-welcome__sun-ray--1" />
          <span className="vm-welcome__sun-ray vm-welcome__sun-ray--2" />
          <span className="vm-welcome__sun-ray vm-welcome__sun-ray--3" />
        </div>
        <div className="vm-welcome__cloud vm-welcome__cloud--1" />
        <div className="vm-welcome__cloud vm-welcome__cloud--2" />
        <div className="vm-welcome__cloud vm-welcome__cloud--3" />
        <div className="vm-welcome__birds">
          <span>⌄</span>
          <span>⌄</span>
          <span>⌄</span>
        </div>
        <div className="vm-welcome__horizon">
          <span className="vm-welcome__water" />
          <svg viewBox="0 0 1440 190" preserveAspectRatio="none" className="vm-welcome__bridge">
            <path d="M0 120C210 96 330 60 470 58s230 46 430 18 300-36 540 6" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M180 104V48M196 102V48M660 72V28M676 70V28M1120 72V32M1136 70V32" stroke="currentColor" strokeWidth="4" />
            <path d="M0 130C210 106 330 70 470 68s230 46 430 18 300-36 540 6" fill="none" stroke="currentColor" strokeWidth="1.6" opacity=".55" />
          </svg>
          <span className="vm-welcome__skyline">
            <i /><i /><i /><i /><i /><i /><i /><i /><i />
          </span>
        </div>
      </div>

      <header className="vm-welcome__top container">
        <a className="vm-welcome__brand" href="#/bienvenida" aria-label="Maratur · Visita Maracaibo">
          <span className="vm-welcome__brand-mark" aria-hidden="true">
            <IconSun width={23} height={23} />
          </span>
          <span>
            <strong>Maratur</strong>
            <small>Visita Maracaibo</small>
          </span>
        </a>
        <div className="vm-welcome__top-actions">
          <span className="vm-welcome__badge">
            <IconMapPin width={14} height={14} />
            Zulia · Venezuela
          </span>
          <button type="button" className="vm-btn vm-btn--soft" onClick={onLogin}>
            Ya tengo cuenta
            <IconArrowRight width={16} height={16} />
          </button>
        </div>
      </header>

      <section className="vm-welcome__hero container">
        <p className="vm-welcome__kicker">
          <IconSparkles width={16} height={16} />
          Tu guía local, hecha en Maracaibo
        </p>
        <h1 className="vm-welcome__title">
          Maracaibo se disfruta
          <span>a todo Color</span>
        </h1>
        <p className="vm-welcome__lead">
          Descubre la Chinita, el lago, el puente y los sabores que solo se entienden viviéndolos.
          Crea tu cuenta y arma tu ruta con un plan hecho a tu medida.
        </p>

        <div className="vm-welcome__actions">
          <button type="button" className="vm-btn vm-btn--primary vm-btn--xl" onClick={onRegister}>
            Crear mi cuenta
            <IconArrowRight width={18} height={18} />
          </button>
          <button type="button" className="vm-btn vm-btn--soft vm-btn--xl" onClick={onLogin}>
            <IconCompass width={18} height={18} />
            Ingresar
          </button>
          <button type="button" className="vm-welcome__guest" onClick={onGuest}>
            Explorar como invitado
          </button>
        </div>

        <ul className="vm-welcome__perks" aria-label="Lo que encontrarás en Maratur">
          <li>
            <IconCamera width={16} height={16} />
            Fotos y 360° reales
          </li>
          <li>
            <IconSparkles width={16} height={16} />
            Plan experto en segundos
          </li>
          <li>
            <IconHeart width={16} height={16} />
            Guarda tu ruta
          </li>
          <li>
            <IconUsers width={16} height={16} />
            Para toda la familia
          </li>
        </ul>
      </section>

      <section className="vm-welcome__carousel container" aria-label="Postales de Maracaibo">
        <div
          className={`vm-carousel${paused ? " is-paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="vm-carousel__stage" ref={stageRef} aria-live="polite">
            {WELCOME_SLIDES.map((slide, index) => (
              <figure
                key={slide.src}
                className={`vm-carousel__slide${index === active ? " is-active" : ""}`}
                aria-hidden={index !== active}
              >
                <img src={slide.src} alt={`${slide.title} · ${slide.caption}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                <figcaption>
                  <span>{slide.kicker}</span>
                  <strong>{slide.title}</strong>
                  <p>{slide.caption}</p>
                </figcaption>
              </figure>
            ))}
            <button type="button" className="vm-carousel__arrow vm-carousel__arrow--prev" onClick={() => go(-1)} aria-label="Postal anterior">
              <IconArrowLeft width={20} height={20} />
            </button>
            <button type="button" className="vm-carousel__arrow vm-carousel__arrow--next" onClick={() => go(1)} aria-label="Postal siguiente">
              <IconArrowRight width={20} height={20} />
            </button>
          </div>

          <div className="vm-carousel__rail" role="tablist" aria-label="Elige una postal">
            {WELCOME_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={index === active}
                className={index === active ? "is-active" : undefined}
                onClick={() => setActive(index)}
                title={slide.title}
              >
                <img src={slide.src} alt="" loading="lazy" decoding="async" />
                <span>{slide.title}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="vm-welcome__carousel-note">
          <IconHeart width={14} height={14} />
          Hecho para quienes quieren conocer Maracaibo sin perderse nada.
        </p>
      </section>

      <footer className="vm-welcome__footer container">
        <p>
          <IconSun width={15} height={15} />
          Maratur · turismo local con sabor zuliano
        </p>
        <span>Un proyecto para disfrutar la ciudad a todo color.</span>
      </footer>
    </main>
  );
}
