export interface ID {
	toString(): string;
}

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Result<T, E = Error> =
	| { success: true; data: T }
	| { success: false; error: E };
