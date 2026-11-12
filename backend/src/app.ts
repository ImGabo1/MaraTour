import cors from "cors";
import express, { type ErrorRequestHandler, type Express } from "express";
import helmet from "helmet";
import { z } from "zod";
import { hashPassword, verifyPassword } from "./auth/password";
import type { PlaceRepository } from "./repo/types";
import { MemoryUserRepository } from "./repo/users-memory";
import { DuplicateUserError, type UserRecord, type UserRepository } from "./repo/users-types";

const slugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);
const listQuerySchema = z.object({
  category: slugSchema.optional(),
  // Búsqueda libre en español (nombre, descripción, etiquetas, historia, dirección).
  q: z.string().trim().min(1).max(80).optional(),
});

const emailSchema = z.string().trim().toLowerCase().email("Ese correo no parece válido.").max(320);
const registerSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre completo.").max(120),
  email: emailSchema,
  password: z.string().min(8, "Usa una contraseña de al menos 8 caracteres.").max(200),
});
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Escribe tu contraseña.").max(200),
});

// Los datos cambian poco: el navegador y el service worker pueden reutilizarlos.
const CACHE_HEADER = "public, max-age=300, stale-while-revalidate=86400";

export interface AppOptions {
  /** Vacío = cualquier origen (solo desarrollo). */
  corsOrigins?: string[];
  /** Sin repositorio explícito se usa memoria (tests y desarrollo sin base de datos). */
  userRepository?: UserRepository;
}

export function createApp(repo: PlaceRepository, options: AppOptions = {}): Express {
  const app = express();
  const origins = options.corsOrigins ?? [];
  const users = options.userRepository ?? new MemoryUserRepository();

  app.disable("x-powered-by");
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  const allowAny = origins.length === 0 || origins.includes("*");
  app.use(
    cors({
      origin: (origin, callback) => {
        if (allowAny || !origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, "");
        const allowed = origins.some((item) =>
          item.includes("*")
            ? new RegExp(`^${item.split("*").map(escapeRegExp).join("[a-z0-9-]+")}$`, "i").test(normalized)
            : item.toLowerCase() === normalized.toLowerCase()
        );
        callback(null, allowed);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Accept"],
      maxAge: 86400,
    })
  );
  app.use(express.json({ limit: "16kb" }));

  app.get("/api/health", async (_req, res) => {
    const ok = await repo.ping();
    res.status(ok ? 200 : 503).json({
      status: ok ? "ok" : "degraded",
      source: repo.source,
      authSource: users.source,
      time: new Date().toISOString(),
    });
  });

  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
        return;
      }

      const { name, email, password } = parsed.data;
      const passwordHash = await hashPassword(password);
      const user = await users.create({ name, email, passwordHash });
      res.status(201).json({ data: publicUser(user) });
    } catch (error) {
      if (error instanceof DuplicateUserError) {
        res.status(409).json({ error: "Ya existe una cuenta con ese correo. Inicia sesión." });
        return;
      }
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
        return;
      }

      const { email, password } = parsed.data;
      const user = await users.findByEmail(email);
      // Mismo mensaje para correo inexistente y contraseña incorrecta: no
      // revelamos qué correos están registrados.
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        res.status(401).json({ error: "Correo o contraseña incorrectos." });
        return;
      }

      await users.markLogin(user.id);
      res.json({ data: publicUser(user) });
    } catch (error) {
      next(error);
    }
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
    // Cuerpo JSON mal formado.
    if (err instanceof SyntaxError && "status" in err && err.status === 400) {
      res.status(400).json({ error: "El cuerpo de la petición no es JSON válido." });
      return;
    }

    // 42P01 = undefined_table. Es el error típico si falta correr 003_users.sql.
    if (typeof err === "object" && err !== null && "code" in err && err.code === "42P01") {
      res.status(503).json({
        error: "Falta la tabla de usuarios en la base de datos. Aplica la migración 003_users.sql.",
      });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  };
  app.use(onError);

  return app;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Datos públicos de la cuenta: nunca incluye passwordHash. */
function publicUser(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
