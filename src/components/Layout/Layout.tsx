import Header from "~/components/Header/Header";
import useUserPreferences from "~/store/useUserPreferences";
import clsx from "clsx";
import { useEffect } from "react";
import { setToken } from "~/utils/api";
import { useSession } from "next-auth/react";
import useSessionData from "~/store/useSessionData";

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
  const font = useUserPreferences(state => state.font);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";
  const setSession = useSessionData(state => state.setSession);
  const setTheme = useUserPreferences(state => state.setTheme);
  const setFont = useUserPreferences(state => state.setFont);
  const getFont = FONTS.get(font) ?? "font-poppins";
  const sessionData = useSession();

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
    if (sessionData.data?.user) {
      setToken(sessionData.data.user.accessToken);
      setSession(sessionData);
    } else {
      setToken("");
      setSession(sessionData);
    }
  }, [sessionData, setSession]);

  return (
    <>
      <div id="overlay" />
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
    </>
  );
}
