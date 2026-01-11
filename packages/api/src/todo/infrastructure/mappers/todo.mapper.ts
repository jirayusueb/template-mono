import type { TodoTable } from "@repo/db/schema/todo";
import type { ITodoEntity } from "../../domain/entities/todo.interface";

import { TodoText } from "../../domain/value-objects/todo-text";

export const toDomain = (data: TodoTable): ITodoEntity => {
	const text = new TodoText(data.text);
	return {
		id: data.id,
		text,
		completed: data.completed,
	};
};

export const toPersistence = (todo: ITodoEntity): Omit<TodoTable, "id"> => ({
	text: todo.text.getValue(),
	completed: todo.completed,
});
