export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export interface NewUser {
  name: string;
  email: string;
  passwordHash: string;
}

/** El correo ya está registrado (violación del índice único). */
export class DuplicateUserError extends Error {
  constructor() {
    super("El correo ya está registrado");
    this.name = "DuplicateUserError";
  }
}

export interface UserRepository {
  /** Nombre de la fuente, para /api/health */
  readonly source: "postgres" | "memory";
  create(input: NewUser): Promise<UserRecord>;
  findByEmail(email: string): Promise<UserRecord | null>;
  markLogin(id: string): Promise<void>;
}
