import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import promisePlugin from "eslint-plugin-promise";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],

    plugins: {
      import: importPlugin,
      promise: promisePlugin,
    },

    languageOptions: {
      globals: globals.browser,
    },

    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      "eqeqeq": "error",
      "curly": "error",
      "prefer-const": "error",
      "no-var": "error",

      "import/no-unresolved": "error",
      "import/order": "warn",

      "promise/catch-or-return": "error",
      "promise/no-return-wrap": "error",
    },
  },
];