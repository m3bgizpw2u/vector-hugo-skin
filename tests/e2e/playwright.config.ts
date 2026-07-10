// Stub — implementation lands in Phase 10. See .cursor/rules/50-testing.mdc.
// Uses system-installed Chromium/Firefox on CachyOS per launchOptions.executablePath.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:1313',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Workspace-as-theme per docs/ARCHITECTURE.md §3:
    // `theme = ""` in exampleSite/hugo.toml makes Hugo treat ..\ as the theme root,
    // so the webServer command must omit --theme and --themesDir.
    command: 'hugo server --source ../exampleSite --port 1313',
    url: 'http://localhost:1313',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        launchOptions: { executablePath: '/usr/bin/chromium' },
      },
    },
    {
      name: 'firefox',
      use: {
        launchOptions: { executablePath: '/usr/bin/firefox' },
      },
    },
  ],
});
