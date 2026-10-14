import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class CallBackPage extends BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page, '/');
    this.nameInput = page.getByLabel('NAME');
    this.emailInput = page.getByLabel('EMAIL');
    this.phoneInput = page.getByLabel('PHONE');
    this.companyInput = page.getByLabel('COMPANY');
    this.websiteInput = page.getByLabel('WEBSITE');
    this.employeesSelect = page.getByLabel('Number of Employees');
    this.requestCallBackButton = page.getByRole('button', { name: 'Request a Call Back' });
  }

  /**
   * @param {{ name: string, email: string, phone: string, company: string, website: string }} data
   */
  async fillForm({ name, email, phone, company, website }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.companyInput.fill(company);
    await this.websiteInput.fill(website);
  }

  /** @param {string} range e.g. '51-500' */
  async selectNumberOfEmployees(range) {
    await this.employeesSelect.selectOption(range);
  }

  async submit() {
    await this.requestCallBackButton.click();
  }

  async expectWebsiteRejected() {
    await expect(this.page).not.toHaveURL(/thank-you\.html/);
    const isValid = await this.websiteInput.evaluate((input) => input.validity.valid);
    expect(isValid).toBe(false);
  }
}
