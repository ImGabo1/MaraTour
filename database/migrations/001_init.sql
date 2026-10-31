-- 001_init.sql — esquema inicial
-- Regla: las migraciones ya aplicadas NO se editan; se crea 002_..., 003_..., etc.

CREATE TABLE categories (
  slug        text PRIMARY KEY CHECK (slug ~ '^[a-z0-9-]+$'),
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0
);

CREATE TABLE places (
  id                serial PRIMARY KEY,
  slug              text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  name              text NOT NULL,
  category_slug     text NOT NULL REFERENCES categories (slug),
  short_description text NOT NULL,
  history           text NOT NULL,
  address           text NOT NULL,
  -- Caja aproximada alrededor del municipio Maracaibo (el proyecto cubre solo este municipio).
  -- Mejora futura: PostGIS y el polígono real del municipio.
  latitude          double precision NOT NULL CHECK (latitude  BETWEEN 10.45 AND 10.85),
  longitude         double precision NOT NULL CHECK (longitude BETWEEN -71.85 AND -71.45),
  -- false hasta que alguien confirme el punto en Google Maps
  coords_verified   boolean NOT NULL DEFAULT false,
  image_url         text,
  pano_url          text,
  tags              text[] NOT NULL DEFAULT '{}',
  published         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX places_category_idx ON places (category_slug);
CREATE INDEX places_published_idx ON places (published);
