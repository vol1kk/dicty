import clsx from "clsx";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

import { setToken } from "~/utils/api";
import Header from "~/layouts/Header/Header";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import ToastList from "~/features/toast/components/ToastList";

type LayoutProps = {
  children: React.ReactNode;
};

const FONTS = new Map([
  ["Mono", "font-inconsolata"],
  ["Serif", "font-merriweather"],
  ["Sans-Serif", "font-poppins"],
]);

let once = true;
export default function RootLayout({ children }: LayoutProps) {
  const font = useLocalData(state => state.font);
  const isDarkTheme = useLocalData(state => state.theme) === "dark";
  const setSession = useSessionData(state => state.setSession);
  const setTheme = useLocalData(state => state.setTheme);
  const setFont = useLocalData(state => state.setFont);
  const getFont = FONTS.get(font) ?? "font-poppins";
  const sessionData = useSession();

  useEffect(() => {
    if (once) {
      const localTheme = localStorage.getItem("theme") ?? "light";
      const localFont = localStorage.getItem("font") ?? "Serif";

      setFont(localFont);
      setTheme(localTheme);

      once = false;
    }
  }, [setFont, setTheme]);

  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark", "bg-gray-900");
    } else {
      document.documentElement.classList.remove("dark", "bg-gray-900");
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
      <div className={`dark:bg-gray-900 dark:text-gray-100 ${getFont}`}>
        <div id="overlay" />
        <div className="m-auto grid min-h-screen max-w-screen-md grid-rows-[auto,_1fr] px-6 py-12">
          <Header />
          {children}
        </div>
        <div id="toasts">
          <ToastList />
        </div>
      </div>
    </>
  );
}
