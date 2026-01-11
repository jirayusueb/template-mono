export interface ITodoEntity {
	readonly id: number;
	readonly text: { getValue: () => string };
	readonly completed: boolean;
}
