import { test, expect } from "../../fixtures/ui.fixtures";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { products } from "../../support/test-data/products";
import { messages } from "../../support/test-data/messages";

test.describe("Cart", () => {
  test("adding an item updates the cart badge", async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);

    await expect(inventoryPage.cartBadge).toHaveText("1");
  });

  test("can add multiple items and badge count is correct", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);

    await expect(inventoryPage.cartBadge).toHaveText("2");
  });

  test("removing an item from inventory updates the badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.removeFromCart(products.backpack);

    // badge should disappear when cart is empty
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test("cart shows the correct items", async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.fleeceJacket);
    await inventoryPage.goToCart();

    const cart = new CartPage(page);
    const names = await cart.getItemNames();

    expect(names).toContain(products.backpack);
    expect(names).toContain(products.fleeceJacket);
    expect(await cart.items.count()).toBe(2);
  });
});

test.describe("Checkout", () => {
  test("complete checkout flow from cart to confirmation", async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.goToCart();

    const cart = new CartPage(page);
    await expect(cart.items).toHaveCount(1);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillInfo("John", "Doe", "12345");

    // overify total is shown in the overall page
    await expect(checkout.summaryTotal).toBeVisible();
    await expect(checkout.summaryTotal).toContainText("Total");

    await checkout.finish();

    await expect(checkout.confirmationHeader).toBeVisible();
    await expect(checkout.confirmationHeader).toHaveText(messages.checkout.orderConfirmation);
  });

  test("checkout step 1 requires all fields", async ({
    inventoryPage,
    page,
  }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.goToCart();

    const cart = new CartPage(page);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    // try to continue with no info
    await checkout.fillInfo("", "", "");

    await expect(checkout.errorMessage).toBeVisible();
    await expect(checkout.errorMessage).toContainText(messages.checkout.firstNameRequired);
  });
});
