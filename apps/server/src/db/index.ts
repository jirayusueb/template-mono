import { drizzle } from "drizzle-orm/bun-sqlite";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL || "local.db";

export const db = drizzle(databaseUrl, { schema });

export type DatabaseType = typeof db;
