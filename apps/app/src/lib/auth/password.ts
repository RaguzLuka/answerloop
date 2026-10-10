import "server-only";
import { scrypt, randomBytes, timingSafeEqual, type ScryptOptions } from "node:crypto";

/* Passwords are hashed with scrypt (Node's built-in, memory-hard KDF).
   Stored as "scrypt$N$r$p$salt$hash" so parameters can be raised later. */

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

function derive(password: string, salt: Buffer, opts: ScryptOptions, keylen: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, keylen, { ...opts, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, { N, r: R, p: P }, KEYLEN);
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, saltB64, keyB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64url");
  const key = await derive(password, Buffer.from(saltB64, "base64url"), { N: +n, r: +r, p: +p }, expected.length);
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** A real hash of a random password — compared against when the email doesn't
 *  exist, so a login attempt takes the same time either way. */
let dummy: Promise<string> | undefined;
export function dummyHash() {
  dummy ??= hashPassword(randomBytes(16).toString("hex"));
  return dummy;
}
