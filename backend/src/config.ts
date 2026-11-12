import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// .env en la raíz del repo (compartido) y, si existe, en backend/.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
// Neon CLI escribe las credenciales en .env.local (no sobreescribe .env).
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });
dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().optional(),
  DATABASE_SSL: z.enum(["true", "false"]).default("false"),
  CORS_ORIGINS: z.string().default(""),
  // Crea la tabla `users` al arrancar si falta (idempotente). Evita el 503 de
  // "falta la tabla" cuando se olvida correr las migraciones contra Neon.
  DB_AUTO_MIGRATE: z.enum(["true", "false"]).default("true"),
  DB_POOL_MAX: z.coerce.number().int().positive().max(50).default(5),
});

export interface Config {
  port: number;
  databaseUrl?: string;
  databaseSsl: boolean;
  corsOrigins: string[];
  dbAutoMigrate: boolean;
  dbPoolMax: number;
}

/**
 * Normaliza un origen para compararlo con la cabecera `Origin` del navegador:
 * quita espacios, barra final y rutas. `*` se conserva como comodín.
 */
export function normalizeOrigin(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed === "*") return "*";
  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return url.origin;
  } catch {
    return trimmed.replace(/\/+$/, "");
  }
}

export function parseCorsOrigins(raw: string): string[] {
  return raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = schema.parse(env);
  return {
    port: parsed.PORT,
    databaseUrl: parsed.DATABASE_URL || undefined,
    databaseSsl: parsed.DATABASE_SSL === "true",
    corsOrigins: parseCorsOrigins(parsed.CORS_ORIGINS),
    dbAutoMigrate: parsed.DB_AUTO_MIGRATE === "true",
    dbPoolMax: parsed.DB_POOL_MAX,
  };
}
