import { test, expect } from '@playwright/test';

test('submit call back form and reach Thank You page', async ({ page }) => {
  await page.goto('https://test.netlify.app/');
  await page.getByLabel('NAME').fill('Evgeni');
  await page.getByLabel('EMAIL').fill('test@example.com');
  await page.getByLabel('PHONE').fill('000-0000000');
  await page.getByLabel('COMPANY').fill('EvgAutomation');
  await page.getByLabel('WEBSITE').fill('https://example.com');
  await page.getByLabel('Number of Employees').selectOption('51-500');
  await page.screenshot({ path: 'screenshots/request-callback.png', fullPage: true });
  await page.getByRole('button', { name: 'Request a Call Back' }).click();
  await expect(page).toHaveURL(/thank-you\.html/);
  await expect(page).toHaveURL(/number_of_employees=51-500/);
  await expect(page.getByRole('heading', { name: 'Thank You!' })).toBeVisible();
  console.log('Reached the Thank You page');
});