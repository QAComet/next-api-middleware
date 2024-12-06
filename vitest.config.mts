import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    // reporters: ["html"],
    coverage: {
      enabled: true,
      clean: true,
      cleanOnRerun: true,
      include: ["src/**"],
    },
  },
});
