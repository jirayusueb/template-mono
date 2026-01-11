import type { ITodoRepository } from "../../domain/repositories/todo.repository";

import { Result } from "better-result";
import { Elysia } from "elysia";
import { z } from "zod";

import { CreateTodoUseCase } from "../../application/use-cases/create-todo.use-case";
import { DeleteTodoUseCase } from "../../application/use-cases/delete-todo.use-case";
import { GetAllTodosUseCase } from "../../application/use-cases/get-all-todos.use-case";
import { ToggleTodoUseCase } from "../../application/use-cases/toggle-todo.use-case";
import { TodoText } from "../../domain/value-objects/todo-text";

const createTodoRequestSchema = z.object({
	text: z.string().min(1).max(500),
});

const toggleTodoRequestSchema = z.object({
	id: z.number(),
	completed: z.boolean(),
});

const deleteTodoRequestSchema = z.object({
	id: z.number(),
});

export const createTodoRoutes = (todoRepository: ITodoRepository) => {
	const getAllUseCase = new GetAllTodosUseCase(todoRepository);
	const createUseCase = new CreateTodoUseCase(todoRepository);
	const toggleUseCase = new ToggleTodoUseCase(todoRepository);
	const deleteUseCase = new DeleteTodoUseCase(todoRepository);

	return new Elysia({ prefix: "/todo" })
		.get("/getAll", async () => {
			const result = await getAllUseCase.execute();
			return Result.match(result, {
				ok: (data) => ({ success: true, data }),
				err: (error) => ({ success: false, error: error.message }),
			});
		})
		.post("/create", async ({ body }) => {
			const parsed = createTodoRequestSchema.safeParse(body);
			if (!parsed.success) {
				return { success: false, error: "Validation failed" };
			}
			const todoText = new TodoText(parsed.data.text);
			const result = await createUseCase.execute(todoText);
			return Result.match(result, {
				ok: (data) => ({ success: true, data }),
				err: (error) => ({ success: false, error: error.message }),
			});
		})
		.put("/toggle", async ({ body }) => {
			const parsed = toggleTodoRequestSchema.safeParse(body);
			if (!parsed.success) {
				return { success: false, error: "Validation failed" };
			}
			const result = await toggleUseCase.execute(
				parsed.data.id,
				parsed.data.completed
			);
			return Result.match(result, {
				ok: () => ({ success: true, data: null }),
				err: (error) => ({ success: false, error: error.message }),
			});
		})
		.delete("/delete", async ({ body }) => {
			const parsed = deleteTodoRequestSchema.safeParse(body);
			if (!parsed.success) {
				return { success: false, error: "Validation failed" };
			}
			const result = await deleteUseCase.execute(parsed.data.id);
			return Result.match(result, {
				ok: () => ({ success: true, data: null }),
				err: (error) => ({ success: false, error: error.message }),
			});
		});
};
