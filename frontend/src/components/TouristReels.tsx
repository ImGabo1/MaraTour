import { useState, useRef } from "react";
import { TOURIST_REELS, type TouristReel } from "../data/reels";
import {
  IconArrowLeft,
  IconArrowRight,
  IconClose,
  IconCompass,
  IconMapPin,
  IconPlay,
  IconVolume,
  IconVolumeMute,
  IconSparkles,
} from "./icons";

interface Props {
  onOpenPlace: (slug: string) => void;
  onShowOnMap?: (slug: string) => void;
}

export function TouristReels({ onOpenPlace, onShowOnMap }: Props) {
  const [activeVideo, setActiveVideo] = useState<TouristReel | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const openReel = (reel: TouristReel) => {
    if (reel.video) {
      setActiveVideo(reel);
      setIsMuted(false); // default unmute when user explicitly taps to watch
    } else {
      onOpenPlace(reel.slug);
    }
  };

  return (
    <section className="vm-reels-section" aria-label="Reels y sitios turísticos de Maracaibo">
      <div className="vm-reels-container">
        {/* Controles de navegación en desktop */}
        <div className="vm-reels-header">
          <span className="vm-reels-badge">
            <IconSparkles width={14} height={14} />
            Sitios Turísticos en Video y Foto
          </span>
          <div className="vm-reels-arrows" aria-hidden="true">
            <button
              type="button"
              className="vm-reels-arrow-btn"
              onClick={() => scroll("left")}
              aria-label="Anterior"
            >
              <IconArrowLeft width={18} height={18} />
            </button>
            <button
              type="button"
              className="vm-reels-arrow-btn"
              onClick={() => scroll("right")}
              aria-label="Siguiente"
            >
              <IconArrowRight width={18} height={18} />
            </button>
          </div>
        </div>

        {/* Carrusel horizontal de tarjetas / reels tipo Canva / App */}
        <div className="vm-reels-track" ref={scrollRef}>
          {TOURIST_REELS.map((reel) => {
            const hasVideo = Boolean(reel.video);
            return (
              <article
                key={reel.id}
                className={`vm-reel-card${hasVideo ? " vm-reel-card--video" : ""}`}
                onClick={() => openReel(reel)}
              >
                <div className="vm-reel-card__media">
                  <img
                    src={reel.image}
                    alt={reel.title}
                    loading="lazy"
                    decoding="async"
                    className="vm-reel-card__img"
                  />
                  <div className="vm-reel-card__overlay" />

                  {/* Botón de reproducción destacado (estilo Canva) */}
                  {hasVideo ? (
                    <button
                      type="button"
                      className="vm-reel-card__play"
                      aria-label={`Ver video de ${reel.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openReel(reel);
                      }}
                    >
                      <span className="vm-reel-card__play-pulse" />
                      <IconPlay width={24} height={24} />
                    </button>
                  ) : (
                    <div className="vm-reel-card__photo-badge">
                      <IconMapPin width={16} height={16} />
                    </div>
                  )}

                  {/* Badge superior (Video Reel o Monumento) */}
                  <span className="vm-reel-card__tag">{reel.badge || reel.tag}</span>
                </div>

                <div className="vm-reel-card__info">
                  <span className="vm-reel-card__category">{reel.tag}</span>
                  <h3 className="vm-reel-card__title">{reel.title}</h3>
                  <p className="vm-reel-card__subtitle">{reel.subtitle}</p>

                  <div className="vm-reel-card__actions">
                    <button
                      type="button"
                      className="vm-reel-card__btn vm-reel-card__btn--primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPlace(reel.slug);
                      }}
                    >
                      Ver sitio
                    </button>
                    {hasVideo && (
                      <button
                        type="button"
                        className="vm-reel-card__btn vm-reel-card__btn--secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReel(reel);
                        }}
                      >
                        <IconPlay width={14} height={14} />
                        Video
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal / Reproductor de Video Reel */}
      {activeVideo && (
        <div
          className="vm-video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Video de ${activeVideo.title}`}
        >
          <div
            className="vm-video-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="vm-video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label="Cerrar video"
            >
              <IconClose width={20} height={20} />
            </button>

            <div className="vm-video-modal-player-wrap">
              <video
                ref={videoPlayerRef}
                src={activeVideo.video}
                poster={activeVideo.image}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                controls
                className="vm-video-modal-player"
              />

              <button
                type="button"
                className="vm-video-modal-mute"
                onClick={() => {
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.muted = !videoPlayerRef.current.muted;
                    setIsMuted(videoPlayerRef.current.muted);
                  }
                }}
                aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              >
                {isMuted ? <IconVolumeMute width={18} height={18} /> : <IconVolume width={18} height={18} />}
              </button>
            </div>

            <div className="vm-video-modal-footer">
              <div className="vm-video-modal-copy">
                <span className="vm-video-modal-tag">{activeVideo.tag}</span>
                <h3 className="vm-video-modal-title">{activeVideo.title}</h3>
                <p className="vm-video-modal-desc">{activeVideo.subtitle}</p>
              </div>

              <div className="vm-video-modal-buttons">
                <button
                  type="button"
                  className="vm-btn vm-btn--primary"
                  onClick={() => {
                    const slug = activeVideo.slug;
                    setActiveVideo(null);
                    onOpenPlace(slug);
                  }}
                >
                  <IconCompass width={16} height={16} />
                  Ver detalles del lugar
                </button>
                {onShowOnMap && (
                  <button
                    type="button"
                    className="vm-btn vm-btn--soft"
                    onClick={() => {
                      const slug = activeVideo.slug;
                      setActiveVideo(null);
                      onShowOnMap(slug);
                    }}
                  >
                    <IconMapPin width={16} height={16} />
                    Ver en mapa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
