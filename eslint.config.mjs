import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

export default [
  // 1. GLOBAL IGNORES (¡Lo que faltaba!)
  // Le decimos a ESLint: "Ni mires estas carpetas"
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "public/",
      "*.d.ts",
      "tailwind.config.mjs",
      "astro.config.mjs",
      "migrate-dates.js",
    ],
  },

  // 2. Configuración global de entorno
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 3. Recomendados de TypeScript y Astro
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,

  // 4. Configuración específica para React
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
  },

  // 5. Reglas personalizadas
  {
    rules: {
      "no-unused-vars": "off", // Apagamos la regla base de JS
      "@typescript-eslint/no-unused-vars": ["warn"], // Usamos la de TS que es más inteligente
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
