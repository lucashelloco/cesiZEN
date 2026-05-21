import { test, expect } from "@playwright/test";

test.describe("Authentification", () => {
  test("la page /login affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible();
  });

  test("affiche un lien vers la page d'inscription", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /créer un compte|s'inscrire/i })).toBeVisible();
  });

  test("la page /register affiche le formulaire d'inscription", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /inscription|créer/i })).toBeVisible();
    await expect(page.getByLabel(/nom/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("affiche une erreur avec des identifiants invalides", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("nope@nope.com");
    await page.getByLabel(/mot de passe/i).fill("mauvaismdp");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 8000 });
  });

  test("redirige vers /login si accès à /profil sans authentification", async ({ page }) => {
    await page.goto("/profil");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirige vers /login si accès à /admin sans authentification", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});
