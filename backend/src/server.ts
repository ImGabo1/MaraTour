import { Pool } from "pg";
import { createApp } from "./app";
import { loadConfig } from "./config";
import { MemoryPlaceRepository } from "./repo/memory";
import { PostgresPlaceRepository } from "./repo/postgres";
import type { PlaceRepository } from "./repo/types";

function main(): void {
  const config = loadConfig();

  let repo: PlaceRepository;
  if (config.databaseUrl) {
    const pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
    });
    repo = new PostgresPlaceRepository(pool);
    console.log("Fuente de datos: PostgreSQL");
  } else {
    repo = new MemoryPlaceRepository();
    console.warn("DATABASE_URL no definida: usando datos de database/seed (modo memoria).");
  }

  const app = createApp(repo, { corsOrigins: config.corsOrigins });
  app.listen(config.port, () => {
    console.log(`API escuchando en http://localhost:${config.port}`);
  });
}

main();
