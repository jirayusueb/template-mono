import type { Todo } from "../../domain/entities/todo.entity";
import type { ITodoRepository } from "../../domain/repositories/todo.repository";

import { Result } from "better-result";

export class ToggleTodoUseCase {
	readonly todoRepository: ITodoRepository;

	constructor(todoRepository: ITodoRepository) {
		this.todoRepository = todoRepository;
	}

	async execute(id: number, completed: boolean): Promise<Result<null, Error>> {
		const todo = (await this.todoRepository.findById(id)) as Todo | null;
		if (!todo) {
			return Result.err(new Error(`Todo with id ${id} not found`));
		}
		const updated = completed
			? todo.markAsCompleted()
			: todo.markAsIncomplete();
		await this.todoRepository.save(updated);
		return Result.ok(null);
	}
}
