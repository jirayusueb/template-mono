import { env } from "@repo/env/server";
import { drizzle } from "drizzle-orm/d1";

// biome-ignore lint/performance/noNamespaceImport: <explanation>
import * as schema from "./schema";

export const db = drizzle(env.DB, { schema });
