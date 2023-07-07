/* eslint-disable @typescript-eslint/no-unsafe-call */
import Header from "~/components/Header/Header";
import useUserPreferences from "~/store/useUserPreferences";
import clsx from "clsx";
import { useEffect } from "react";
import MobileHeader from "~/components/MobileHeader/MobileHeader";

type LayoutProps = {
  children: React.ReactNode;
};

const FONTS = new Map([
  ["mono", "font-inconsolata"],
  ["serif", "font-merriweather"],
  ["sans-serif", "font-poppins"],
]);

let once = true;
export default function Layout({ children }: LayoutProps) {
  const setFont = useUserPreferences(state => state.setFont);
  const font = useUserPreferences(state => state.font);
  const setTheme = useUserPreferences(state => state.setTheme);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  const getFont = FONTS.get(font) ?? "font-poppins";
  useEffect(() => {
    if (once) {
      const localTheme = localStorage.getItem("theme") ?? "light";
      const localFont = localStorage.getItem("font") ?? "serif";

      setFont(localFont);
      setTheme(localTheme);

      once = false;
    }
  }, [setFont, setTheme]);

  return (
    <div className={clsx(isDarkTheme && "bg-gray-900 text-gray-100")}>
      <div
        className={clsx(
          getFont,
          "m-auto grid min-h-screen max-w-screen-md grid-rows-[auto,_1fr] px-6 py-12 mobile:grid-rows-[1fr,_auto]",
        )}
      >
        <Header />
        {children}
        <MobileHeader />
      </div>
    </div>
  );
}
