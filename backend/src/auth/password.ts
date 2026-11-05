import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/**
 * Hash de contraseñas con scrypt (incluido en Node, sin dependencias nativas).
 * Formato guardado: scrypt$N$r$p$sal_base64$hash_base64
 *
 * N=16384, r=8, p=1 es el coste recomendado por OpenSSL para scrypt y tarda
 * unas décimas de segundo por operación, suficiente para login/registro.
 */
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 64 * 1024 * 1024;

function derive(password: string, salt: Buffer, keyLength: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
    maxmem: MAX_MEMORY,
  });
  return [
    "scrypt",
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

/** Compara en tiempo constante; devuelve false si el formato no es válido. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, costRaw, blockRaw, parallelRaw, saltRaw, keyRaw] = parts;
  const cost = Number(costRaw);
  const block = Number(blockRaw);
  const parallel = Number(parallelRaw);
  if (!Number.isInteger(cost) || !Number.isInteger(block) || !Number.isInteger(parallel)) return false;
  if (cost < 2 || block < 1 || parallel < 1 || cost > 1_048_576) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(saltRaw ?? "", "base64");
    expected = Buffer.from(keyRaw ?? "", "base64");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length === 0) return false;

  try {
    const actual = await derive(password, salt, expected.length, {
      N: cost,
      r: block,
      p: parallel,
      maxmem: MAX_MEMORY,
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
