import { useCallback, useEffect, useRef, useState } from "react";
import type { WelcomeSlide } from "../data/welcome";
import { IconArrowLeft, IconArrowRight, IconCompass, IconMapPin } from "./icons";

interface Props {
  slides: readonly WelcomeSlide[];
  onOpenPlace: (slug: string) => void;
}

const AUTOPLAY_MS = 5200;

export function HomeCarousel({ slides, onOpenPlace }: Props) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;
  const pad = (value: number) => String(value + 1).padStart(2, "0");

  const scrollToIndex = useCallback((index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector<HTMLElement>(`[data-carousel-card="${index}"]`);
    if (!card) return;
    viewport.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (!total) return;
      const next = ((index % total) + total) % total;
      setActive(next);
      scrollToIndex(next);
    },
    [scrollToIndex, total],
  );

  const go = (step: number) => goTo(active + step);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((current) => {
        const next = (current + 1) % total;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [scrollToIndex, total]);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>("[data-carousel-card]"));
    if (!cards.length) return;
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const current = Math.abs(cardCenter - center);
      if (current < distance) {
        distance = current;
        nearest = index;
      }
    });
    setActive(nearest);
  };

  return (
    <section
      className={`mth-carousel${paused ? " is-paused" : ""}`}
      aria-roledescription="carrusel"
      aria-label="Postales de la ciudad"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mth-carousel__head">
        <div className="mth-carousel__heading">
          <p className="mth-carousel__eyebrow">
            <IconCompass width={14} height={14} />
            Maracaibo, en imágenes
          </p>
          <h2 className="mth-carousel__title">Postales de la ciudad</h2>
        </div>

        <div className="mth-carousel__controls">
          <span className="mth-carousel__count" aria-live="polite">
            {pad(active)} <i>/</i> {pad(total - 1)}
          </span>
          <button
            type="button"
            className="mth-carousel__arrow"
            onClick={() => go(-1)}
            aria-label="Postal anterior"
          >
            <IconArrowLeft width={18} height={18} />
          </button>
          <button
            type="button"
            className="mth-carousel__arrow"
            onClick={() => go(1)}
            aria-label="Postal siguiente"
          >
            <IconArrowRight width={18} height={18} />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mth-carousel__viewport"
        onScroll={handleScroll}
        role="region"
        aria-live="polite"
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <article
            key={`${slide.slug ?? slide.title}-${index}`}
            data-carousel-card={index}
            className={`mth-carousel__slide${index === active ? " is-active" : ""}`}
          >
            <div className="mth-carousel__media">
              <img
                src={slide.src}
                alt={`${slide.title} · ${slide.caption}`}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className="mth-carousel__scrim" aria-hidden="true" />
              <span className="mth-carousel__badge">
                <IconMapPin width={12} height={12} />
                {slide.kicker}
              </span>
              <span className="mth-carousel__num" aria-hidden="true">
                {pad(index)}
              </span>
              <div className="mth-carousel__body">
                <h3>{slide.title}</h3>
                <p>{slide.caption}</p>
                <button
                  type="button"
                  className="mt-btn mt-btn--soft mt-btn--sm mth-carousel__cta"
                  onClick={() => slide.slug && onOpenPlace(slide.slug)}
                  aria-label={`Ver sitio: ${slide.title}`}
                >
                  Ver sitio
                  <IconArrowRight width={15} height={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mth-carousel__dots" role="tablist" aria-label="Seleccionar postal">
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.slug ?? slide.title}-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={`Ir a ${slide.title}`}
            className={index === active ? "is-active" : ""}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <p className="mth-carousel__hint">Desliza para descubrir más postales →</p>
    </section>
  );
}
