# QA Automation Standards

This project is the reference template for Playwright + JavaScript automation work.
Apply these rules from the first version of any automation task, including interview
home tasks, even when the task says "simple" or "an automation file".

## Why

The first version of this exercise met every written requirement but was rejected.
Reviewers wanted functions, separate files, POM, and selectors, test data and the
site URL kept out of the test code. Reviewers judge structure, not only passing steps.

## Project structure

```
pages/            one Page Object per page; BasePage holds shared actions (open, takeScreenshot)
tests/            *.spec.js files: steps only
test-data/        test data (fake values only)
config/env.js     BASE_URL from .env or the shell, with a default
fixtures/         custom fixtures that give tests ready Page Objects
.github/workflows CI
playwright.config.js, eslint.config.js, .prettierrc.json, .env.example, README.md
```

Create a folder only when there is something to put in it (no empty `utils/`).

## Code rules

- Use `@playwright/test` (the test runner), not a plain library script.
- Page Objects: locators are defined once in the constructor; methods describe user
  actions (`fillForm`, `submit`). Every page class extends `BasePage`.
- No selectors, test data or URLs in spec files.
- Locator priority: `getByRole` > `getByLabel` > `getByPlaceholder` / `getByText` >
  `getByTestId` > CSS/XPath (last resort).
- Checks use web-first `await expect(...)`. Reusable checks live in Page Objects as
  `expect*()` methods. Never use `waitForTimeout`.
- Tests: clear names, `test.describe` for grouping, `test.step` for named steps,
  `test.beforeEach` for shared setup. Each test is independent.
- Write at least one negative test next to the happy path. Do not write tests that
  accept a known bug as correct; report the bug instead.
- `baseURL` in `playwright.config.js` comes from `config/env.js`. Secrets only in
  `.env` (git-ignored); document variables in `.env.example`.
- Config: retries and 1 worker on CI, `trace: 'on-first-retry'`,
  `screenshot: 'only-on-failure'`, list + HTML reporters. No commented-out boilerplate.
- `"type": "module"` in `package.json`, with scripts: `test`, `test:headed`, `report`,
  `lint`, `format`, `format:check`.
- ESLint (with `eslint-plugin-playwright`, `assertFunctionPatterns: ['^expect[A-Z]']`)
  and Prettier (`singleQuote`, `printWidth: 100`).
- GitHub Actions: `npm ci`, lint, format check, install Chromium, run tests, upload
  the HTML report.
- `.gitignore`: `node_modules/`, `test-results/`, `playwright-report/`, `.env`.

## Before delivery

1. `npm run lint` and `npm run format:check` pass.
2. `npx playwright test --repeat-each=5` passes every time.
3. README: what it does, requirements, install, run, expected output, structure,
   decisions, and any bugs found (steps, expected, actual).
4. Re-read the task and check every requirement, including non-code questions.
5. If expectations are unclear, tell the user and suggest asking the company
   (for example, "framework structure or a simple script?").
