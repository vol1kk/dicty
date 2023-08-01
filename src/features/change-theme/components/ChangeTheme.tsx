import React from "react";
import { useTranslation } from "next-i18next";

import Switch from "~/components/Switch";
import useLocalData from "~/store/useLocalData";

export default function ChangeTheme() {
  const { t } = useTranslation();
  const setTheme = useLocalData(state => state.setTheme);
  const isDarkTheme = useLocalData(state => state.theme) === "dark";

  function themeToggleHandler() {
    const calculatedTheme = isDarkTheme ? "light" : "dark";

    setTheme(calculatedTheme);
    localStorage.setItem("theme", calculatedTheme);
  }

  return (
    <Switch
      isChecked={isDarkTheme}
      handleCheck={themeToggleHandler}
      switchAction={t("header.changeTheme")}
    />
  );
}
