import type { ITodoRepository } from "../../domain/repositories/todo.repository";
import type { TodoResponse } from "../dto/todo.dto";

import { Result } from "better-result";

export class GetAllTodosUseCase {
	readonly todoRepository: ITodoRepository;

	constructor(todoRepository: ITodoRepository) {
		this.todoRepository = todoRepository;
	}

	async execute(): Promise<Result<TodoResponse[], Error>> {
		const todos = await this.todoRepository.findAll();
		return Result.ok(
			todos.map((todo) => ({
				id: todo.id,
				text: todo.text.getValue(),
				completed: todo.completed,
			}))
		);
	}
}
