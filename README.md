# Sunny Mono

A LINE bot for income and expense tracking, built as a modern full-stack TypeScript monorepo with [Better-T-Stack](https://better-t-stack.com/), featuring Next.js frontend and Elysia backend with comprehensive authentication, database management, and development tooling.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd sunny-mono

# Install dependencies
bun install

# Start development servers
bun dev

# Or start individual services
bun dev:web      # Frontend only (port 3001)
bun dev:server   # Backend only (port 3000)
```

## 🏗️ Architecture

This project follows a **monorepo architecture** with clean separation between frontend and backend:

```
sunny-mono/
├── apps/
│   ├── web/          # Next.js frontend
│   └── server/       # Elysia backend
├── docs/             # Comprehensive documentation
├── package.json      # Root workspace configuration
└── turbo.json       # Turborepo build optimization
```

### Key Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Elysia.js, Better-Auth, Drizzle ORM, SQLite
- **Runtime**: Bun (fast JavaScript runtime)
- **Build System**: Turborepo (monorepo build optimization)
- **Code Quality**: Biome (linting & formatting), Ultracite (standards)

## 🛠️ Development

### Available Scripts

```bash
# Development
bun dev                 # Start all services
bun dev:web            # Frontend only
bun dev:server         # Backend only

# Database
bun db:push            # Push schema changes
bun db:studio          # Open Drizzle Studio
bun db:generate        # Generate migrations
bun db:migrate         # Run migrations

# Code Quality
bun check              # Lint and format code
bun check-types        # TypeScript type checking
bun build              # Build all applications
```

### Database Management

The project uses **Drizzle ORM** with SQLite for development:

```bash
# Generate new migration after schema changes
bun db:generate

# Apply schema changes to database
bun db:push

# Open database studio for inspection
bun db:studio
```

## 🏛️ Architecture Patterns

### Result Pattern for Error Handling

The project uses a **Result pattern** for type-safe error handling without exceptions:

```typescript
type Result<T, E = Error> = Ok<T> | Err<E>;

// Usage example
const result = await fetchUser(id);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Plugin Architecture (Backend)

The server uses a modular plugin system:

```typescript
const app = new Elysia()
  .use(loggerIntegration)      // Logging
  .use(openapiIntegration)     // API documentation
  .use(errorInterceptor)       // Error handling
  .use(corsMiddleware)         // CORS
  .use(authMiddleware)         // Authentication
  .use(routers)               // API routes
  .listen(PORT);
```

### Container Pattern (Frontend)

Features are organized using the container pattern:

```typescript
// containers/feature-name/
├── index.ts                    # Barrel export
├── feature-name.container.tsx  # Main container
├── components/                 # Feature-specific components
├── hooks/                      # Feature-specific hooks
└── utils/                      # Feature-specific utilities
```

## 🔐 Authentication

The project includes **Better-Auth** for comprehensive authentication:

- **Sign In/Sign Up** forms with validation
- **Session management** with secure cookies
- **Protected routes** with middleware
- **Type-safe** authentication throughout the stack

### Authentication Flow

1. User submits credentials via forms
2. Frontend sends requests to `/api/auth/*` endpoints
3. Better-Auth processes authentication
4. Session created and stored in database
5. Secure cookie set for subsequent requests

## 📁 Project Structure

### Frontend (`apps/web/`)

```
src/
├── app/                    # Next.js app router
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── index.ts          # Barrel exports
├── containers/            # Feature containers
├── features/             # Feature-specific logic
├── hooks/                # Custom React hooks
└── lib/                  # Utilities and configurations
```

### Backend (`apps/server/`)

```
src/
├── db/                   # Database schema and migrations
├── routers/              # API route handlers
├── services/             # Business logic
├── shared/               # Shared utilities and middleware
└── index.ts              # Server entry point
```

## 🎨 UI Components

The project uses **shadcn/ui** for consistent, accessible components:

- **Form Components**: Input, Button, Select, Checkbox, etc.
- **Layout Components**: Card, Sheet, Dialog, Tabs, etc.
- **Data Display**: Table, Badge, Avatar, Progress, etc.
- **Navigation**: Menu, Breadcrumb, Pagination, etc.

All components are fully typed and follow accessibility best practices.

## 🧪 Testing

The project includes comprehensive testing patterns:

- **Unit Tests**: Individual functions and components
- **Integration Tests**: Feature workflows and API endpoints
- **E2E Tests**: Complete user journeys
- **Contract Tests**: API contracts between frontend and backend

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Architectural Patterns](./docs/architectural-patterns.md)** - High-level architecture
- **[Component Patterns](./docs/component-patterns.md)** - React component best practices
- **[Error Handling](./docs/error-handling-patterns.md)** - Result pattern implementation
- **[Testing Patterns](./docs/testing-patterns.md)** - Testing strategies
- **[File Structure](./docs/file-structure.md)** - Project organization

## 🚀 Deployment

### Development
- **Database**: SQLite for local development
- **Hot Reloading**: Fast development iteration
- **Type Checking**: Real-time TypeScript validation

### Production
- **Database**: PostgreSQL or MySQL for production
- **Caching**: Redis for session and data caching
- **CDN**: Static asset delivery
- **Monitoring**: Application performance monitoring

## 🛡️ Code Quality

The project enforces high code quality standards:

- **Biome**: Fast linting and formatting
- **Ultracite**: Comprehensive code quality rules
- **TypeScript**: Strict type checking
- **Result Pattern**: Type-safe error handling
- **Accessibility**: WCAG compliance

## 🔧 Configuration

### Environment Variables

Create `.env.local` files in both `apps/web/` and `apps/server/` directories:

```bash
# Database
DATABASE_URL="file:./local.db"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# CORS
CORS_ORIGIN="http://localhost:3001"
```

### TypeScript Configuration

- **Strict mode** enabled across all packages
- **Path mapping** for clean imports (`@/components`, `@/lib`)
- **Shared types** between frontend and backend
- **Incremental compilation** for faster builds

## 🤝 Contributing

1. Follow the established architectural patterns
2. Use the Result pattern for error handling
3. Write tests for new features
4. Update documentation when making changes
5. Follow the code quality standards

## 📄 License

This project is licensed under the MIT License.

## 🔗 Resources

- [Better-T-Stack Documentation](https://better-t-stack.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Elysia Documentation](https://elysiajs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Turborepo](https://turbo.build/repo/docs)

---

Built with ❤️ using Better-T-Stack
