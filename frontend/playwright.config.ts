import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: '"C:\\Program Files\\Go\\bin\\go.exe" run ./cmd/api',
      cwd: '../backend',
      env: {
        PORT: '18080',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      url: 'http://127.0.0.1:18080/health',
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      env: {
        VITE_API_BASE_URL: 'http://127.0.0.1:18080',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      url: 'http://127.0.0.1:5173',
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
