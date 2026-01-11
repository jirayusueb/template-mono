import { z } from "zod";

export const CreateTodoRequestSchema = z.object({
	text: z.string().min(1).max(500),
});

export type CreateTodoRequest = z.infer<typeof CreateTodoRequestSchema>;

export const ToggleTodoRequestSchema = z.object({
	id: z.number(),
	completed: z.boolean(),
});

export type ToggleTodoRequest = z.infer<typeof ToggleTodoRequestSchema>;

export const DeleteTodoRequestSchema = z.object({
	id: z.number(),
});

export type DeleteTodoRequest = z.infer<typeof DeleteTodoRequestSchema>;
