import { z } from "zod";

export const TodoResponseSchema = z.object({
	id: z.number(),
	text: z.string(),
	completed: z.boolean(),
});

export type TodoResponse = z.infer<typeof TodoResponseSchema>;
