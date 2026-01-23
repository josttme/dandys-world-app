// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [
      // @ts-expect-error - Tailwind types conflict with Vite types in some versions
      tailwindcss(),
    ],
  },
});
