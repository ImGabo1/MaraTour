import type { Pool } from "pg";
import { DuplicateUserError, type NewUser, type UserRecord, type UserRepository } from "./users-types";

interface UserRow {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

const SELECT = `
  SELECT id,
         name,
         email,
         password_hash AS "passwordHash",
         created_at     AS "createdAt",
         last_login_at  AS "lastLoginAt"
    FROM users`;

function toUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    lastLoginAt: row.lastLoginAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export class PostgresUserRepository implements UserRepository {
  readonly source = "postgres" as const;

  constructor(private readonly pool: Pool) {}

  async create(input: NewUser): Promise<UserRecord> {
    try {
      const { rows } = await this.pool.query<UserRow>(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id,
                   name,
                   email,
                   password_hash AS "passwordHash",
                   created_at     AS "createdAt",
                   last_login_at  AS "lastLoginAt"`,
        [input.name, input.email.trim().toLowerCase(), input.passwordHash]
      );
      const row = rows[0];
      if (!row) throw new Error("PostgreSQL no devolvió la cuenta creada");
      return toUser(row);
    } catch (error) {
      if (isUniqueViolation(error)) throw new DuplicateUserError();
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const { rows } = await this.pool.query<UserRow>(
      `${SELECT} WHERE lower(email) = lower($1) LIMIT 1`,
      [email.trim()]
    );
    const row = rows[0];
    return row ? toUser(row) : null;
  }

  async markLogin(id: string): Promise<void> {
    await this.pool.query("UPDATE users SET last_login_at = now() WHERE id = $1", [id]);
  }
}
