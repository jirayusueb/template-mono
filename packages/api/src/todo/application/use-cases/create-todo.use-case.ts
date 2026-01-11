import type { ITodoRepository } from "../../domain/repositories/todo.repository";
import type { TodoText } from "../../domain/value-objects/todo-text";
import type { TodoResponse } from "../dto/todo.dto";

import { Result } from "better-result";

import { Todo } from "../../domain/entities/todo.entity";

export class CreateTodoUseCase {
	readonly todoRepository: ITodoRepository;

	constructor(todoRepository: ITodoRepository) {
		this.todoRepository = todoRepository;
	}

	async execute(text: TodoText): Promise<Result<TodoResponse, Error>> {
		const todo = Todo.create(text);
		await this.todoRepository.save(todo);
		return Result.ok({
			id: todo.id,
			text: todo.text.getValue(),
			completed: todo.completed,
		});
	}
}
