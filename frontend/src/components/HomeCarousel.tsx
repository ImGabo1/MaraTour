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
  const [portraitSlides, setPortraitSlides] = useState<Record<number, boolean>>({});
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
      className={`vmh-carousel${paused ? " is-paused" : ""}`}
      aria-roledescription="carrusel"
      aria-label="Postales de Maracaibo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="vmh-carousel__head">
        <div className="vmh-carousel__heading">
          <p className="vmh-carousel__eyebrow">
            <IconCompass width={13} height={13} />
            Postales de la ciudad
          </p>
          <h3 className="vmh-carousel__title">Maracaibo, en imágenes</h3>
        </div>

        <div className="vmh-carousel__controls">
          <span className="vmh-carousel__count" aria-live="polite">
            {pad(active)} <i>/</i> {pad(total - 1)}
          </span>
          <button
            type="button"
            className="vmh-carousel__arrow"
            onClick={() => go(-1)}
            aria-label="Postal anterior"
          >
            <IconArrowLeft width={18} height={18} />
          </button>
          <button
            type="button"
            className="vmh-carousel__arrow"
            onClick={() => go(1)}
            aria-label="Postal siguiente"
          >
            <IconArrowRight width={18} height={18} />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="vmh-carousel__viewport"
        onScroll={handleScroll}
        role="region"
        aria-live="polite"
        tabIndex={0}
      >
        {slides.map((slide, index) => (
          <article
            key={`${slide.slug ?? slide.title}-${index}`}
            data-carousel-card={index}
            className={`vmh-carousel__slide${index === active ? " is-active" : ""}`}
          >
            <div
              className={`vmh-carousel__media${portraitSlides[index] ? " is-portrait" : ""}`}
              style={{ backgroundImage: `url("${slide.src}")` }}
              aria-label={slide.title}
            >
              <img
                src={slide.src}
                alt={`${slide.title} · ${slide.caption}`}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                onLoad={(event) => {
                  const image = event.currentTarget;
                  setPortraitSlides((currentSlides) => {
                    const isPortrait = image.naturalHeight > image.naturalWidth;
                    if (currentSlides[index] === isPortrait) return currentSlides;
                    return { ...currentSlides, [index]: isPortrait };
                  });
                }}
              />
              <span className="vmh-carousel__badge">
                <IconMapPin width={12} height={12} />
                {slide.kicker}
              </span>
              <span className="vmh-carousel__num" aria-hidden="true">
                {pad(index)}
              </span>
            </div>

            <div className="vmh-carousel__body">
              <h4>{slide.title}</h4>
              <p>{slide.caption}</p>
              <button
                type="button"
                className="vmh-carousel__cta"
                onClick={() => slide.slug && onOpenPlace(slide.slug)}
              >
                Ver sitio
                <IconArrowRight width={15} height={15} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="vmh-carousel__dots" role="tablist" aria-label="Seleccionar postal">
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

      <p className="vmh-carousel__hint">Desliza para descubrir más postales →</p>
    </section>
  );
}
