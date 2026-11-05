-- 003_users.sql — cuentas de usuario para login/register
-- Regla: las migraciones ya aplicadas NO se editan; se crea 004_..., 005_..., etc.
--
-- El hash lo genera el backend con scrypt (backend/src/auth/password.ts).
-- Nunca se guarda la contraseña en texto plano.

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

COMMENT ON TABLE users IS
  'Cuentas de usuario de Maratur. El password_hash lo genera el backend, nunca el navegador.';
COMMENT ON COLUMN users.password_hash IS
  'Hash scrypt del backend. No guardar contraseñas en texto plano.';

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
