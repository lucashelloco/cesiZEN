import { test, expect } from "@playwright/test";

test.describe("Espace Admin — interface (utilisateur admin connecté)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin");
    // Si le setup n'a pas tourné (pas de ADMIN_EMAIL), on est redirigé vers /login
    if (page.url().includes("/login")) {
      test.skip(true, "Session admin absente — relancer avec ADMIN_EMAIL et ADMIN_PASSWORD définis");
    }
  });

  test("le dashboard affiche les statistiques", async ({ page }) => {
    const main = page.locator("#main-content");
    await expect(main.getByText(/utilisateurs/i).first()).toBeVisible();
    await expect(main.getByText(/contenus/i).first()).toBeVisible();
  });

  test("la sidebar contient les liens de navigation admin", async ({ page }) => {
    await expect(page.getByRole("link", { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /contenus/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /utilisateurs/i })).toBeVisible();
  });

  test("le dashboard admin reste en fond blanc quelle que soit la préférence thème", async ({ page }) => {
    const wrapper = page.locator(".force-light").first();
    await expect(wrapper).toBeVisible();
    await expect(wrapper).toHaveCSS("color-scheme", "light");
  });
});
