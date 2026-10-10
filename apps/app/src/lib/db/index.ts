import "server-only";
import { mkdirSync } from "node:fs";
import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/* Local development uses a SQLite file in .data/; production points
   DATABASE_URL at a Turso (libSQL) database. Same driver, same SQL. */

const LOCAL_URL = "file:.data/ringloop.db";

function connect(): Client {
  const url = process.env.DATABASE_URL || LOCAL_URL;
  if (url.startsWith("file:")) {
    if (process.env.VERCEL) {
      throw new Error("DATABASE_URL is not set — production needs a Turso database (see apps/app/README.md)");
    }
    mkdirSync(".data", { recursive: true });
  }
  return createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
}

type DB = LibSQLDatabase<typeof schema>;

// Reuse one client across hot reloads in development
const g = globalThis as unknown as { __ringloopDb?: DB };

export const db: DB = g.__ringloopDb ?? drizzle(connect(), { schema });
if (process.env.NODE_ENV !== "production") g.__ringloopDb = db;

export * from "./schema";
