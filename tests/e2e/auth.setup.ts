import { test as setup, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, ".auth/admin.json");

setup.skip(
  !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
  "Définir ADMIN_EMAIL et ADMIN_PASSWORD pour générer la session admin"
);

setup("authenticate as admin", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel(/mot de passe/i).fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: /se connecter/i }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  await page.context().storageState({ path: authFile });
});
