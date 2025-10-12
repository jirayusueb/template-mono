import { Elysia } from "elysia";

export interface CorsConfig {
  origin: string;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

function loadCorsConfig(): CorsConfig {
  return {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };
}

const corsConfig = new Elysia({ name: "corsConfig" }).decorate(
  "corsConfig",
  loadCorsConfig()
);

export default corsConfig;
