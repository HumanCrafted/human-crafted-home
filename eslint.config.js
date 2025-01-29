const { dirname } = require("path");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "eslint:recommended"),
  {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      project: "./tsconfig.json",
    },
    env: {
      es6: true,
      browser: true,
      node: true,
    },
    plugins: ["@typescript-eslint"],
    rules: {}
  },
];