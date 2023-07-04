import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#a445ed",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
        inconsolata: ["Inconsolata", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
