/**
 * Sesión local de Maratur.
 *
 * Este proyecto es una PWA demostrativa: las cuentas viven en el navegador y la
 * contraseña se guarda como hash SHA-256 (nunca en texto plano). Cuando exista
 * un backend real, estas funciones se sustituyen por llamadas a la API sin
 * cambiar las pantallas.
 */

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

interface StoredAccount {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

const SESSION_KEY = "maratur.session.v1";
const ACCOUNTS_KEY = "maratur.accounts.v1";

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

async function hashPassword(email: string, password: string): Promise<string> {
  const value = `${normalizeEmail(email)}::${password}`;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  // Respaldo para navegadores muy antiguos sin Web Crypto.
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
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

  const accounts = readJson<StoredAccount[]>(ACCOUNTS_KEY, []);
  if (accounts.some((account) => normalizeEmail(account.email) === email)) {
    throw new AuthError("Ya existe una cuenta con ese correo. Inicia sesión.");
  }

  const account: StoredAccount = {
    name,
    email,
    passwordHash: await hashPassword(email, input.password),
    createdAt: Date.now(),
  };
  writeJson(ACCOUNTS_KEY, [...accounts, account]);

  return { kind: "user", name, email, since: account.createdAt };
}

export async function loginAccount(input: {
  email: string;
  password: string;
}): Promise<UserSession> {
  const email = normalizeEmail(input.email);
  if (!validEmail(email)) throw new AuthError("Escribe un correo válido.");

  const accounts = readJson<StoredAccount[]>(ACCOUNTS_KEY, []);
  const account = accounts.find((item) => normalizeEmail(item.email) === email);
  if (!account) {
    throw new AuthError("No encontramos esa cuenta. Regístrate para comenzar.");
  }

  const passwordHash = await hashPassword(email, input.password);
  if (passwordHash !== account.passwordHash) {
    throw new AuthError("La contraseña no coincide. Inténtalo de nuevo.");
  }

  return { kind: "user", name: account.name, email: account.email, since: account.createdAt };
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
