import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/* AES-256-GCM for secrets kept in the database (shops' WhatsApp tokens).
   APP_ENCRYPTION_KEY: 32 random bytes, base64 — `openssl rand -base64 32`. */

function key() {
  const raw = process.env.APP_ENCRYPTION_KEY;
  const buf = raw ? Buffer.from(raw, "base64") : null;
  if (!buf || buf.length !== 32) throw new Error("APP_ENCRYPTION_KEY must be 32 bytes, base64-encoded");
  return buf;
}

export const canEncrypt = () => {
  try {
    key();
    return true;
  } catch {
    return false;
  }
};

export function seal(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), data.toString("base64url")].join(".");
}

export function open(sealed: string): string | null {
  try {
    const [v, iv, tag, data] = sealed.split(".");
    if (v !== "v1") return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
