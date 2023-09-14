import { type Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

const config = {
  darkMode: "class",
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
      screens: {
        mobile: { max: "425px" },
        "mobile-header": { max: "525px" },
      },
      boxShadow: {
        "3xl": "0 25px 60px 15px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default withMT(config);
