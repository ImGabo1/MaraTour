import { randomUUID } from "node:crypto";
import { DuplicateUserError, type NewUser, type UserRecord, type UserRepository } from "./users-types";

/**
 * Repositorio de usuarios en memoria: útil para tests y para arrancar sin
 * DATABASE_URL. Las cuentas se pierden al reiniciar el backend.
 */
export class MemoryUserRepository implements UserRepository {
  readonly source = "memory" as const;
  private readonly users = new Map<string, UserRecord>();

  async create(input: NewUser): Promise<UserRecord> {
    const email = input.email.trim().toLowerCase();
    if (this.users.has(email)) throw new DuplicateUserError();

    const user: UserRecord = {
      id: randomUUID(),
      name: input.name,
      email,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
      lastLoginAt: null,
    };
    this.users.set(email, user);
    return user;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.users.get(email.trim().toLowerCase()) ?? null;
  }

  async markLogin(id: string): Promise<void> {
    for (const user of this.users.values()) {
      if (user.id === id) {
        user.lastLoginAt = new Date();
        return;
      }
    }
  }
}
