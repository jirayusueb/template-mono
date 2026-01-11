export class AppError extends Error {
	readonly statusCode;
	readonly code;

	constructor(message: string, statusCode = 500, code?: string) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
		this.code = code;
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(message, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class ValidationError extends AppError {
	constructor(message = "Validation failed") {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401, "UNAUTHORIZED");
		this.name = "UnauthorizedError";
	}
}
