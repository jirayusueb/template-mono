import api from "@repo/api";
import { auth } from "@repo/auth";

import { cors } from "@elysiajs/cors";
import { env } from "@repo/env/server";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		})
	)
	.mount("/api/auth", auth.handler)
	.get("/", () => "OK")
	.use(api);

export default app;
export type App = typeof app;
