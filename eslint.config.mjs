import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...[
    {
      files: ["src/plugins/**/*"],
      rules: {
        "import/no-restricted-paths": [
          "error",
          {
            zones: [
              {
                target: "./src/plugins",
                from: "./src/app",
              },
              {
                target: "./src/plugins",
                from: "./src/pages",
              },
              {
                target: "./src/plugins",
                from: "./src/widgets",
              },
              {
                target: "./src/plugins",
                from: "./src/features",
              },
              {
                target: "./src/plugins",
                from: "./src/entities",
              },
            ],
          },
        ],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { 
            "vars": "all",
            "varsIgnorePattern": "^_", // Игнорировать переменные, начинающиеся с _
            "args": "after-used",
            "argsIgnorePattern": "^_", // Игнорировать аргументы функций, начинающиеся с _
            "ignoreRestSiblings": true
          }
        ]
      },
    }
  ],
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
