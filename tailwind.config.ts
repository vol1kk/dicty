import { type Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

const config = {
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

export default withMT(config);
