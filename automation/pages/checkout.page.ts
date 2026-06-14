import { Page, Locator } from '@playwright/test';

// handles checkout step one (info), step two (overview), and the complete screen
export class CheckoutPage {
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private postalCodeInput: Locator;
  private continueBtn: Locator;
  private finishBtn: Locator;
  errorMessage: Locator;
  summaryTotal: Locator;
  confirmationHeader: Locator;

  constructor(page: Page) {
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueBtn     = page.locator('[data-test="continue"]');
    this.finishBtn       = page.locator('[data-test="finish"]');
    this.errorMessage    = page.locator('[data-test="error"]');
    this.summaryTotal    = page.locator('.summary_total_label');
    this.confirmationHeader = page.locator('.complete-header');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueBtn.click();
  }

  async finish() {
    await this.finishBtn.click();
  }
}
