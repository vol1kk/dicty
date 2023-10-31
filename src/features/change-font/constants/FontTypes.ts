import { Poppins, Merriweather, Inconsolata } from "next/font/google";

export const PoppinsFont = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const InconsolataFont = Inconsolata({
  display: "swap",
  subsets: ["latin"],
});

export const MerriweatherFont = Merriweather({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const FontTypes = [
  {
    name: "Sans-Serif",
    className: PoppinsFont.className,
  },
  {
    name: "Serif",
    className: MerriweatherFont.className,
  },
  {
    name: "Mono",
    className: InconsolataFont.className,
  },
] as const;

export default FontTypes;
