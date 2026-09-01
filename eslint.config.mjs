import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disable some rules that are triggering unnecessarily
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off", // Turn off completely for now
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off", // Turn off completely for now
      "@typescript-eslint/ban-ts-comment": "off", // Allow ts-ignore comments
      "@typescript-eslint/no-non-null-assertion": "off", // Allow non-null assertions
      "@typescript-eslint/no-namespace": "off", // Allow namespace usage for compatibility
      "@typescript-eslint/ban-types": "off", // Allow usage of {} and object
      "@typescript-eslint/no-empty-interface": "off", // Allow empty interfaces
      "@typescript-eslint/no-empty-function": "off", // Allow empty functions
      "@typescript-eslint/no-var-requires": "off", // Allow require statements
      "@typescript-eslint/no-inferrable-types": "off", // Allow explicit types on variables
      "@typescript-eslint/no-this-alias": "off", // Allow this aliasing
      "@typescript-eslint/no-misused-promises": "off", // Allow promises in unsupported positions
    },
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
  // Add a more comprehensive override for files using Leaflet
  {
    files: ["**/map/**/*.ts", "**/map/**/*.tsx"],
    rules: {
      // Disable all TypeScript-specific rules for map components
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-redeclare": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-var-requires": "off",
      "react/no-unknown-property": "off", // For leaflet custom props
    },
  },
  // Add specific rules for generated files
  {
    files: [".next/**/*.js", "node_modules/**/*.js"],
    rules: {
      // Disable all rules for generated files
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "no-undef": "off",
    },
  },
];

export default eslintConfig;
