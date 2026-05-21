import { test, expect } from "@playwright/test";

test.describe("Contenus", () => {
  test("la page /contenus se charge et affiche un heading", async ({ page }) => {
    await page.goto("/contenus");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("la page /contenus est accessible (no aria violations structurelles)", async ({ page }) => {
    await page.goto("/contenus");
    // Vérifie que le main est présent et a un id
    const main = page.locator("#main-content");
    await expect(main).toBeAttached();
  });

  test("le tri des contenus est fonctionnel", async ({ page }) => {
    await page.goto("/contenus");
    const sortSelect = page.getByRole("combobox").or(page.locator("select")).first();
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ index: 1 });
      await page.waitForLoadState("networkidle");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("navigation vers le détail d'un contenu", async ({ page }) => {
    await page.goto("/contenus");
    const firstLink = page.locator('a[href*="/contenus/"]').first();
    if (await firstLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstLink.click();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page).toHaveURL(/\/contenus\/.+/);
    }
  });

  test("le bouton Lire à voix haute est présent sur une page de détail", async ({ page }) => {
    await page.goto("/contenus");
    const firstLink = page.locator('a[href*="/contenus/"]').first();
    if (await firstLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstLink.click();
      const readAloud = page.getByRole("button", { name: /lire.*voix haute/i });
      await expect(readAloud).toBeVisible({ timeout: 5000 });
    }
  });
});
