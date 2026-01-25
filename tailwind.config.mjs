/** @type {import('tailwindcss').Config} */
export default {
  // Aseguramos que Tailwind escanee todos tus archivos en busca de clases
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    extend: {
      fontFamily: {
        // 1. FUENTE DE CUERPO (Lectura)
        // 'Inter' será la fuente predeterminada del sitio.
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],

        // 2. FUENTE DE TÍTULOS (Gaming/Tech)
        // Usa la clase 'font-display' para títulos grandes o números.
        display: ["Rajdhani", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      // Opcional: Extensión de animaciones si quieres efectos suaves luego
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
