import { defineConfig, devices } from '@playwright/test'

const backendPort = process.env.E2E_BACKEND_PORT ?? '18080'
const frontendPort = process.env.E2E_FRONTEND_PORT ?? '5173'
const backendURL = `http://127.0.0.1:${backendPort}`
const frontendURL = `http://127.0.0.1:${frontendPort}`
const reuseServers = process.env.PW_REUSE_SERVERS === 'true'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: frontendURL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: '"C:\\Program Files\\Go\\bin\\go.exe" run ./cmd/api',
      cwd: '../backend',
      env: {
        PORT: backendPort,
      },
      reuseExistingServer: reuseServers,
      timeout: 30_000,
      url: `${backendURL}/health`,
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${frontendPort}`,
      env: {
        VITE_API_BASE_URL: backendURL,
      },
      reuseExistingServer: reuseServers,
      timeout: 30_000,
      url: frontendURL,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
