import cors from "cors";
import express, { type ErrorRequestHandler, type Express } from "express";
import helmet from "helmet";
import { z } from "zod";
import type { PlaceRepository } from "./repo/types";

const slugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);
const listQuerySchema = z.object({ category: slugSchema.optional() });

// Los datos cambian poco: el navegador y el service worker pueden reutilizarlos.
const CACHE_HEADER = "public, max-age=300, stale-while-revalidate=86400";

export interface AppOptions {
  /** Vacío = cualquier origen (solo desarrollo). */
  corsOrigins?: string[];
}

export function createApp(repo: PlaceRepository, options: AppOptions = {}): Express {
  const app = express();
  const origins = options.corsOrigins ?? [];

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: origins.length > 0 ? origins : true }));

  app.get("/api/health", async (_req, res) => {
    const ok = await repo.ping();
    res.status(ok ? 200 : 503).json({
      status: ok ? "ok" : "degraded",
      source: repo.source,
      time: new Date().toISOString(),
    });
  });

  app.get("/api/places", async (req, res, next) => {
    try {
      const query = listQuerySchema.safeParse(req.query);
      if (!query.success) {
        res.status(400).json({ error: "Parámetros inválidos", details: query.error.flatten() });
        return;
      }
      const data = await repo.list(query.data);
      res.set("Cache-Control", CACHE_HEADER).json({ data, meta: { count: data.length } });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/places/:slug", async (req, res, next) => {
    try {
      const slug = slugSchema.safeParse(req.params.slug);
      if (!slug.success) {
        res.status(400).json({ error: "Slug inválido" });
        return;
      }
      const place = await repo.getBySlug(slug.data);
      if (!place) {
        res.status(404).json({ error: "Lugar no encontrado" });
        return;
      }
      res.set("Cache-Control", CACHE_HEADER).json({ data: place });
    } catch (err) {
      next(err);
    }
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  };
  app.use(onError);

  return app;
}
