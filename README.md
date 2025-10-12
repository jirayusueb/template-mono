# Next.js + Elysia Template

A modern full-stack TypeScript monorepo built with Better-T-Stack, designed as a foundation for web applications.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework with App Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Elysia** - Type-safe, high-performance backend framework
- **Bun** - Fast runtime environment and package manager
- **Drizzle** - TypeScript-first ORM
- **SQLite** - Database engine (development), scalable for production
- **Better-Auth** - Modern authentication with TypeScript support
- **Turborepo** - Optimized monorepo build system
- **Result Pattern** - Robust error handling without exceptions
- **Pattern Matching** - Functional programming utilities

## Getting Started

First, install the dependencies:

```bash
bun install
```
## Database Setup

This project uses SQLite with Drizzle ORM for development, with the database file located at `apps/server/local.db`.

1. The database is automatically created when you first run the application
2. Apply the schema to your database:
```bash
bun db:push
```

3. Open database studio to view your data:
```bash
bun db:studio
```


Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Development Commands

- `bun dev` - Start all apps in development mode
- `bun dev:web` - Start only the frontend (Next.js)
- `bun dev:server` - Start only the backend (Elysia)
- `bun db:push` - Push database schema changes
- `bun db:studio` - Open database studio
- `bun db:generate` - Generate Drizzle files
- `bun db:migrate` - Run database migrations





## Project Structure

```
nextjs-elysia-template/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Elysia)
├── memory-bank/     # Project documentation
└── scripts/         # Utility scripts
```

## Architecture

### Frontend (Next.js)
- **App Router** - Modern Next.js routing
- **shadcn/ui** - Accessible UI components
- **TanStack Query** - Data fetching and caching
- **Better-Auth** - Authentication client
- **TailwindCSS** - Styling

### Backend (Elysia)
- **Elysia** - High-performance TypeScript framework
- **Better-Auth** - Authentication server
- **Drizzle ORM** - Database operations
- **SQLite** - Database (development)
- **Result Pattern** - Error handling
- **Pattern Matching** - Functional utilities

## Key Patterns

### Result Pattern
The project uses a Result pattern for robust error handling:

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;

// Usage
const result = await fetchUser(id);
if (result.isOk()) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

### Component Structure
```typescript
interface ComponentProps {
  // Define all props with proper types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  return <div>...</div>;
}
```

## Available Scripts

- `bun dev`: Start all applications in development mode
- `bun build`: Build all applications
- `bun dev:web`: Start only the web application
- `bun dev:server`: Start only the server
- `bun check-types`: Check TypeScript types across all apps
- `bun db:push`: Push schema changes to database
- `bun db:studio`: Open database studio UI
- `bun db:generate`: Generate Drizzle files
- `bun db:migrate`: Run database migrations
