import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class ThankYouPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, '/thank-you.html');
    this.heading = page.getByRole('heading', { name: 'Thank You!' });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/thank-you\.html/);
    await expect(this.heading).toBeVisible();
  }

  /** @param {string} range */
  async expectSentNumberOfEmployees(range) {
    await expect(this.page).toHaveURL(new RegExp(`number_of_employees=${range}`));
  }
}
