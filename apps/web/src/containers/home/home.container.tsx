"use client";

import { useHealthCheck } from "@/features/common/hooks";

function HomeContainer() {
  const { data: healthData, isLoading, error } = useHealthCheck();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-4xl">Welcome</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your Next.js + Elysia application is ready!
        </p>

        <div className="mt-8">
          <h2 className="mb-4 font-semibold text-xl">System Status</h2>
          {isLoading && (
            <p className="text-muted-foreground">Checking system health...</p>
          )}

          {error && (
            <div className="text-red-500">
              <p>❌ System health check failed</p>
              <p className="text-muted-foreground text-sm">
                Unable to connect to the server
              </p>
            </div>
          )}

          {healthData && (
            <div className="text-green-500">
              <p>✅ System is healthy</p>
              <p className="text-muted-foreground text-sm">
                Server is running and responsive
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeContainer;
