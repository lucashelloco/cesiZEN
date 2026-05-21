import { test, expect } from "@playwright/test";

test.describe("Page d'accueil", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("affiche le titre CesiZen dans l'onglet", async ({ page }) => {
    await expect(page).toHaveTitle(/CesiZen/i);
  });

  test("affiche un heading principal visible", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("le lien d'évitement est focusable et pointe vers #main-content", async ({ page }) => {
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /aller au contenu principal/i });
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("la navigation principale contient les liens Contenus et Exercice", async ({ page }) => {
    await expect(page.getByRole("link", { name: /contenus/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /exercice/i }).first()).toBeVisible();
  });

  test("le footer est visible", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
  });
});
