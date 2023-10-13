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
        "mobile-header": { max: "600px" },
        "mobile-small": { max: "300px" },
      },
      boxShadow: {
        "3xl": "0 0 60px 15px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default withMT(config);
