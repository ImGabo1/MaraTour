import { useEffect, useRef, useState } from "react";
import type { WelcomeSlide } from "../data/welcome";
import { useI18n } from "../i18n/I18nProvider";
import { IconArrowLeft, IconArrowRight, IconCamera, IconHeart, IconMapPin, IconSparkles } from "./icons";

interface Props {
  slides: readonly WelcomeSlide[];
  onOpenPlace: (slug: string) => void;
}

/**
 * Carrusel principal de la portada.
 * Avanza solo, se pausa al pasar el mouse o al enfocar y responde a flechas,
 * puntos y gestos de deslizamiento.
 */
export function HomeCarousel({ slides, onOpenPlace }: Props) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    if (paused || total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % total);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused, total]);

  const go = (step: number) => setActive((index) => (index + step + total) % total);
  const current = slides[active];

  if (!current) return null;

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX ?? null;
    touchStart.current = null;
    if (start === null || end === null) return;
    if (Math.abs(end - start) < 48) return;
    go(end < start ? 1 : -1);
  };

  return (
    <div
      className={`vmh-carousel${paused ? " is-paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Postales de Maracaibo"
    >
      <div className="vmh-carousel__stage" aria-live="polite">
        {slides.map((slide, index) => {
          const isActive = index === active;
          return (
            <figure
              key={slide.src}
              className={`vmh-carousel__slide${isActive ? " is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={`${slide.title} · ${slide.caption}`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="vmh-carousel__shade" aria-hidden="true" />
              <figcaption>
                <span className="vmh-carousel__kicker">
                  <IconMapPin width={13} height={13} />
                  {slide.kicker}
                </span>
                <strong>{slide.title}</strong>
                <p>{slide.caption}</p>
                {slide.slug && (
                  <button
                    type="button"
                    className="vmh-carousel__cta"
                    onClick={() => onOpenPlace(slide.slug!)}
                  >
                    {t("places.details")}
                    <IconArrowRight width={15} height={15} />
                  </button>
                )}
              </figcaption>
            </figure>
          );
        })}

        <span className="vmh-carousel__badge">
          <IconCamera width={14} height={14} />
          Postal {active + 1}/{total}
        </span>

        <button
          type="button"
          className="vmh-carousel__arrow vmh-carousel__arrow--prev"
          onClick={() => go(-1)}
          aria-label="Postal anterior"
        >
          <IconArrowLeft width={19} height={19} />
        </button>
        <button
          type="button"
          className="vmh-carousel__arrow vmh-carousel__arrow--next"
          onClick={() => go(1)}
          aria-label="Postal siguiente"
        >
          <IconArrowRight width={19} height={19} />
        </button>

        <div className="vmh-carousel__progress" aria-hidden="true">
          <span key={active} />
        </div>
      </div>

      <div className="vmh-carousel__rail" role="tablist" aria-label="Elige una postal">
        {slides.map((slide, index) => (
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

      <p className="vmh-carousel__hint">
        <IconSparkles width={13} height={13} />
        Desliza o usa las flechas para recorrer Maracaibo.
        <IconHeart width={13} height={13} />
      </p>
    </div>
  );
}
