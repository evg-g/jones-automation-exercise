import { test } from '../fixtures/pages.js';
import {
  validCallBackData,
  websiteWithoutProtocolData,
  employeesRange,
  SCREENSHOT_PATH,
} from '../test-data/callBackData.js';

test.describe('Request a call back', () => {
  test.beforeEach(async ({ callBackPage }) => {
    await callBackPage.open();
  });

  test('submit the form and reach the Thank You page', async ({ callBackPage, thankYouPage }) => {
    await test.step('Fill the form', async () => {
      await callBackPage.fillForm(validCallBackData);
      await callBackPage.selectNumberOfEmployees(employeesRange.bonus);
    });

    await test.step('Take a screenshot before submit', async () => {
      await callBackPage.takeScreenshot(SCREENSHOT_PATH);
    });

    await test.step('Submit the form', async () => {
      await callBackPage.submit();
    });

    await test.step('Check the Thank You page', async () => {
      await thankYouPage.expectLoaded();
      await thankYouPage.expectSentNumberOfEmployees(employeesRange.bonus);
      console.log('Reached the Thank You page');
    });
  });

  test('block the form when the website has no https://', async ({ callBackPage }) => {
    await callBackPage.fillForm(websiteWithoutProtocolData);
    await callBackPage.submit();
    await callBackPage.expectWebsiteRejected();
  });
});
