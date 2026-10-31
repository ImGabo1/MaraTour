import { useCallback, useEffect, useRef, useState } from "react";
import { useModal } from "../hooks/useModal";
import { IconClose, IconPhone } from "./icons";

interface Props {
  src: string;
  title: string;
  onClose: () => void;
}

type GyroState = "off" | "on" | "denied";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Visor panorámico sin librerías: dibuja la imagen en un <canvas> repetida en horizontal.
 * - Arrastrar con el dedo o el mouse, o flechas ← → con el teclado.
 * - Giroscopio (mover el teléfono). En iPhone pide permiso y requiere HTTPS.
 * - Giro lento automático hasta que el usuario interactúa (se respeta "reducir movimiento").
 *
 * Es una aproximación cilíndrica. Para una esfera real (arriba/abajo, zoom, modo visor VR)
 * el siguiente paso es Photo Sphere Viewer o three.js + WebXR (ver docs/PLAN_7_DIAS.md).
 */
export function PanoViewer({ src, title, onClose }: Props) {
  const closeRef = useModal<HTMLButtonElement>(onClose);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const view = useRef({ x: 0, pitch: 0, idle: true });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [gyro, setGyro] = useState<GyroState>("off");
  const gyroSupported =
    typeof window !== "undefined" &&
    "DeviceOrientationEvent" in window &&
    window.matchMedia("(pointer: coarse)").matches;

  // Cargar la imagen
  useEffect(() => {
    setStatus("loading");
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setStatus(img.naturalWidth > 0 ? "ready" : "error");
    };
    img.onerror = () => setStatus("error");
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // Bucle de dibujo
  useEffect(() => {
    if (status !== "ready") return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(wrap.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(wrap.clientHeight * dpr));
    };
    resize();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (observer) observer.observe(wrap);
    else window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const img = imgRef.current;
      const v = view.current;
      if (img && img.naturalHeight > 0) {
        const h = canvas.height * 1.3;
        const w = img.naturalWidth * (h / img.naturalHeight);
        if (w > 0) {
          if (v.idle && !reduceMotion) v.x += (dt / 1000) * (w / 60); // vuelta completa en ~60 s
          const maxShift = (h - canvas.height) / 2;
          v.pitch = clamp(v.pitch, -maxShift, maxShift);
          const y = -maxShift + v.pitch;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let x = -(((v.x % w) + w) % w); x < canvas.width; x += w) {
            ctx.drawImage(img, x, y, w, h);
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [status]);

  // Giroscopio
  useEffect(() => {
    if (gyro !== "on") return;
    let lastAlpha: number | null = null;
    const onOrientation = (e: DeviceOrientationEvent) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      if (!canvas || !img || img.naturalHeight === 0) return;
      const v = view.current;
      v.idle = false;
      const h = canvas.height * 1.3;
      const w = img.naturalWidth * (h / img.naturalHeight);
      if (e.alpha != null) {
        if (lastAlpha != null) {
          let d = e.alpha - lastAlpha;
          if (d > 180) d -= 360;
          if (d < -180) d += 360;
          v.x -= d * (w / 360);
        }
        lastAlpha = e.alpha;
      }
      if (e.beta != null) {
        const tilt = clamp(e.beta - 90, -45, 45) / 45;
        v.pitch = tilt * ((h - canvas.height) / 2);
      }
    };
    window.addEventListener("deviceorientation", onOrientation);
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [gyro]);

  const toggleGyro = useCallback(async () => {
    if (gyro === "on") {
      setGyro("off");
      return;
    }
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    try {
      if (typeof DOE.requestPermission === "function") {
        const result = await DOE.requestPermission(); // iPhone: debe venir de un toque
        if (result !== "granted") {
          setGyro("denied");
          return;
        }
      }
      setGyro("on");
    } catch {
      setGyro("denied");
    }
  }, [gyro]);

  const pxRatio = () => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    return wrap && canvas && wrap.clientWidth > 0 ? canvas.width / wrap.clientWidth : 1;
  };

  return (
    <div className="pano" role="dialog" aria-modal="true" aria-label={`Vista 360° de ${title}`}>
      <div
        ref={wrapRef}
        className="pano__stage"
        tabIndex={0}
        onPointerDown={(e) => {
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
          view.current.idle = false;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          const r = pxRatio();
          view.current.x -= (e.clientX - d.x) * r;
          view.current.pitch += (e.clientY - d.y) * r;
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") view.current.x -= 80;
          if (e.key === "ArrowRight") view.current.x += 80;
          view.current.idle = false;
        }}
      >
        <canvas ref={canvasRef} className="pano__canvas" role="img" aria-label={`Panorámica de ${title}`} />
        {status === "loading" && <p className="pano__msg">Cargando vista 360°…</p>}
        {status === "error" && (
          <p className="pano__msg">No se pudo cargar la vista 360°. Revisa tu conexión e inténtalo de nuevo.</p>
        )}
      </div>

      <div className="pano__top">
        <span className="pano__title">{title} · 360°</span>
        <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar vista 360°">
          <IconClose />
        </button>
      </div>

      <div className="pano__bottom">
        <span className="pano__hint">
          <IconPhone width={16} height={16} />
          {gyro === "on" ? "Mueve el teléfono para mirar alrededor" : "Arrastra para mirar alrededor"}
        </span>
        {gyroSupported && (
          <button type="button" className="btn btn--light" onClick={toggleGyro} aria-pressed={gyro === "on"}>
            {gyro === "on" ? "Usar el dedo" : "Usar movimiento del teléfono"}
          </button>
        )}
        {gyro === "denied" && (
          <span className="pano__hint pano__hint--warn">
            Sin permiso de movimiento. Actívalo en los ajustes del navegador o sigue arrastrando.
          </span>
        )}
      </div>
    </div>
  );
}
