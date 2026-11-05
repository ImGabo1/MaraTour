-- 004_place_sector.sql — sector público/privado para hospitales y servicios
-- Regla: las migraciones ya aplicadas NO se editan; se crea 005_..., 006_..., etc.
--
-- El catálogo del frontend ya usaba `sector` en tres fichas de salud. Sin esta
-- columna, al servir esos lugares desde la API el dato se perdía.

ALTER TABLE places
  ADD COLUMN IF NOT EXISTS sector text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'places_sector_check'
  ) THEN
    ALTER TABLE places
      ADD CONSTRAINT places_sector_check
      CHECK (sector IN ('publico', 'privado'));
  END IF;
END;
$$;
