import { Elysia } from "elysia";
import { db } from "@repo/db";
import * as schema from "@repo/db/schema";
import { betterAuthMiddleware } from "./middleware";

export const app = new Elysia({ name: "api" })
	.use(betterAuthMiddleware)
	.get("/healthCheck", () => "OK")
	.guard(({ session }) => !!session?.user)
	.get("/privateData", ({ session }) => ({
		message: "This is private",
		user: session?.user,
	}));

export type App = typeof app;
