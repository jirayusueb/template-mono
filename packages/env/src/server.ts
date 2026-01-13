import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DB: z.custom<D1Database>(),
		CORS_ORIGIN: z.string().url(),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_URL: z.string().url(),
	},
	runtimeEnv: (
		globalThis as unknown as {
			env: Record<string, string | number | boolean | undefined>;
		}
	).env,
	emptyStringAsUndefined: true,
});
