# Testing Patterns Documentation

This document outlines the comprehensive testing patterns used throughout the project to ensure code quality, reliability, and maintainability.

## Overview

The project implements a multi-layered testing strategy that covers:

- **Unit Tests** - Individual functions and components
- **Integration Tests** - Feature workflows and API endpoints
- **End-to-End Tests** - Complete user journeys
- **Contract Tests** - API contracts between frontend and backend
- **Visual Regression Tests** - UI component consistency

## Testing Architecture

### Test Structure
```
tests/
├── unit/              # Unit tests
│   ├── components/    # Component tests
│   ├── hooks/         # Hook tests
│   ├── utils/         # Utility function tests
│   └── services/      # Service tests
├── integration/       # Integration tests
│   ├── api/          # API endpoint tests
│   ├── features/     # Feature workflow tests
│   └── database/     # Database operation tests
├── e2e/              # End-to-end tests
│   ├── user-flows/   # Complete user journeys
│   └── scenarios/    # Business scenario tests
├── fixtures/         # Test data and fixtures
├── mocks/           # Mock implementations
└── utils/           # Test utilities and helpers
```

## Unit Testing Patterns

### Component Testing
```typescript
// tests/unit/components/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct variant styles", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Button</Button>);
    expect(ref).toHaveBeenCalled();
  });
});
```

### Hook Testing
```typescript
// tests/unit/hooks/use-user.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { vi } from "vitest";

// Mock the API function
vi.mock("@/lib/api", () => ({
  fetchUser: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useUser Hook", () => {
  it("fetches user data successfully", async () => {
    const mockUser = { id: "1", name: "John Doe", email: "john@example.com" };
    const { fetchUser } = await import("@/lib/api");
    vi.mocked(fetchUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useUser("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
    expect(fetchUser).toHaveBeenCalledWith("1");
  });

  it("handles fetch errors", async () => {
    const { fetchUser } = await import("@/lib/api");
    vi.mocked(fetchUser).mockRejectedValue(new Error("Failed to fetch"));

    const { result } = renderHook(() => useUser("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(new Error("Failed to fetch"));
  });
});
```

### Utility Function Testing
```typescript
// tests/unit/utils/format-date.test.ts
import { formatDate, parseDate, isValidDate } from "@/lib/utils/date";

describe("Date Utilities", () => {
  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2023-12-25T10:30:00Z");
      expect(formatDate(date)).toBe("Dec 25, 2023");
    });

    it("handles invalid dates", () => {
      expect(() => formatDate(new Date("invalid"))).toThrow("Invalid date");
    });
  });

  describe("parseDate", () => {
    it("parses valid date strings", () => {
      const result = parseDate("2023-12-25");
      expect(result).toEqual(new Date("2023-12-25"));
    });

    it("returns null for invalid strings", () => {
      expect(parseDate("invalid")).toBeNull();
    });
  });

  describe("isValidDate", () => {
    it("validates correct dates", () => {
      expect(isValidDate(new Date("2023-12-25"))).toBe(true);
    });

    it("rejects invalid dates", () => {
      expect(isValidDate(new Date("invalid"))).toBe(false);
    });
  });
});
```

## Integration Testing Patterns

### API Endpoint Testing
```typescript
// tests/integration/api/users.test.ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { app } from "@/app";
import { db } from "@/db";
import { userTable } from "@/db/schema";

describe("Users API", () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.delete(userTable);
  });

  afterEach(async () => {
    // Clean up after each test
    await db.delete(userTable);
  });

  describe("GET /api/users/:id", () => {
    it("returns user when found", async () => {
      // Create test user
      const [user] = await db.insert(userTable).values({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
      }).returning();

      const response = await app.handle(
        new Request("http://localhost/api/users/1")
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toEqual(user);
    });

    it("returns 404 when user not found", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/nonexistent")
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("POST /api/users", () => {
    it("creates user with valid data", async () => {
      const userData = {
        name: "Jane Doe",
        email: "jane@example.com",
      };

      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })
      );

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(userData.name);
      expect(data.data.email).toBe(userData.email);
    });

    it("returns validation error for invalid data", async () => {
      const invalidData = {
        name: "",
        email: "invalid-email",
      };

      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invalidData),
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe("Validation failed");
      expect(data.details).toBeDefined();
    });
  });
});
```

### Feature Workflow Testing
```typescript
// tests/integration/features/user-registration.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserRegistration } from "@/containers/auth/user-registration";
import { server } from "@/tests/mocks/server";

describe("User Registration Feature", () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it("completes user registration successfully", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UserRegistration />
      </QueryClientProvider>
    );

    // Fill out registration form
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "securePassword123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText("Registration successful")).toBeInTheDocument();
    });
  });

  it("shows validation errors for invalid input", async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <UserRegistration />
      </QueryClientProvider>
    );

    // Submit form with invalid data
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing Patterns

### User Journey Testing
```typescript
// tests/e2e/user-flows/authentication.test.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test("user can sign up and sign in", async ({ page }) => {
    // Navigate to sign up page
    await page.goto("/signup");

    // Fill out sign up form
    await page.fill('[data-testid="name-input"]', "John Doe");
    await page.fill('[data-testid="email-input"]', "john@example.com");
    await page.fill('[data-testid="password-input"]', "securePassword123");

    // Submit form
    await page.click('[data-testid="signup-button"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();

    // Sign out
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="signout-button"]');

    // Should redirect to home page
    await expect(page).toHaveURL("/");
  });

  test("user can sign in with existing credentials", async ({ page }) => {
    // Navigate to sign in page
    await page.goto("/signin");

    // Fill out sign in form
    await page.fill('[data-testid="email-input"]', "john@example.com");
    await page.fill('[data-testid="password-input"]', "securePassword123");

    // Submit form
    await page.click('[data-testid="signin-button"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText("Welcome, John");
  });
});
```

### Business Scenario Testing
```typescript
// tests/e2e/scenarios/user-management.test.ts
import { test, expect } from "@playwright/test";

test.describe("User Management Scenarios", () => {
  test("admin can manage users", async ({ page }) => {
    // Sign in as admin
    await page.goto("/signin");
    await page.fill('[data-testid="email-input"]', "admin@example.com");
    await page.fill('[data-testid="password-input"]', "adminPassword");
    await page.click('[data-testid="signin-button"]');

    // Navigate to user management
    await page.goto("/admin/users");
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();

    // Create new user
    await page.click('[data-testid="create-user-button"]');
    await page.fill('[data-testid="user-name-input"]', "Jane Doe");
    await page.fill('[data-testid="user-email-input"]', "jane@example.com");
    await page.selectOption('[data-testid="user-role-select"]', "user");
    await page.click('[data-testid="save-user-button"]');

    // Verify user was created
    await expect(page.locator('[data-testid="user-row"]')).toContainText("Jane Doe");
    await expect(page.locator('[data-testid="user-row"]')).toContainText("jane@example.com");

    // Edit user
    await page.click('[data-testid="edit-user-button"]');
    await page.fill('[data-testid="user-name-input"]', "Jane Smith");
    await page.click('[data-testid="save-user-button"]');

    // Verify user was updated
    await expect(page.locator('[data-testid="user-row"]')).toContainText("Jane Smith");

    // Delete user
    await page.click('[data-testid="delete-user-button"]');
    await page.click('[data-testid="confirm-delete-button"]');

    // Verify user was deleted
    await expect(page.locator('[data-testid="user-row"]')).not.toBeVisible();
  });
});
```

## Mock and Fixture Patterns

### API Mocking
```typescript
// tests/mocks/handlers.ts
import { rest } from "msw";

export const handlers = [
  rest.get("/api/users/:id", (req, res, ctx) => {
    const { id } = req.params;

    if (id === "1") {
      return res(
        ctx.json({
          success: true,
          data: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
        })
      );
    }

    return res(
      ctx.status(404),
      ctx.json({
        success: false,
        error: "User not found",
      })
    );
  }),

  rest.post("/api/users", (req, res, ctx) => {
    const body = req.body as any;

    if (!body.name || !body.email) {
      return res(
        ctx.status(400),
        ctx.json({
          success: false,
          error: "Validation failed",
          details: {
            name: ["Name is required"],
            email: ["Email is required"],
          },
        })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: "2",
          name: body.name,
          email: body.email,
        },
      })
    );
  }),
];
```

### Test Fixtures
```typescript
// tests/fixtures/users.ts
export const userFixtures = {
  validUser: {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: new Date("2023-01-01"),
  },

  adminUser: {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date("2023-01-01"),
  },

  invalidUser: {
    id: "3",
    name: "",
    email: "invalid-email",
    role: "user",
  },
};

export const createUserFixture = (overrides = {}) => ({
  ...userFixtures.validUser,
  ...overrides,
});
```

### Database Fixtures
```typescript
// tests/fixtures/database.ts
import { db } from "@/db";
import { userTable } from "@/db/schema";

export async function createTestUser(overrides = {}) {
  const [user] = await db.insert(userTable).values({
    id: "test-user-1",
    name: "Test User",
    email: "test@example.com",
    ...overrides,
  }).returning();

  return user;
}

export async function createTestUsers(count: number) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const [user] = await db.insert(userTable).values({
      id: `test-user-${i + 1}`,
      name: `Test User ${i + 1}`,
      email: `test${i + 1}@example.com`,
    }).returning();

    users.push(user);
  }

  return users;
}

export async function cleanupTestData() {
  await db.delete(userTable);
}
```

## Test Utilities

### Custom Render Function
```typescript
// tests/utils/test-utils.tsx
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient = new QueryClient(), ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
```

### Test Helpers
```typescript
// tests/utils/test-helpers.ts
import { waitFor } from "@testing-library/react";

export async function waitForLoadingToFinish() {
  await waitFor(() => {
    expect(document.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
  });
}

export async function waitForErrorMessage() {
  await waitFor(() => {
    expect(document.querySelector('[data-testid="error"]')).toBeInTheDocument();
  });
}

export function createMockUser(overrides = {}) {
  return {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    ...overrides,
  };
}
```

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the scenario
- Follow the AAA pattern: Arrange, Act, Assert
- Keep tests focused and independent

### 2. Test Data Management
- Use fixtures for consistent test data
- Clean up test data after each test
- Avoid hardcoded values in tests
- Use factories for creating test objects

### 3. Mocking Strategy
- Mock external dependencies
- Use MSW for API mocking
- Mock at the right level (not too high, not too low)
- Keep mocks simple and focused

### 4. Assertion Patterns
- Use specific assertions over generic ones
- Test both positive and negative cases
- Verify error messages and edge cases
- Check accessibility attributes

### 5. Performance Considerations
- Run tests in parallel when possible
- Use appropriate test timeouts
- Avoid unnecessary waits
- Clean up resources properly

This comprehensive testing strategy ensures that the application is reliable, maintainable, and meets quality standards while providing confidence in code changes and deployments.
