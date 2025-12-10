import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/project2",
  resolve: {},
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", "e2e", "tests"],
    alias: {
      "\\.module\\.css$": path.resolve(__dirname, "src/__mocks__/styleMock.ts"),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      lines: 80, // optional: fail if coverage below 80%
      functions: 80,
      branches: 70,
      statements: 80,
      exclude: [
        "**/*.css",
        "**/*.module.css",
        "**/*.scss",
        "**/*.sass",
        "**/*.less",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.svg",
        "**/assets/**",
      ],
    },
  },
} as UserConfig);

// skal kun kjøre tester som heter ".test.ts" og som er i src
// tests mappen burde ignoreres her
