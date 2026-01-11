export class TodoText {
	readonly value: string;

	constructor(value: string) {
		if (value.trim().length === 0) {
			throw new Error("Todo text cannot be empty");
		}
		if (value.length > 500) {
			throw new Error("Todo text cannot exceed 500 characters");
		}
		this.value = value;
	}

	getValue(): string {
		return this.value;
	}

	equals(other: TodoText): boolean {
		return this.value === other.value;
	}
}
