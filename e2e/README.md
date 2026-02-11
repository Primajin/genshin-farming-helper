# E2E Tests

This directory contains end-to-end tests using Playwright.

## Running Tests

```bash
# Run all E2E tests
npm run e2e

# Run tests in headed mode (see the browser)
npm run e2e:headed

# Run tests with UI mode (interactive debugging)
npm run e2e:ui

# Run all tests (lint + unit + E2E)
npm run test:all
```

## Test Files

- `preset.spec.js` - Tests for preset functionality including:
  - Toggle preset on/off without duplicates
  - Rapid clicking handling
  - Selector button disabling
  - Merging goals when adding preset after manual item

## Configuration

Playwright configuration is in `playwright.config.js` at the project root.

- Uses Chromium browser by default
- Automatically starts dev server on port 5173
- Generates HTML report on test failure

## Writing Tests

See [Playwright documentation](https://playwright.dev/docs/intro) for more information on writing tests.
