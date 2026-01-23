// tailwind.config.mjs
export default {
  theme: {
    extend: {
      animation: {
        "float-particle": "floatParticle linear infinite",
      },
      keyframes: {
        floatParticle: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "20%": { opacity: "0.6" },
          "80%": { opacity: "0.6" },
          "100%": {
            transform: "translateY(-100vh) rotate(360deg)",
            opacity: "0",
          },
        },
      },
    },
  },
};
