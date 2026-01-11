import alchemy from "alchemy";
import { D1Database, TanStackStart, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/server/.env" });

const app = await alchemy("template-mono");

const db = await D1Database("database", {
	migrationsDir: "../../packages/db/src/migrations",
});

const viteServerUrl = alchemy.env.VITE_SERVER_URL;
const corsOrigin = alchemy.env.CORS_ORIGIN;
const betterAuthSecret = alchemy.secret.env.BETTER_AUTH_SECRET;
const betterAuthUrl = alchemy.env.BETTER_AUTH_URL;

if (!viteServerUrl) {
	throw new Error("Missing VITE_SERVER_URL environment variable");
}
if (!corsOrigin) {
	throw new Error("Missing CORS_ORIGIN environment variable");
}
if (!betterAuthSecret) {
	throw new Error("Missing BETTER_AUTH_SECRET environment variable");
}
if (!betterAuthUrl) {
	throw new Error("Missing BETTER_AUTH_URL environment variable");
}

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	bindings: {
		VITE_SERVER_URL: viteServerUrl,
		DB: db,
		CORS_ORIGIN: corsOrigin,
		BETTER_AUTH_SECRET: betterAuthSecret,
		BETTER_AUTH_URL: betterAuthUrl,
	},
});

export const server = await Worker("server", {
	cwd: "../../apps/server",
	entrypoint: "src/index.ts",
	compatibility: "node",
	bindings: {
		DB: db,
		CORS_ORIGIN: corsOrigin,
		BETTER_AUTH_SECRET: betterAuthSecret,
		BETTER_AUTH_URL: betterAuthUrl,
	},
	dev: {
		port: 3000,
	},
});

console.log(`Web    -> ${web.url}`);
console.log(`Server -> ${server.url}`);

await app.finalize();
