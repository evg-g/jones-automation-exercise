# Jones Automation Exercise

Automation of the "Request a call back" form on https://test.netlify.app/, written with Playwright and JavaScript.

The answers to the questions about the billing form are in [ANSWERS.md](ANSWERS.md).

## What the test does

1. Opens https://test.netlify.app/
2. Fills Name, Email, Phone, Company and Website
3. Changes "Number of Employees" from 1-10 to 51-500 (bonus)
4. Takes a full page screenshot and saves it to `screenshots/request-callback.png`
5. Clicks "Request a call back"
6. Checks that the Thank You page is open:
   - the URL contains `thank-you.html`
   - the URL contains `number_of_employees=51-500` (the bonus value was really sent)
   - the "Thank You!" heading is visible
7. Writes `Reached the Thank You page` to the console

A second test types `example.com` (no `https://`) in Website and checks that the form is blocked.

## Requirements

- Node.js 22 or newer (active LTS)

## Install

```bash
npm ci
npx playwright install chromium
```

On Linux, if the browser fails to start, install the system dependencies too:

```bash
npx playwright install --with-deps chromium
```

## Run

```bash
npm test               # run the tests
npm run test:headed    # run and see the browser
npm run report         # open the HTML report
npm run lint           # check code quality (ESLint)
npm run format         # format the code (Prettier)
```

Run against another site address: copy `.env.example` to `.env` and change `BASE_URL`, or set it in the shell:

```bash
BASE_URL=https://other.site npm test
```

The output should include:

```
Reached the Thank You page
  2 passed
```

## Project structure

The project uses the Page Object Model (POM). Each layer has one job:

```
config/env.js                    site URL (BASE_URL from .env or the shell, with a default)
pages/BasePage.js                actions shared by all pages (open, screenshot)
pages/CallBackPage.js            form locators and actions (fillForm, selectNumberOfEmployees, submit)
pages/ThankYouPage.js            Thank You page locators and checks
test-data/callBackData.js        test data (form values, employee ranges, screenshot path)
fixtures/pages.js                gives tests ready page objects (callBackPage, thankYouPage)
tests/request-callback.spec.js   the test: only the steps, no selectors or data
playwright.config.js             Playwright settings (baseURL, Chromium only)
eslint.config.js                 ESLint rules (with the Playwright plugin)
.prettierrc.json                 Prettier code style
.env.example                     environment variables you can set (BASE_URL)
.github/workflows/playwright.yml CI: runs lint and tests on GitHub on each push and pull request
screenshots/                     the screenshot taken before the click
```

To add a new page: create a class in `pages/` that extends `BasePage`, then add it to `fixtures/pages.js`.

## Notes about my choices

- **JavaScript**, because the exercise talks about JavaScript.
- **Playwright Test runner** (`@playwright/test`) and not a plain script with the Playwright library. The runner gives `expect` checks that wait and retry, a clear test structure and an HTML report. It is the standard way to use Playwright today.
- **Page Object Model.** Selectors live only in the page classes, data only in `test-data/`, and the URL only in `config/`. If the site changes, only one place needs a fix, and the test stays readable.
- **Custom fixtures** create the page objects, so each test gets them as parameters.
- **ESLint + Prettier** keep the code clean and in one style. CI fails if they find a problem.
- **GitHub Actions CI** runs the checks and the test on every push and pull request, and saves the HTML report.
- **`test.step`** splits the test into named steps that show in the report.
- **A second, negative test.** It types `example.com` (no `https://`) in Website and checks that the browser blocks the form. A real project checks what must fail, not only the happy path.
- **Screenshot after the bonus step.** The exercise asks for a screenshot before clicking the button. I take it after all fields are filled and 51-500 is selected, right before the click, so the screenshot shows the full form as it is sent.
- **The console message is printed only after the checks pass.** If the Thank You page does not open, the test fails and nothing is printed.
- **Test data is fake** (`test@example.com`, `000-0000000`, `https://example.com`), because this is a live form.
- The test was checked 5 times in a row (`--repeat-each=5`) and passed every time.

## Observations (outside the exercise scope)

While working on the test I noticed a few problems on the site. I checked each one manually in Chrome, using DevTools (Elements, Network and Console) where needed. Tested in October 2026.

### 1. The form data is not saved, so the lead is lost

**Steps:**

1. Open https://test.netlify.app/ with DevTools open on the Network tab ("Preserve log" on, filter "All").
2. Fill the form and click "Request a call back".

**Expected:** The data is sent to a server that saves it, so someone can call the user back.

**Actual:** The only request with the data is a GET for the static page `thank-you.html`. No request sends the data to a form handler or an API. The user sees "You'll hear from us soon", but as far as I can see from the browser, the business never gets the lead.

**Suggested fix:** Send the form to a backend that saves it. For a site hosted on Netlify, Netlify Forms can do this:

```html
<form name="call-back" method="POST" data-netlify="true" action="/thank-you.html"></form>
```

### 2. Personal details are sent in the URL

**Steps:**

1. Fill the form and click "Request a call back".
2. Look at the address bar on the Thank You page.

**Expected:** Personal details are not visible in the URL.

**Actual:** The form has no `method`, so the browser uses GET. Name, email, phone, company and website appear in the URL, for example:
`thank-you.html?name=...&email=...&phone=...`
This means they can be saved in the browser history and in server and CDN logs.

**Suggested fix:** Use POST (the same change as in item 1):

```html
<form ... method="POST"></form>
```

### 3. The Phone field accepts letters

**Steps:**

1. Fill all fields with valid data, but type `abc` in Phone.
2. Click "Request a call back".

**Expected:** An error message. The form is not sent.

**Actual:** The form is sent and the Thank You page opens. The field is `type="text"` with no validation.

**Suggested fix:**

```html
<input
  id="phone"
  type="tel"
  name="phone"
  required
  pattern="\+?[0-9][0-9 \-]{6,19}"
  placeholder="Your phone number"
  class="input"
/>
```

### 4. The Website placeholder shows a format that the field rejects

**Steps:**

1. Fill all required fields.
2. Type `example.com` in Website, exactly like the placeholder shows.
3. Click "Request a call back".

**Expected:** The value is accepted, or the hint shows the right format.

**Actual:** The browser blocks the form with "Please enter a URL." The field is `type="url"`, so it needs `https://`, but the placeholder is `example.com`. The error message does not explain what is wrong.

**Suggested fix:** Show the right format in the placeholder:

```html
<input id="website" type="url" name="website" placeholder="https://example.com" class="input" />
```

### 5. The font is blocked (mixed content)

**Steps:**

1. Open https://test.netlify.app/ with DevTools open on the Console tab.

**Expected:** No errors in the console. The Open Sans font is loaded.

**Actual:** The page is loaded over HTTPS, but asks for the font CSS over HTTP. Chrome blocks it with a "Mixed Content" error, and the page is shown with a fallback font. The same error appears on the Thank You page.

**Suggested fix:** Load the font over HTTPS:

```html
<link
  href="https://fonts.googleapis.com/css?family=Open+Sans:400,700,600,300,800"
  rel="stylesheet"
  type="text/css"
/>
```
