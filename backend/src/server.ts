import { Pool } from "pg";
import { createApp } from "./app";
import { loadConfig } from "./config";
import { ensureUsersSchema } from "./db/schema";
import { MemoryPlaceRepository } from "./repo/memory";
import { PostgresPlaceRepository } from "./repo/postgres";
import type { PlaceRepository } from "./repo/types";
import { MemoryUserRepository } from "./repo/users-memory";
import { PostgresUserRepository } from "./repo/users-postgres";
import type { UserRepository } from "./repo/users-types";

async function main(): Promise<void> {
  const config = loadConfig();

  let repo: PlaceRepository;
  let userRepo: UserRepository;
  let pool: Pool | null = null;

  if (config.databaseUrl) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
      max: config.dbPoolMax,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 15_000,
    });
    pool.on("error", (err) => {
      console.error("Error inesperado en cliente inactivo de PostgreSQL:", err.message);
    });

    if (config.dbAutoMigrate) {
      const schema = await ensureUsersSchema(pool);
      if (schema.ok) {
        console.log(
          schema.created
            ? "Esquema: tabla users creada (primera puesta en marcha)."
            : "Esquema: tabla users lista."
        );
      } else {
        console.error(
          `Esquema: no se pudo preparar la tabla users → ${schema.error}. ` +
            "Revisa DATABASE_URL / DATABASE_SSL o corre `npm run db:migrate` contra Neon."
        );
      }
    }

    repo = new PostgresPlaceRepository(pool);
    userRepo = new PostgresUserRepository(pool);
    console.log("Fuente de datos: PostgreSQL (lugares y usuarios)");
  } else {
    repo = new MemoryPlaceRepository();
    userRepo = new MemoryUserRepository();
    console.warn("DATABASE_URL no definida: usando datos de database/seed y usuarios en memoria.");
  }

  const app = createApp(repo, { corsOrigins: config.corsOrigins, userRepository: userRepo });
  const server = app.listen(config.port, "0.0.0.0", () => {
    console.log(`API escuchando en http://0.0.0.0:${config.port}`);
  });

  server.on("error", (error) => {
    console.error("No se pudo iniciar el servidor HTTP:", error.message);
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    console.log(`\n${signal} recibido: cerrando API...`);
    server.close(() => {
      void pool?.end().finally(() => process.exit(0));
      if (!pool) process.exit(0);
    });
    // Si alguna conexión queda colgada, no bloqueamos el reinicio de Render.
    setTimeout(() => process.exit(0), 8_000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((error) => {
  console.error("Error fatal al arrancar la API:", error);
  process.exit(1);
});
