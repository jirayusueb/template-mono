export class ResponseDTO<T = unknown> {
	success: boolean;
	data: T;
	error?: string;

	constructor(success: boolean, data: T, error?: string) {
		this.success = success;
		this.data = data;
		this.error = error;
	}

	static success<T>(data: T): ResponseDTO<T> {
		return new ResponseDTO(true, data);
	}

	static error(message: string): ResponseDTO<null> {
		return new ResponseDTO(false, null, message);
	}
}
