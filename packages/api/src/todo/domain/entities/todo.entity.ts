import type { TodoText } from "../value-objects/todo-text.vo";

export class Todo {
	readonly id: number;
	readonly text: TodoText;
	readonly completed: boolean;

	constructor(id: number, text: TodoText, completed: boolean) {
		this.id = id;
		this.text = text;
		this.completed = completed;
	}

	static create(text: TodoText): Todo {
		return new Todo(0, text, false);
	}

	static existing(id: number, text: TodoText, completed: boolean): Todo {
		return new Todo(id, text, completed);
	}

	toggle(): Todo {
		return new Todo(this.id, this.text, !this.completed);
	}

	markAsCompleted(): Todo {
		return new Todo(this.id, this.text, true);
	}

	markAsIncomplete(): Todo {
		return new Todo(this.id, this.text, false);
	}

	updateText(text: TodoText): Todo {
		return new Todo(this.id, text, this.completed);
	}

	withId(id: number): Todo {
		return new Todo(id, this.text, this.completed);
	}
}
