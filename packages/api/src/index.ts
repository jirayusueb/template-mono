import { Elysia } from "elysia";

import { DrizzleTodoRepository } from "./todo/infrastructure/repositories/drizzle-todo.repository";
import { createTodoRoutes } from "./todo/presentation/routes/todo.routes";

const app = new Elysia({ name: "api" }).get("/healthCheck", () => "OK");

const todoRepository = new DrizzleTodoRepository();
const todoRoutes = createTodoRoutes(todoRepository);

app.use(todoRoutes);

export type App = typeof app;
export default app;
