import { Elysia } from "elysia";

export interface AuthConfig {
  secret: string;
  sessionTimeout: number;
}

function loadAuthConfig(): AuthConfig {
  return {
    secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
    sessionTimeout: Number.parseInt(process.env.SESSION_TIMEOUT || "86400", 10), // 24 hours
  };
}

const authConfig = new Elysia({ name: "authConfig" }).decorate(
  "authConfig",
  loadAuthConfig()
);

export default authConfig;
