import React, { useEffect } from "react";
import { useSession } from "next-auth/react";

import { setToken } from "~/utils/api";
import Header from "~/layouts/Header/Header";
import useLocalData from "~/store/useLocalData";
import useSessionData from "~/store/useSessionData";
import ToastList from "~/features/toast/components/ToastList";
import { FontTypes, PoppinsFont } from "~/features/change-font";

type LayoutProps = {
  children: React.ReactNode;
};

let once = true;
export default function RootLayout({ children }: LayoutProps) {
  const sessionData = useSession();

  const font = useLocalData(state => state.font);
  const selectedFont =
    FontTypes.find(fonts => fonts.name === font)?.className ??
    PoppinsFont.className;

  const theme = useLocalData(state => state.theme);
  const isDarkTheme = theme === "dark";

  const setSession = useSessionData(state => state.setSession);
  const setTheme = useLocalData(state => state.setTheme);
  const setFont = useLocalData(state => state.setFont);

  // Initial theme & font values
  useEffect(() => {
    if (once) {
      const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      const localTheme = localStorage.getItem("theme") || defaultTheme;
      const localFont = localStorage.getItem("font") || "Sans-Serif";

      setFont(localFont);
      setTheme(localTheme);

      once = false;
    }
  }, []); // eslint-disable-line

  // Change Theme
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark", "bg-gray-900");
    } else {
      document.documentElement.classList.remove("dark", "bg-gray-900");
    }
  }, [isDarkTheme]);

  // Setting token & session for custom store
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
      <div className={`dark:bg-gray-900 dark:text-gray-100 ${selectedFont}`}>
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
