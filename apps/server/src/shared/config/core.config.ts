import { Elysia } from "elysia";

export interface CoreConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
}

function loadCoreConfig(): CoreConfig {
  return {
    port: Number.parseInt(process.env.PORT || "3001", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL as string,
  };
}

const coreConfig = new Elysia({ name: "coreConfig" }).decorate(
  "coreConfig",
  loadCoreConfig()
);

export default coreConfig;
