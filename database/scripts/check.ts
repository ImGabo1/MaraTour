import { createPool } from "./db";

/**
 * Diagnóstico de la conexión: `npm run db:check`.
 * Sirve para confirmar que el DATABASE_URL del .env apunta a la base correcta
 * (local o en la nube) y que las migraciones y los datos están cargados.
 */
async function main(): Promise<void> {
  const host = (() => {
    try {
      return new URL(process.env.DATABASE_URL ?? "").host;
    } catch {
      return "(DATABASE_URL inválida o vacía)";
    }
  })();

  console.log(`Conectando a ${host} ...`);
  const pool = createPool();

  try {
    const version = await pool.query<{ version: string }>("SELECT version()");
    console.log(`✔ Conectado: ${version.rows[0]?.version ?? "PostgreSQL"}`);

    const migrations = await pool.query<{ name: string; applied_at: Date }>(
      "SELECT name, applied_at FROM schema_migrations ORDER BY name"
    );
    if (migrations.rowCount === 0) {
      console.warn("⚠ No hay migraciones aplicadas. Corre: npm run db:migrate");
    } else {
      for (const m of migrations.rows) {
        console.log(`  · ${m.name} (${m.applied_at.toISOString().slice(0, 10)})`);
      }
    }

    const counts = await pool.query<{ categories: number; places: number; media: number }>(`
      SELECT (SELECT count(*) FROM categories)::int  AS categories,
             (SELECT count(*) FROM places)::int      AS places,
             (SELECT count(*) FROM place_media)::int AS media
    `);
    const c = counts.rows[0];
    console.log(`✔ Datos: ${c?.categories ?? 0} categorías, ${c?.places ?? 0} lugares, ${c?.media ?? 0} medios.`);

    const search = await pool.query<{ ok: boolean }>(
      "SELECT to_tsvector('spanish', 'Basílica de Chiquinquirá') @@ websearch_to_tsquery('spanish', 'basilica') AS ok"
    );
    if (!search.rows[0]?.ok) {
      console.warn("⚠ La búsqueda de texto no está funcionando como se espera (revisa 002_media_search.sql).");
    }

    if ((c?.places ?? 0) === 0) {
      console.warn("⚠ No hay lugares cargados. Corre: npm run db:seed");
    } else {
      console.log("✔ Todo listo: el backend puede usar esta base de datos.");
    }
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`✖ No se pudo conectar: ${message}`);
  console.error("Revisa DATABASE_URL y, si el proveedor lo pide, DATABASE_SSL=true.");
  process.exit(1);
});
