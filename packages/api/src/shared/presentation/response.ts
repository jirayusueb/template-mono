export const setSuccessResponse = <T>(data: T) => {
	return {
		success: true,
		data,
	};
};
