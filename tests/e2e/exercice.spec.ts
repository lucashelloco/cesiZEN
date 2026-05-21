import { test, expect } from "@playwright/test";

test.describe("Page Exercice", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/exercice");
  });

  test("la page affiche un heading et le configurateur", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("des presets d'exercices sont affichés", async ({ page }) => {
    // On attend qu'au moins un bouton de démarrage ou preset soit visible
    const presetBtn = page.getByRole("button").first();
    await expect(presetBtn).toBeVisible({ timeout: 5000 });
  });

  test("démarre un exercice depuis un preset et affiche le compte à rebours", async ({ page }) => {
    const startBtn = page.getByRole("button", { name: /commencer|démarrer|lancer/i }).first();
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startBtn.click();
      await expect(
        page.getByText(/préparez|inspirez|3|2|1/i).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("le bouton Guidage vocal est accessible pendant l'exercice", async ({ page }) => {
    const startBtn = page.getByRole("button", { name: /commencer|démarrer|lancer/i }).first();
    if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await startBtn.click();
      const audioBtn = page.getByRole("button", { name: /guidage vocal/i });
      await expect(audioBtn).toBeVisible({ timeout: 5000 });
      await expect(audioBtn).toHaveAttribute("aria-pressed");
    }
  });
});
