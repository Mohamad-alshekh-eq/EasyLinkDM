import { test, expect } from "../../fixtures/ui.fixtures";
import { env } from "../../config/env";
import { InventoryPage } from "../../pages/inventory.page";

test.describe("Login", () => {
  test(" user can login and see products", async ({ loginPage, page }) => {
    await loginPage.login(env.saucedemo.standardUser, env.saucedemo.password);

    await expect(page).toHaveURL(/inventory/);
    // make sure the product list is loaded into the page
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("locked out user should see an error", async ({ loginPage }) => {
    await loginPage.login("locked_out_user", env.saucedemo.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("locked out");
  });

  test("wrong password shows error", async ({ loginPage }) => {
    await loginPage.login(env.saucedemo.standardUser, "wrongpassword");

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "Username and password do not match",
    );
  });

  test("empty fields show validation error", async ({ loginPage }) => {
    await loginPage.login("", "");

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText("Username is required");
  });

  test("performance glitch user can still login", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("performance_glitch_user", env.saucedemo.password);

    await expect(page).toHaveURL(/inventory/, { timeout: 15_000 });
    await expect(page.locator(".inventory_list")).toBeVisible();
  });

  test("problem user : product images all have same image", async ({
    loginPage,
    page,
  }) => {
    await loginPage.login("problem_user", env.saucedemo.password);
    await page.waitForURL("**/inventory.html");

    const inventoryPage = new InventoryPage(page);
    const srcs = await inventoryPage
      .getProductImages()
      .evaluateAll((imgs: HTMLImageElement[]) =>
        imgs.map((img) => img.getAttribute("src")),
      );

    const uniqueSrcs = new Set(srcs);
    // product images should be different, doesn't make sense for all product to have same image
    expect(uniqueSrcs.size).toBeGreaterThan(1);
  });
});
