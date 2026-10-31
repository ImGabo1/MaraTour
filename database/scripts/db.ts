import path from "node:path";
import dotenv from "dotenv";
import { Pool } from "pg";

// Carga .env de la raíz del repo (y, si existe, el de database/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

export function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Falta DATABASE_URL. Copia .env.example a .env y ajusta el valor."
    );
  }
  const ssl = process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined;
  return new Pool({ connectionString, ssl });
}
