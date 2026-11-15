import { useCallback, useEffect, useRef, useState } from "react";
import { categoryBySlug } from "../data/categories";
import type { WelcomeSlide } from "../data/welcome";
import { useI18n } from "../i18n/I18nProvider";
import { primaryCategory } from "../lib/places";
import type { Place } from "../types";
import { IconArrowLeft, IconArrowRight, IconCamera, IconMapPin } from "./icons";

interface Props {
  slides: readonly WelcomeSlide[];
  /** Catálogo: permite mostrar la categoría y la zona reales de cada postal. */
  places?: readonly Place[];
  onOpenPlace: (slug: string) => void;
}

const AUTOPLAY_MS = 5200;

export function HomeCarousel({ slides, places = [], onOpenPlace }: Props) {
  const { t } = useI18n();
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
    const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    viewport.scrollTo({ left: card.offsetLeft - pad, behavior: "smooth" });
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

  const activeRef = useRef(0);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (total < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (pausedRef.current || document.hidden) return;
      const viewport = viewportRef.current;
      const atEnd = viewport ? viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4 : false;
      const next = atEnd ? 0 : Math.min(activeRef.current + 1, total - 1);
      setActive(next);
      scrollToIndex(next);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [scrollToIndex, total]);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>("[data-carousel-card]"));
    if (!cards.length) return;
    // Postal más a la izquierda visible; al llegar al final, la última.
    if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4) {
      setActive(cards.length - 1);
      return;
    }
    const pad = parseFloat(getComputedStyle(viewport).paddingLeft) || 0;
    const left = viewport.scrollLeft + pad;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const current = Math.abs(card.offsetLeft - left);
      if (current < distance) {
        distance = current;
        nearest = index;
      }
    });
    setActive(nearest);
  };

  const placeBySlug = new Map(places.map((place) => [place.slug, place]));
  const arrows = (
    <>
      <button type="button" className="mth-carousel__arrow" onClick={() => go(-1)} aria-label={t("home.carousel.prev")}>
        <IconArrowLeft width={18} height={18} />
      </button>
      <button type="button" className="mth-carousel__arrow" onClick={() => go(1)} aria-label={t("home.carousel.next")}>
        <IconArrowRight width={18} height={18} />
      </button>
    </>
  );

  return (
    <section
      className={`mth-carousel${paused ? " is-paused" : ""}`}
      aria-roledescription="carousel"
      aria-label={t("home.carousel.aria")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mth-carousel__head">
        <h2 className="mth-carousel__title">
          <span className="mth-carousel__camera" aria-hidden="true">
            <IconCamera width={22} height={22} />
          </span>
          {t("home.carousel.title")}
          <small>
            <i aria-hidden="true">–</i> {t("home.carousel.eyebrow")}
          </small>
        </h2>

        <div className="mth-carousel__controls">
          <span className="mth-carousel__count" aria-live="polite">
            {pad(active)} <i>/</i> {pad(total - 1)}
          </span>
          {arrows}
        </div>
      </div>

      <div className="mth-carousel__stage">
        <button
          type="button"
          className="mth-carousel__side mth-carousel__side--prev"
          onClick={() => go(-1)}
          aria-label={t("home.carousel.prev")}
          tabIndex={-1}
          aria-hidden="true"
        >
          <IconArrowLeft width={18} height={18} />
        </button>
        <div
          ref={viewportRef}
          className="mth-carousel__viewport"
          onScroll={handleScroll}
          role="region"
          aria-label={t("home.carousel.aria")}
          tabIndex={0}
        >
          {slides.map((slide, index) => {
            const place = slide.slug ? placeBySlug.get(slide.slug) : undefined;
            const category = place ? categoryBySlug(primaryCategory(place)) : undefined;
            const zone = place?.address.split(/[,(]/)[0]?.trim();
            return (
              <article
                key={`${slide.slug ?? slide.title}-${index}`}
                data-carousel-card={index}
                className={`mth-carousel__slide${index === active ? " is-active" : ""}`}
              >
                <div className="mth-carousel__media">
                  <img
                    src={slide.src}
                    alt={`${slide.title} · ${slide.caption}`}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span className="mth-carousel__scrim" aria-hidden="true" />
                  <span className="mth-carousel__badge">
                    <IconMapPin width={12} height={12} />
                    {category ? t(category.nameKey) : slide.kicker}
                  </span>
                  <span className="mth-carousel__num" aria-hidden="true">
                    {pad(index)}
                  </span>
                  <div className="mth-carousel__body">
                    <div className="mth-carousel__text">
                      <h3>{slide.title}</h3>
                      <p>{slide.caption}</p>
                      {zone ? (
                        <span className="mth-carousel__where">
                          <IconMapPin width={14} height={14} />
                          {zone}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="mth-carousel__cta"
                      onClick={() => slide.slug && onOpenPlace(slide.slug)}
                      aria-label={t("home.carousel.seeAria", { name: slide.title })}
                    >
                      {t("home.carousel.see")}
                      <IconArrowRight width={15} height={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <button
          type="button"
          className="mth-carousel__side mth-carousel__side--next"
          onClick={() => go(1)}
          aria-label={t("home.carousel.next")}
          tabIndex={-1}
          aria-hidden="true"
        >
          <IconArrowRight width={18} height={18} />
        </button>
      </div>

      <div className="mth-carousel__dots" role="tablist" aria-label={t("home.carousel.dots")}>
        {slides.map((slide, index) => (
          <button
            key={`dot-${slide.slug ?? slide.title}-${index}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={t("home.carousel.goTo", { name: slide.title })}
            className={index === active ? "is-active" : ""}
            onClick={() => goTo(index)}
          />
        ))}
      </div>

      <p className="mth-carousel__hint">{t("home.carousel.hint")}</p>
    </section>
  );
}
