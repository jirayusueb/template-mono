import { db } from "@repo/db";
import { todo } from "@repo/db/schema/todo";
import { Elysia } from "elysia";
import { z } from "zod";
import { authMiddleware } from "../auth.middleware";

export const todoRoutes = new Elysia({ prefix: "/todo" })
	.use(authMiddleware)
	.get(
		"/getAll",
		async () => {
			return await db.select().from(todo);
		},
		{
			auth: true,
		}
	)
	.post(
		"/create",
		async ({ body }) => {
			const result = await db.insert(todo).values({
				text: body.text,
			});
			return result;
		},
		{
			auth: true,
			body: z.object({
				text: z.string().min(1),
			}),
		}
	)
	.put(
		"/toggle",
		async ({ body }) => {
			const { sql } = await import("drizzle-orm/sql");
			await db
				.update(todo)
				.set({ completed: body.completed })
				.where(sql`${todo.id} = ${body.id}`);
		},
		{
			auth: true,
			body: z.object({
				id: z.number(),
				completed: z.boolean(),
			}),
		}
	)
	.delete(
		"/delete",
		async ({ body }) => {
			const { sql } = await import("drizzle-orm/sql");
			await db.delete(todo).where(sql`${todo.id} = ${body.id}`);
		},
		{
			auth: true,
			body: z.object({
				id: z.number(),
			}),
		}
	);
