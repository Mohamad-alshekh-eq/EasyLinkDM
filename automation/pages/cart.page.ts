import { Page, Locator } from "@playwright/test";

export class CartPage {
  items: Locator;
  private checkoutBtn: Locator;

  constructor(private page: Page) {
    this.items = page.locator(".cart_item");
    this.checkoutBtn = page.locator('[data-test="checkout"]');
  }

  async checkout() {
    await this.checkoutBtn.click();
  }

  async getItemNames() {
    return this.page.locator(".inventory_item_name").allTextContents();
  }
}
