import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { eden } from "@/utils/eden";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const healthCheck = useQuery(eden.healthCheck.queryOptions());

	return (
		<div className="mx-auto max-w-3xl px-4 py-2">
			<h1 className="mb-4 font-bold text-2xl">API Status</h1>
			<div className="flex items-center gap-2">
				<div
					className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
				/>
				<span className="text-muted-foreground text-sm">
					{healthCheck.isLoading
						? "Checking..."
						: healthCheck.data
							? "Connected"
							: "Disconnected"}
				</span>
			</div>
		</div>
	);
}
