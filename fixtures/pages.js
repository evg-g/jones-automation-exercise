import { test as base } from '@playwright/test';
import { CallBackPage } from '../pages/CallBackPage.js';
import { ThankYouPage } from '../pages/ThankYouPage.js';

// Gives each test ready page objects, so tests don't create them by hand.
export const test = base.extend({
  callBackPage: async ({ page }, use) => {
    await use(new CallBackPage(page));
  },
  thankYouPage: async ({ page }, use) => {
    await use(new ThankYouPage(page));
  },
});

export { expect } from '@playwright/test';
