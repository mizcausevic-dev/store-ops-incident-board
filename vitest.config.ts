import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    exclude: ["dist/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      include: ["src/services/**"],
      reporter: ["text", "text-summary", "json-summary"],
      thresholds: {
        statements: 60,
        lines: 60,
        functions: 60,
        branches: 50
      }
    }
  }
});
