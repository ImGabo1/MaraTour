/**
 * Sesión de Maratur.
 *
 * - Las cuentas se crean e inician sesión en la API (tabla `users` de Neon/Postgres).
 * - La sesión del navegador se guarda en localStorage para no pedir login en cada visita.
 * - El modo invitado sigue siendo local: no crea cuenta ni llama a la API.
 */

import { API_URL } from "../config";

export interface UserSession {
  kind: "user";
  name: string;
  email: string;
  since: number;
}

export interface GuestSession {
  kind: "guest";
  name: string;
  email: null;
  since: number;
}

export type AuthSession = UserSession | GuestSession;

interface ApiUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiAuthResponse {
  data: ApiUser;
}

interface ApiErrorResponse {
  error?: string;
}

const SESSION_KEY = "maratur.session.v1";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento lleno o bloqueado: la sesión dura lo que la pestaña */
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function authRequest(path: string, body: unknown): Promise<ApiUser> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthError("No pudimos conectar con el servidor. Revisa tu conexión e inténtalo otra vez.");
  }

  const payload = (await res.json().catch(() => null)) as Partial<ApiAuthResponse & ApiErrorResponse> | null;
  if (!res.ok) {
    throw new AuthError(
      typeof payload?.error === "string" && payload.error
        ? payload.error
        : "No pudimos completar el acceso. Inténtalo otra vez."
    );
  }
  if (!payload?.data?.email || !payload.data.name) {
    throw new AuthError("El servidor devolvió una respuesta inesperada. Inténtalo otra vez.");
  }
  return payload.data;
}

function toSession(user: ApiUser): UserSession {
  const since = Date.parse(user.createdAt);
  return {
    kind: "user",
    name: user.name,
    email: user.email,
    since: Number.isFinite(since) ? since : Date.now(),
  };
}

export function readSession(): AuthSession | null {
  const stored = readJson<AuthSession | null>(SESSION_KEY, null);
  if (!stored) return null;
  if (stored.kind === "user" && stored.email) return stored;
  if (stored.kind === "guest") return stored;
  return null;
}

export function writeSession(session: AuthSession): void {
  writeJson(SESSION_KEY, session);
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* nada que limpiar */
  }
}

export function guestSession(): GuestSession {
  return { kind: "guest", name: "Invitado", email: null, since: Date.now() };
}

export class AuthError extends Error {}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<UserSession> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);

  if (name.length < 2) throw new AuthError("Escribe tu nombre completo.");
  if (!validEmail(email)) throw new AuthError("Ese correo no parece válido.");
  if (input.password.length < 8) throw new AuthError("Usa una contraseña de al menos 8 caracteres.");

  const user = await authRequest("/api/auth/register", { name, email, password: input.password });
  return toSession(user);
}

export async function loginAccount(input: {
  email: string;
  password: string;
}): Promise<UserSession> {
  const email = normalizeEmail(input.email);
  if (!validEmail(email)) throw new AuthError("Escribe un correo válido.");
  if (!input.password) throw new AuthError("Escribe tu contraseña.");

  const user = await authRequest("/api/auth/login", { email, password: input.password });
  return toSession(user);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
