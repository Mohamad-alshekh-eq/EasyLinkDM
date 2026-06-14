import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { InventoryPage } from "../pages/inventory.page";
import { env } from "../config/env";

type UiFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.goto();
    await use(lp);
  },

  inventoryPage: async ({ page }, use) => {
    const lp = new LoginPage(page);
    await lp.goto();
    await lp.login(env.saucedemo.standardUser, env.saucedemo.password);
    await page.waitForURL("**/inventory.html");
    await use(new InventoryPage(page));
  },
});

export { expect } from "@playwright/test";
