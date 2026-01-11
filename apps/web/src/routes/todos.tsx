import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { eden } from "@/utils/eden";

export const Route = createFileRoute("/todos")({
	component: TodosRoute,
});

interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

function TodosRoute() {
	const [newTodoText, setNewTodoText] = useState("");

	const todos = useQuery(eden.todo.getAll.queryOptions());
	const createMutation = useMutation(
		eden.todo.create.mutationOptions({
			onSuccess: () => {
				todos.refetch();
				setNewTodoText("");
			},
		})
	);
	const toggleMutation = useMutation(
		eden.todo.toggle.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		})
	);
	const deleteMutation = useMutation(
		eden.todo.delete.mutationOptions({
			onSuccess: () => {
				todos.refetch();
			},
		})
	);

	const handleAddTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (newTodoText.trim()) {
			createMutation.mutate({ text: newTodoText });
		}
	};

	const handleToggleTodo = (id: number, completed: boolean) => {
		toggleMutation.mutate({ id, completed: !completed });
	};

	const handleDeleteTodo = (id: number) => {
		deleteMutation.mutate({ id });
	};

	return (
		<div className="mx-auto w-full max-w-md py-10">
			<Card>
				<CardHeader>
					<CardTitle>Todo List</CardTitle>
					<CardDescription>Manage your tasks efficiently</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="mb-6 flex items-center space-x-2"
						onSubmit={handleAddTodo}
					>
						<Input
							disabled={createMutation.isPending}
							onChange={(e) => setNewTodoText(e.target.value)}
							placeholder="Add a new task..."
							value={newTodoText}
						/>
						<Button
							disabled={createMutation.isPending || !newTodoText.trim()}
							type="submit"
						>
							{createMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Add"
							)}
						</Button>
					</form>

					{todos.isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : (
						(() => {
							const todoList = todos.data as unknown as Todo[] | undefined;
							if (!todoList || todoList.length === 0) {
								return (
									<p className="py-4 text-center">
										No todos yet. Add one above!
									</p>
								);
							}
							return (
								<ul className="space-y-2">
									{todoList.map((todo) => (
										<li
											className="flex items-center justify-between rounded-md border p-2"
											key={todo.id}
										>
											<div className="flex items-center space-x-2">
												<Checkbox
													checked={todo.completed}
													id={`todo-${todo.id}`}
													onCheckedChange={() =>
														handleToggleTodo(todo.id, todo.completed)
													}
												/>
												<label
													className={`${todo.completed ? "line-through" : ""}`}
													htmlFor={`todo-${todo.id}`}
												>
													{todo.text}
												</label>
											</div>
											<Button
												aria-label="Delete todo"
												onClick={() => handleDeleteTodo(todo.id)}
												size="icon"
												variant="ghost"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</li>
									))}
								</ul>
							);
						})()
					)}
				</CardContent>
			</Card>
		</div>
	);
}
