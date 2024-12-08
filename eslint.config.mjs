// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: [".husky/", "coverage/", "dist/", "docs/", "eslint.config.mjs"],
    //files: ["src/**/*.ts"],
  },
);