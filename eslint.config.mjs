import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // No stray console.log in production code (deliberate error/warn/info logging is allowed).
      "no-console": ["error", { allow: ["error", "warn", "info"] }],
    },
  },
  {
    files: ["scripts/**"],
    rules: { "no-console": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
]);
