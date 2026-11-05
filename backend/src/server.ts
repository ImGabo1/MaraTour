import { Pool } from "pg";
import { createApp } from "./app";
import { loadConfig } from "./config";
import { MemoryPlaceRepository } from "./repo/memory";
import { PostgresPlaceRepository } from "./repo/postgres";
import type { PlaceRepository } from "./repo/types";
import { MemoryUserRepository } from "./repo/users-memory";
import { PostgresUserRepository } from "./repo/users-postgres";
import type { UserRepository } from "./repo/users-types";

function main(): void {
  const config = loadConfig();

  let repo: PlaceRepository;
  let userRepo: UserRepository;
  if (config.databaseUrl) {
    const pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
    });
    pool.on("error", (err) => {
      console.error("Error inesperado en cliente inactivo de PostgreSQL:", err);
    });
    repo = new PostgresPlaceRepository(pool);
    userRepo = new PostgresUserRepository(pool);
    console.log("Fuente de datos: PostgreSQL (lugares y usuarios)");
  } else {
    repo = new MemoryPlaceRepository();
    userRepo = new MemoryUserRepository();
    console.warn("DATABASE_URL no definida: usando datos de database/seed y usuarios en memoria.");
  }

  const app = createApp(repo, { corsOrigins: config.corsOrigins, userRepository: userRepo });
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`API escuchando en http://0.0.0.0:${config.port}`);
  });
}

main();
