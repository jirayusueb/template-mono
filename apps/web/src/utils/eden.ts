import type { App } from "@repo/api";
import type { UseMutationOptions } from "@tanstack/react-query";

import { treaty } from "@elysiajs/eden";
import { env } from "@repo/env/web";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error: Error) => {
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
	options?: UseMutationOptions<T, Error, U>
) => ({
	mutationFn,
	...options,
});

// biome-ignore lint/suspicious/noExplicitAny: Type assertions needed for generated API types
const typedClient = client as any;

export const eden = {
	healthCheck: {
		queryOptions: () =>
			createQueryOptions(["healthCheck"], () => client.healthCheck.get()),
	},
	todo: {
		getAll: {
			queryOptions: () =>
				createQueryOptions(["todo", "getAll"], () =>
					typedClient.todo.getAll.get()
				),
		},
		create: {
			mutationOptions: (
				options?: UseMutationOptions<unknown, Error, unknown>
			) =>
				createMutationOptions(
					(data: unknown) => typedClient.todo.create.post(data),
					options
				),
		},
		toggle: {
			mutationOptions: (
				options?: UseMutationOptions<unknown, Error, unknown>
			) =>
				createMutationOptions(
					(data: unknown) => typedClient.todo.toggle.put(data),
					options
				),
		},
		delete: {
			mutationOptions: (
				options?: UseMutationOptions<unknown, Error, unknown>
			) =>
				createMutationOptions(
					(data: unknown) => typedClient.todo.delete.delete(data),
					options
				),
		},
	},
	privateData: {
		queryOptions: () =>
			createQueryOptions(["privateData"], () => typedClient.privateData.get()),
	},
} as const;
