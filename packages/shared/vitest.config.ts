import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: ["**/.pnpm-store/**", "**/node_modules/**"],
    include: ["src/__tests__/**/*.test.ts"]
  }
});
