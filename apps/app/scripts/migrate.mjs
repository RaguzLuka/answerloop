// Applies the SQL migrations in ./drizzle to DATABASE_URL (or the local SQLite file).
// Runs before `next dev` locally and before `next build` on Vercel.
import { mkdirSync } from "node:fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const url = process.env.DATABASE_URL || "file:.data/ringloop.db";
if (url.startsWith("file:")) {
  if (process.env.VERCEL) {
    console.error("DATABASE_URL is not set — refusing to build against a throwaway SQLite file.");
    process.exit(1);
  }
  mkdirSync(".data", { recursive: true });
}

const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
client.close();
console.log(`Database up to date (${url.startsWith("file:") ? "local SQLite" : "remote"}).`);
