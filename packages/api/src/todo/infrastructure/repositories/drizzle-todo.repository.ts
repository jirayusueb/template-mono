import type { Todo } from "../../domain/entities/todo";
import type { ITodoRepository } from "../../domain/repositories/todo.repository";

import { todo as todoTable } from "@repo/db/schema/todo";
import { eq } from "drizzle-orm";

import { getDb } from "../../../shared/infrastructure/database";
import { toDomain, toPersistence } from "../mappers/todo.mapper";

export class DrizzleTodoRepository implements ITodoRepository {
	async findAll(): Promise<Todo[]> {
		const db = getDb();
		const results = await db.select().from(todoTable);
		return results.map((result) => toDomain(result));
	}

	async findById(id: number): Promise<Todo | null> {
		const db = getDb();
		const results = await db
			.select()
			.from(todoTable)
			.where(eq(todoTable.id, id));
		if (results.length === 0) {
			return null;
		}
		return toDomain(results[0]);
	}

	async save(todo: Todo): Promise<void> {
		const db = getDb();
		const id = todo.id;
		if (id === 0) {
			const result = (await db
				.insert(todoTable)
				.values(toPersistence(todo))
				.returning({ id: todoTable.id })) as unknown as { id: number }[] | null;
			if (result?.[0]) {
				todo.withId(result[0].id);
			}
		} else {
			await db
				.update(todoTable)
				.set(toPersistence(todo))
				.where(eq(todoTable.id, id));
		}
	}

	async delete(id: number): Promise<void> {
		const db = getDb();
		await db.delete(todoTable).where(eq(todoTable.id, id));
	}
}
