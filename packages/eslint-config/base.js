import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";

export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      onlyWarn,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
  {
    ignores: ["dist/**"],
  },
];
