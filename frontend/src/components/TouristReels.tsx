import { useCallback, useEffect, useRef, useState } from "react";
import { TOURIST_REELS, type TouristReel } from "../data/reels";
import { useModal } from "../hooks/useModal";
import {
  IconArrowLeft,
  IconArrowRight,
  IconClose,
  IconCompass,
  IconMapPin,
  IconPlay,
  IconSparkles,
  IconVolume,
  IconVolumeMute,
} from "./icons";
import "./TouristReels.css";

interface Props {
  onOpenPlace: (slug: string) => void;
  onShowOnMap?: (slug: string) => void;
}

interface ModalProps {
  reel: TouristReel;
  onClose: () => void;
  onOpenPlace: (slug: string) => void;
  onShowOnMap?: (slug: string) => void;
}

/** Reproductor de un reel con video: Escape cierra y el foco vuelve a la tarjeta. */
function ReelModal({ reel, onClose, onOpenPlace, onShowOnMap }: ModalProps) {
  const closeRef = useModal<HTMLButtonElement>(onClose);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false); // el usuario tocó para verlo: arranca con sonido

  return (
    <div className="mtr-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Video de ${reel.title}`}>
      <div className="mtr-modal__card" onClick={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="mtr-icon mtr-modal__close mt-press" onClick={onClose} aria-label="Cerrar video">
          <IconClose width={20} height={20} />
        </button>

        <div className="mtr-modal__player">
          <video
            ref={videoRef}
            src={reel.video}
            poster={reel.image}
            autoPlay
            loop
            playsInline
            muted={muted}
            controls
          />
          <button
            type="button"
            className="mtr-icon mtr-modal__mute mt-press"
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              video.muted = !video.muted;
              setMuted(video.muted);
            }}
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? <IconVolumeMute width={18} height={18} /> : <IconVolume width={18} height={18} />}
          </button>
        </div>

        <div className="mtr-modal__footer">
          <div className="mtr-modal__copy">
            <span className="mtr-tag mtr-tag--sun">{reel.tag}</span>
            <h3>{reel.title}</h3>
            <p>{reel.subtitle}</p>
          </div>
          <div className="mtr-modal__buttons">
            <button type="button" className="mt-btn mt-btn--primary" onClick={() => { onClose(); onOpenPlace(reel.slug); }}>
              <IconCompass width={16} height={16} />
              Ver detalles del lugar
            </button>
            {onShowOnMap && (
              <button type="button" className="mt-btn mt-btn--soft" onClick={() => { onClose(); onShowOnMap(reel.slug); }}>
                <IconMapPin width={16} height={16} />
                Ver en mapa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Reels turísticos: tarjetas 9:16 con scroll-snap, barra de progreso y navegación con teclado. */
export function TouristReels({ onOpenPlace, onShowOnMap }: Props) {
  const [activeVideo, setActiveVideo] = useState<TouristReel | null>(null);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);

  const updateProgress = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max > 0 ? track.scrollLeft / max : 1);
  }, []);

  useEffect(() => {
    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => window.removeEventListener("resize", updateProgress);
  }, [updateProgress]);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? 240) + 16;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const openReel = (reel: TouristReel) => {
    if (reel.video) setActiveVideo(reel);
    else onOpenPlace(reel.slug);
  };

  return (
    <section className="mtr" aria-label="Reels y sitios turísticos de Maracaibo">
      <div className="mt-container">
        <div className="mtr__head">
          <span className="mtr__badge">
            <IconSparkles width={14} height={14} />
            Sitios turísticos en video y foto
          </span>
          <div className="mtr__arrows">
            <button type="button" className="mtr-icon mt-press" onClick={() => scroll(-1)} aria-label="Anterior">
              <IconArrowLeft width={18} height={18} />
            </button>
            <button type="button" className="mtr-icon mt-press" onClick={() => scroll(1)} aria-label="Siguiente">
              <IconArrowRight width={18} height={18} />
            </button>
          </div>
        </div>

        <ul
          className="mtr__track"
          ref={trackRef}
          tabIndex={0}
          aria-label="Reels: usa las flechas del teclado para avanzar"
          onScroll={updateProgress}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowRight") {
              event.preventDefault();
              scroll(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              scroll(-1);
            }
          }}
        >
          {TOURIST_REELS.map((reel) => {
            const hasVideo = Boolean(reel.video);
            return (
              <li key={reel.id} className="mtr__item">
                <article className="mtr-card mt-lift">
                  <div className="mtr-card__media">
                    <img src={reel.image} alt="" loading="lazy" decoding="async" />
                    <span className="mtr-card__scrim" aria-hidden="true" />
                    <span className={`mtr-tag${hasVideo ? "" : " mtr-tag--red"}`}>{reel.badge || reel.tag}</span>
                    {hasVideo && (
                      <button
                        type="button"
                        className="mtr-card__play mt-press"
                        aria-label={`Ver video de ${reel.title}`}
                        onClick={() => openReel(reel)}
                      >
                        <IconPlay width={24} height={24} />
                      </button>
                    )}
                    <div className="mtr-card__info">
                      <span className="mtr-card__category">{reel.tag}</span>
                      <h3>{reel.title}</h3>
                      <p>{reel.subtitle}</p>
                      <button type="button" className="mt-btn mt-btn--soft mt-btn--sm mtr-card__cta" onClick={() => onOpenPlace(reel.slug)}>
                        Ver sitio
                        <IconArrowRight width={15} height={15} />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mtr__progress" role="progressbar" aria-label="Avance de los reels" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <span style={{ transform: `scaleX(${Math.max(0.08, progress)})` }} />
        </div>
      </div>

      {activeVideo && (
        <ReelModal reel={activeVideo} onClose={() => setActiveVideo(null)} onOpenPlace={onOpenPlace} onShowOnMap={onShowOnMap} />
      )}
    </section>
  );
}
