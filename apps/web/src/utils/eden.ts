import { treaty } from "@elysiajs/eden";
import type { App } from "@repo/api";
import { env } from "@repo/env/web";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(`Error: ${error.message}`);
		},
	}),
});

const client = treaty<App>(`${env.VITE_SERVER_URL}`, {
	fetcher: (url, options) => {
		return fetch(url, {
			...options,
			credentials: "include",
		});
	},
});

export const edenClient = client;

const createQueryOptions = <T>(key: string[], queryFn: () => Promise<T>) => ({
	queryKey: key,
	queryFn,
});

const createMutationOptions = <T, U>(
	mutationFn: (data: U) => Promise<T>,
	options?: any
) => ({
	mutationFn,
	...options,
});

export const eden = {
	healthCheck: {
		queryOptions: () =>
			createQueryOptions(["healthCheck"], () => client.healthCheck.get()),
	},
	todo: {
		getAll: {
			queryOptions: () =>
				createQueryOptions(["todo", "getAll"], () => client.todo.getAll.get()),
		},
		create: {
			mutationOptions: (options?: any) =>
				createMutationOptions(
					(data: any) => client.todo.create.post(data),
					options
				),
		},
		toggle: {
			mutationOptions: (options?: any) =>
				createMutationOptions(
					(data: any) => client.todo.toggle.put(data),
					options
				),
		},
		delete: {
			mutationOptions: (options?: any) =>
				createMutationOptions(
					(data: any) => client.todo.delete.delete(data),
					options
				),
		},
	},
	privateData: {
		queryOptions: () =>
			createQueryOptions(["privateData"], () => client.privateData.get()),
	},
};
