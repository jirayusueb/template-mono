import type { Context } from "elysia";

import { AppError } from "../domain/errors";

export const errorHandler = (error: unknown, context: Context) => {
	if (error instanceof AppError) {
		context.set.status = error.statusCode;
		return {
			success: false,
			error: error.message,
			code: error.code,
		};
	}

	console.error("Unhandled error:", error);
	context.set.status = 500;
	return {
		success: false,
		error: "Internal server error",
	};
};
