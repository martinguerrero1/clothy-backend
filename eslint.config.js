import js from "@eslint/js";
import globals from "globals";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["node_modules", "dist", "coverage"],
  },
  {
    files: ["**/*.js"],

    extends: [js.configs.recommended, eslintConfigPrettier],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.node,
      },
    },

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      // ============================
      // BUENAS PRÁCTICAS
      // ============================
      eqeqeq: ["error", "always"], // Siempre === y !==
      curly: ["error", "all"], // Siempre usar llaves
      "no-var": "error", // Prohibir var
      "prefer-const": "error", // const siempre que sea posible
      "object-shorthand": "error", // { nombre } en vez de { nombre: nombre }

      // ============================
      // POSIBLES BUGS
      // ============================
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": "off", // En backend console.log es normal
    },
  },
]);
