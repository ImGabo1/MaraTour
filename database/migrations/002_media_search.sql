-- 002_media_search.sql — medios por lugar, búsqueda de texto y updated_at
-- Regla: las migraciones ya aplicadas NO se editan; se crea 003_..., 004_..., etc.

-- ---------------------------------------------------------------------------
-- 1) Varias fotos y panoramas por lugar
--    `places.image_url` / `places.pano_url` se mantienen como imagen principal
--    (compatibilidad con el respaldo sin conexión). Esta tabla permite galería.
-- ---------------------------------------------------------------------------
CREATE TABLE place_media (
  id          bigserial PRIMARY KEY,
  place_slug  text NOT NULL REFERENCES places (slug) ON DELETE CASCADE,
  kind        text NOT NULL CHECK (kind IN ('photo', 'pano')),
  url         text NOT NULL,
  caption     text,
  credit      text,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX place_media_place_idx ON place_media (place_slug, sort_order, id);

-- ---------------------------------------------------------------------------
-- 2) updated_at automático (el seed ya lo tocaba a mano)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER places_set_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 3) Búsqueda de texto en español (nombre, descripción, etiquetas, historia)
--    Se usa una columna generada + índice GIN: no hay que recalcular nada a mano.
--    `array_to_string` no está marcada IMMUTABLE, así que se envuelve para poder
--    usar `tags` dentro de una columna generada (para text[] es segura).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION immutable_array_to_string(text[]) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT array_to_string($1, ' ');
$$;

ALTER TABLE places
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('spanish', immutable_array_to_string(tags)), 'B') ||
    setweight(to_tsvector('spanish', coalesce(history, '') || ' ' || coalesce(address, '')), 'C')
  ) STORED;

CREATE INDEX places_search_idx ON places USING GIN (search_vector);
