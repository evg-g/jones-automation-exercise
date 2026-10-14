# QA Automation Standards

Standards for Playwright UI and API test automation. Apply them from the first version
of any automation project, including interview home tasks, even when the task says
"simple" or "an automation file". Reviewers judge structure and maintainability, not
only whether the written steps pass.

Example of a project built this way: https://github.com/evg-g/jones-automation-exercise

## Scope

- Always: the core structure and code rules below.
- Add extras (auth setup, API helpers, tags, more browsers) only when the task needs them.
  Don't over-engineer a small task: no Allure, Docker or custom frameworks unless asked.
- If the expectations are unclear, tell the user and suggest asking the company
  (for example, "framework structure or a simple script?").

## Stack

- `@playwright/test` (the test runner), not a plain library script.
- Language: what the task asks for. If not stated, prefer TypeScript.
- Node.js active LTS (currently 22 or 24). Set `engines` in `package.json` and the same
  version in CI.
- ES modules (`"type": "module"`).

## Project structure

```
pages/            one Page Object per page; BasePage holds shared actions
tests/            *.spec files: steps only
test-data/        test data and data builders (fake values only)
config/           environment config: BASE_URL and other values from .env, with defaults
fixtures/         custom fixtures that give tests ready Page Objects / API helpers
api/              API helpers for test setup (only when needed)
.github/workflows CI
playwright.config, eslint.config, .prettierrc.json, .env.example, README.md
```

Create a folder only when there is something to put in it.

## Page Objects and locators

- Locators are defined once, in the Page Object constructor. Methods describe user
  actions (`fillForm`, `submit`), and each method does one thing.
- Every page class extends `BasePage`.
- No selectors, test data or URLs in spec files.
- Locator priority: `getByRole` > `getByLabel` > `getByPlaceholder` / `getByText` >
  `getByTestId` > CSS/XPath (last resort, never long chains or copied XPath).

## Tests and assertions

- Clear test names that say what is checked and the expected result.
- `test.describe` for grouping, `test.step` for named steps, `test.beforeEach` for
  shared setup. Each test is independent and can run alone, in any order.
- Web-first assertions only (`await expect(...)`). Reusable checks live in Page Objects
  as `expect*()` methods. Never use `waitForTimeout` or fixed sleeps.
- At least one negative test next to each happy path. Don't write tests that accept a
  known bug as correct; report the bug instead.
- Tag tests when there are several kinds (`@smoke`, `@regression`) and run them with
  `--grep`.

## Test data and environments

- Test data lives in `test-data/`. Use unique values where the system needs them
  (timestamp or a faker library), for example for sign-up emails.
- Prepare data through the API (`request` fixture) instead of the UI when possible.
- Login: authenticate once in a setup project and reuse `storageState`; never log in
  through the UI in every test.
- `baseURL` comes from config; values that change per environment come from environment
  variables. Secrets only in `.env` (git-ignored); document all variables in
  `.env.example`. Never commit credentials.

## Configuration

- `playwright.config`: `baseURL` from config, `forbidOnly` on CI, retries and 1 worker
  on CI, `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`, list + HTML
  reporters. No commented-out boilerplate.
- Chromium by default; add Firefox and WebKit projects when cross-browser matters.
- npm scripts: `test`, `test:headed`, `report`, `lint`, `format`, `format:check`.

## Code quality and CI

- ESLint with `eslint-plugin-playwright` (set `assertFunctionPatterns: ['^expect[A-Z]']`
  so Page Object checks count as assertions) and Prettier.
- Naming: PascalCase classes, camelCase methods and variables, names that say what
  they hold. Comments only to explain why.
- GitHub Actions on push and pull request: `npm ci`, lint, format check, install
  browsers, run tests, upload the HTML report.
- `.gitignore`: `node_modules/`, `test-results/`, `playwright-report/`, `.env`.
- Git: work on a branch, small commits with clear messages, merge through a pull
  request after CI passes.

## Before delivery

1. `npm run lint` and `npm run format:check` pass.
2. `npx playwright test --repeat-each=5` passes every time.
3. README: what it does, requirements, install, run, expected output, structure,
   decisions, and any bugs found (steps, expected, actual).
4. Re-read the task and check every requirement, including non-code questions.
