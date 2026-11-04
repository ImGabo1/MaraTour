import { defineConfig } from "vitest/config";

// Config propia: sin este archivo Vitest sigue subiendo directorios y puede
// encontrar un vitest.config.ts ajeno (por ejemplo en la carpeta personal).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
