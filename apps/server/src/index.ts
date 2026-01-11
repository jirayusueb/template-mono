import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "@repo/auth";
import { env } from "@repo/env/server";
import { todoRoutes } from "@repo/api/routers/todo";

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
	.use(todoRoutes);

export default app;
export type App = typeof app;
