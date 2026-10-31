import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// .env en la raíz del repo (compartido) y, si existe, en backend/
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().optional(),
  DATABASE_SSL: z.enum(["true", "false"]).default("false"),
  CORS_ORIGINS: z.string().default(""),
});

export interface Config {
  port: number;
  databaseUrl?: string;
  databaseSsl: boolean;
  corsOrigins: string[];
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = schema.parse(env);
  return {
    port: parsed.PORT,
    databaseUrl: parsed.DATABASE_URL || undefined,
    databaseSsl: parsed.DATABASE_SSL === "true",
    corsOrigins: parsed.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean),
  };
}
