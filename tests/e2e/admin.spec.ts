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

test.describe("Espace Admin — interface (utilisateur admin requis)", () => {
  test.skip(
    !process.env.ADMIN_EMAIL,
    "Définir ADMIN_EMAIL et ADMIN_PASSWORD pour tester l'interface admin"
  );

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel(/mot de passe/i).fill(process.env.ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await page.waitForURL(/\/admin/);
  });

  test("le dashboard affiche les statistiques", async ({ page }) => {
    await expect(page.getByText(/utilisateurs/i)).toBeVisible();
    await expect(page.getByText(/contenus/i).first()).toBeVisible();
  });

  test("la sidebar contient les liens de navigation admin", async ({ page }) => {
    await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contenus/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /utilisateurs/i })).toBeVisible();
  });
});
