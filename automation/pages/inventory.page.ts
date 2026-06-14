import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  cartBadge: Locator;
  private cartLink: Locator;
  private items: Locator;

  constructor(private page: Page) {
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartLink = page.locator(".shopping_cart_link");
    this.items = page.locator(".inventory_item");
  }

  // finds the item by name then clicks on add to cart button
  async addToCart(itemName: string) {
    const item = this.items.filter({ hasText: itemName });
    await item.getByRole("button", { name: /add to cart/i }).click();
  }

  async removeFromCart(itemName: string) {
    const item = this.items.filter({ hasText: itemName });
    await item.getByRole("button", { name: /remove/i }).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  getProductImages() {
    return this.page.locator(".inventory_item_img img");
  }

  getItemCount() {
    return this.items.count();
  }
}
