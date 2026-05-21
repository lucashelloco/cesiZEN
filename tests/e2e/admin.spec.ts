import { test, expect } from "@playwright/test";

test.describe("Espace Admin — contrôle d'accès", () => {
  test("redirige vers /login si non authentifié sur /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige vers /login si non authentifié sur /admin/contenus", async ({ page }) => {
    await page.goto("/admin/contenus");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige vers /login si non authentifié sur /admin/users", async ({ page }) => {
    await page.goto("/admin/users");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige vers /login si non authentifié sur /admin/exercices", async ({ page }) => {
    await page.goto("/admin/exercices");
    await expect(page).toHaveURL(/\/login/);
  });
});

