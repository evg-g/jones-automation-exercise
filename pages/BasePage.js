export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} path URL path of the page, relative to baseURL
   */
  constructor(page, path = '/') {
    this.page = page;
    this.path = path;
  }

  async open() {
    await this.page.goto(this.path);
  }

  /** @param {string} filePath */
  async takeScreenshot(filePath) {
    await this.page.screenshot({ path: filePath, fullPage: true });
  }
}
