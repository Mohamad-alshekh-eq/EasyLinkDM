import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0, // don't retry locally
  workers: 4,
  timeout: 20_000,
  reporter: [["html", { open: "never" }], ["list"]],

  projects: [
    {
      name: "api",
      testMatch: "**/tests/api/**/*.spec.ts",
      use: {
        baseURL: "https://restful-booker.herokuapp.com",
        extraHTTPHeaders: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    },
    {
      name: "ui",
      testMatch: "**/tests/ui/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://www.saucedemo.com",
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
        video: "retain-on-failure",
      },
    },
  ],
});
