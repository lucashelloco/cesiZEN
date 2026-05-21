import "@testing-library/jest-dom";
import { vi } from "vitest";

// ── Mocks Next.js ────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: () => new Headers(),
  cookies: () => ({ get: vi.fn(), set: vi.fn() }),
}));

vi.mock("server-only", () => ({}));

// ── Mocks internes ───────────────────────────────────────────────────────────

vi.mock("@/env", () => ({
  env: {
    DATABASE_URL: "postgresql://test:test@localhost/test",
    BETTER_AUTH_URL: "http://localhost:3000",
    BETTER_AUTH_SECRET: "test-secret",
    NODE_ENV: "test",
  },
}));

vi.mock("@/server/better-auth", () => ({
  auth: {
    api: { getSession: vi.fn().mockResolvedValue(null) },
    handler: vi.fn(),
  },
}));

vi.mock("@/server/better-auth/server", () => ({
  getSession: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/server/db", () => ({
  db: {
    contenu: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    exerciceCardiaque: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));
