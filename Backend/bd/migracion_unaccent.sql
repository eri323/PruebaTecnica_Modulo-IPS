-- Backend/bd/migracion_unaccent.sql
-- Migración para bases ya creadas: habilita la búsqueda de pacientes sin tildes.
-- Motivo: los nombres sintéticos vienen acentuados (Muñoz, Jiménez), y el personal
-- asistencial escribe sin tildes; hoy "Maria" devuelve 0 resultados y "María" devuelve 33.
-- Es idempotente: puede ejecutarse varias veces sin efecto adicional.
--
-- Ejecutar con:  psql -d <tu_base> -f Backend/bd/migracion_unaccent.sql

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Envoltorio IMMUTABLE de unaccent(): Postgres no indexa expresiones STABLE.
CREATE OR REPLACE FUNCTION f_unaccent(text)
RETURNS text AS $$ SELECT public.unaccent('public.unaccent', $1) $$
LANGUAGE sql IMMUTABLE PARALLEL SAFE STRICT;

-- El índice viejo nunca llegó a crearse (pg_trgm no estaba instalada), pero se
-- elimina por si existiera en alguna instalación parcial.
DROP INDEX IF EXISTS idx_pacientes_nombre;

CREATE INDEX IF NOT EXISTS idx_pacientes_nombre_unaccent
  ON pacientes USING gin (f_unaccent(nombre_completo) gin_trgm_ops);
