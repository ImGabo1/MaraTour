import type { Pool } from "pg";

/**
 * Esquema mínimo que la API necesita para registrar e iniciar sesión.
 *
 * Es el mismo contenido de `database/migrations/003_users.sql`, pero se ejecuta
 * al arrancar el servicio para que un despliegue nuevo en Render nunca quede
 * sin la tabla `users`. Todo es idempotente (IF NOT EXISTS / OR REPLACE), así
 * que correrlo en cada arranque no cambia nada si ya está aplicado.
 */
const USERS_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL
                                CHECK (char_length(btrim(name)) BETWEEN 2 AND 120),
  email             text        NOT NULL
                                CHECK (char_length(email) BETWEEN 5 AND 320),
  password_hash     text        NOT NULL
                                CHECK (char_length(password_hash) >= 20),
  email_verified_at timestamptz,
  last_login_at     timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_uidx
  ON users (lower(email));

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;

CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
`;

export interface SchemaResult {
  ok: boolean;
  created: boolean;
  error?: string;
}

/** Crea la tabla `users` si falta. Nunca lanza: devuelve el resultado. */
export async function ensureUsersSchema(pool: Pool): Promise<SchemaResult> {
  try {
    const before = await pool.query<{ exists: boolean }>(
      "SELECT to_regclass('public.users') IS NOT NULL AS exists"
    );
    const created = before.rows[0]?.exists === false;
    await pool.query(USERS_SCHEMA);
    return { ok: true, created };
  } catch (error) {
    return { ok: false, created: false, error: error instanceof Error ? error.message : String(error) };
  }
}
