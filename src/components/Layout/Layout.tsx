import Header from "~/components/Header/Header";
import useUserPreferences from "~/store/useUserPreferences";
import clsx from "clsx";
import { useEffect } from "react";
import { setToken } from "~/utils/api";
import { useSession } from "next-auth/react";

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
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";
  const setTheme = useUserPreferences(state => state.setTheme);
  const setFont = useUserPreferences(state => state.setFont);
  const font = useUserPreferences(state => state.font);
  const getFont = FONTS.get(font) ?? "font-poppins";
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (once) {
      const localTheme = localStorage.getItem("theme") ?? "light";
      const localFont = localStorage.getItem("font") ?? "serif";

      setFont(localFont);
      setTheme(localTheme);

      once = false;
    }
  }, [setFont, setTheme]);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    if (sessionData && Object.keys(sessionData).length > 0)
      setToken(sessionData.user.accessToken);
    else setToken("");
  }, [sessionData]);

  return (
    <div className="dark:bg-gray-900 dark:text-gray-100">
      <div
        className={clsx(
          getFont,
          "m-auto grid min-h-screen max-w-screen-md grid-rows-[auto,_1fr] px-6 py-12",
        )}
      >
        <Header />
        {children}
      </div>
    </div>
  );
}
