import { useMemo, useState } from "react";
import { categoryBySlug } from "../data/categories";
import { googleMapsRouteUrl } from "../lib/maps";
import { optimizeRoute, estimateVisitMinutes } from "../lib/route";
import type { Place } from "../types";
import { Cover } from "../components/Cover";
import {
  CategoryIcon,
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconClock,
  IconCompass,
  IconExternal,
  IconHeart,
  IconMapPin,
  IconRotate,
  IconRoute,
  IconShare,
  IconSparkles,
} from "../components/icons";

interface Props {
  places: readonly Place[];
  saved: readonly string[];
  onOpenPlace: (slug: string) => void;
  onRemove: (slug: string) => void;
  onReorder: (slugs: string[]) => void;
}

/** Mi ruta: los lugares guardados, reordenables, optimizados y listos para Google Maps. */
export function RoutePage({ places, saved, onOpenPlace, onRemove, onReorder }: Props) {
  const [copied, setCopied] = useState(false);
  const bySlug = useMemo(() => new Map(places.map((place) => [place.slug, place])), [places]);
  const ordered = useMemo(
    () => saved.map((slug) => bySlug.get(slug)).filter((place): place is Place => Boolean(place)),
    [saved, bySlug]
  );
  const totalMinutes = useMemo(
    () => ordered.reduce((total, place) => total + estimateVisitMinutes(place), 0),
    [ordered]
  );
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const next = ordered.map((place) => place.slug);
    const current = next[index];
    const other = next[target];
    if (!current || !other) return;
    next[index] = other;
    next[target] = current;
    onReorder(next);
  };

  const optimize = () => {
    if (ordered.length < 3) return;
    onReorder(optimizeRoute(ordered));
  };

  const share = async () => {
    // Compartimos el recorrido real en Google Maps: el orden de Mi ruta vive en este
    // dispositivo, así que un enlace a #/mi-ruta no llevaría las paradas al destinatario.
    const url = googleMapsRouteUrl(ordered);
    const text = `Mi ruta por Maracaibo: ${ordered.map((place) => place.name).join(" → ")}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mi ruta por Maracaibo", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* el usuario canceló o el navegador no permite compartir */
    }
  };

  return (
    <main className="vm-page vm-route">
      <section className="vm-page-hero vm-page-hero--route">
        <div className="container">
          <p className="vm-kicker">
            <IconHeart width={15} height={15} />
            Tu recorrido
          </p>
          <h1 className="vm-page-hero__title">
            Mi ruta por <span>Maracaibo</span>
          </h1>
          <p className="vm-page-hero__lead">
            Los lugares que guardaste, en el orden que tú elijas. Optimiza por cercanía, compártela
            o ábrela directamente en Google Maps.
          </p>
        </div>
      </section>

      <div className="container vm-route__layout">
        {ordered.length === 0 ? (
          <div className="vm-empty vm-empty--route">
            <span className="vm-empty__icon" aria-hidden="true">
              <IconRoute width={32} height={32} />
            </span>
            <h2>Tu ruta está esperando</h2>
            <p>
              Explora Maracaibo y toca el corazón de los lugares que te gusten. Aquí los tendrás
              todos, listos para ordenar y compartir.
            </p>
            <a className="vm-btn vm-btn--primary" href="#/explorar">
              Explorar lugares
              <IconArrowRight width={16} height={16} />
            </a>
          </div>
        ) : (
          <>
            <section className="vm-route__summary">
              <div className="vm-route__stats">
                <div>
                  <span className="vm-route__stat-icon">
                    <IconMapPin width={19} height={19} />
                  </span>
                  <span>
                    <b>{ordered.length}</b>
                    <small>{ordered.length === 1 ? "parada" : "paradas"}</small>
                  </span>
                </div>
                <div>
                  <span className="vm-route__stat-icon">
                    <IconClock width={19} height={19} />
                  </span>
                  <span>
                    <b>
                      {hours > 0 ? `${hours} h` : ""} {minutes > 0 ? `${minutes} min` : ""}
                    </b>
                    <small>tiempo estimado</small>
                  </span>
                </div>
                <div>
                  <span className="vm-route__stat-icon">
                    <IconRotate width={19} height={19} />
                  </span>
                  <span>
                    <b>{ordered.filter((place) => place.panoUrl).length}</b>
                    <small>con vista 360°</small>
                  </span>
                </div>
              </div>

              <div className="vm-route__tools">
                <button type="button" className="vm-btn vm-btn--soft" onClick={optimize} disabled={ordered.length < 3}>
                  <IconSparkles width={16} height={16} />
                  Optimizar por cercanía
                </button>
                <a
                  className="vm-btn vm-btn--dark"
                  href={googleMapsRouteUrl(ordered)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir en Google Maps
                  <IconExternal width={16} height={16} />
                </a>
                <button type="button" className="vm-btn vm-btn--ghost" onClick={share}>
                  <IconShare width={16} height={16} />
                  {copied ? "Enlace copiado" : "Compartir"}
                </button>
              </div>
            </section>

            <section className="vm-route__list" aria-label="Paradas de Mi ruta">
              {ordered.map((place, index) => {
                const category = categoryBySlug(place.category);
                return (
                  <article key={place.slug} className="vm-route-stop">
                    <span className="vm-route-stop__number">{index + 1}</span>
                    <button
                      type="button"
                      className="vm-route-stop__open"
                      onClick={() => onOpenPlace(place.slug)}
                    >
                      <span className="vm-route-stop__media">
                        <Cover place={place} className="vm-route-stop__cover" />
                      </span>
                      <span className="vm-route-stop__body">
                        <span className="vm-route-stop__eyebrow">
                          {category && (
                            <span
                              className="vm-route-stop__cat"
                              style={{ ["--from" as string]: category.from, ["--to" as string]: category.to }}
                            >
                              <CategoryIcon name={category.icon} width={12} height={12} />
                              {place.categoryName}
                            </span>
                          )}
                          {place.panoUrl && (
                            <span className="vm-route-stop__pano">
                              <IconRotate width={12} height={12} />
                              360°
                            </span>
                          )}
                        </span>
                        <strong>{place.name}</strong>
                        <small>
                          <IconMapPin width={13} height={13} />
                          {place.address}
                        </small>
                        <span className="vm-route-stop__time">
                          <IconClock width={13} height={13} />
                          {estimateVisitMinutes(place)} min de visita
                        </span>
                      </span>
                      <IconArrowRight width={18} height={18} />
                    </button>

                    <div className="vm-route-stop__actions">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={`Subir ${place.name}`}
                      >
                        <IconArrowUp width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === ordered.length - 1}
                        aria-label={`Bajar ${place.name}`}
                      >
                        <IconArrowDown width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        className="vm-route-stop__remove"
                        onClick={() => onRemove(place.slug)}
                        aria-label={`Quitar ${place.name} de Mi ruta`}
                      >
                        <IconHeart width={16} height={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="vm-route__next">
              <span className="vm-route__next-icon" aria-hidden="true">
                <IconCompass width={24} height={24} />
              </span>
              <div>
                <p className="vm-kicker">¿Quieres más ideas?</p>
                <h2>Deja que el planificador te sorprenda</h2>
                <p>
                  Cuéntanos cuántos días tienes y qué te gusta, y armamos una ruta completa con
                  comidas y tips.
                </p>
              </div>
              <a className="vm-btn vm-btn--primary" href="#/plan">
                Armar otro plan
                <IconSparkles width={16} height={16} />
              </a>
            </aside>
          </>
        )}
      </div>
    </main>
  );
}
