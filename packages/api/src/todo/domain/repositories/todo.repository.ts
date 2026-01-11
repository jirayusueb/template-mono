import type { ITodoEntity } from "../entities/todo.interface";

export interface ITodoRepository {
	findAll(): Promise<ITodoEntity[]>;
	findById(id: number): Promise<ITodoEntity | null>;
	save(todo: ITodoEntity): Promise<void>;
	delete(id: number): Promise<void>;
}
