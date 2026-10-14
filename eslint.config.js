import js from '@eslint/js';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  {
    languageOptions: { globals: globals.node },
  },
  {
    files: ['tests/**/*.js'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Checks live in page objects, in methods named expect...()
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect[A-Z]'] }],
    },
  },
  prettier,
];
