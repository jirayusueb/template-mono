import type { ITodoRepository } from "../../domain/repositories/todo.repository";

import { Result } from "better-result";

export class DeleteTodoUseCase {
	readonly todoRepository: ITodoRepository;

	constructor(todoRepository: ITodoRepository) {
		this.todoRepository = todoRepository;
	}

	async execute(id: number): Promise<Result<null, Error>> {
		const todo = await this.todoRepository.findById(id);
		if (!todo) {
			return Result.err(new Error(`Todo with id ${id} not found`));
		}
		await this.todoRepository.delete(id);
		return Result.ok(null);
	}
}
