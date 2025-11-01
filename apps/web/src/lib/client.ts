import { treaty } from "@elysiajs/eden";
import type { Routers } from "@workspace/server";

export function getToken() {
	if (typeof window === "undefined") {
		return null;
	}

	return localStorage.getItem("bearer_token");
}

export const client = treaty<Routers>("localhost:3000", {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getToken()}`,
	},
});
