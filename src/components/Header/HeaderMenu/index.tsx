import clsx from "clsx";
import React from "react";
import { useTranslation } from "next-i18next";
import { signIn, signOut } from "next-auth/react";

import useWords from "~/hooks/useWords";
import Switch from "~/components/Switch";
import Modal from "~/components/Modal/Modal";
import modifyWordId from "~/utils/modifyWordId";
import downloadData from "~/utils/downloadData";
import Button from "~/components/Button/Button";
import useLocalData from "~/store/useLocalData";
import useHeaderData from "~/store/useHeaderData";
import ImportWords from "~/features/import-words";
import Overlay from "~/components/Overlay/Overlay";
import useSessionData from "~/store/useSessionData";
import ImportIcon from "~/components/Icons/ImportIcon";
import AccountIcon from "~/components/Icons/AccountIcon";
import FontDropdown from "~/components/Header/HeaderMenu/FontDropdown";
import LanguageDropdown from "~/components/Header/HeaderMenu/LanguageDropdown";

export default function HeaderMenu() {
  const { t } = useTranslation();
  const { data: words } = useWords();

  const setTheme = useLocalData(state => state.setTheme);
  const isAuthed = useSessionData(state => state.isAuthed);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);
  const isDarkTheme = useLocalData(state => state.theme) === "dark";

  function themeToggleHandler() {
    const calculatedTheme = isDarkTheme ? "light" : "dark";

    setTheme(calculatedTheme);
    localStorage.setItem("theme", calculatedTheme);
  }

  function authenticationHandler() {
    if (isAuthed) void signOut();

    if (!isAuthed) void signIn();
  }

  function exportWordsHandler() {
    const modifiedWords = words.map(w =>
      modifyWordId(w, { appendWithEmptyId: true }),
    );

    downloadData(modifiedWords, `words-${+new Date()}`);
    setIsHeaderOpen(false);
  }

  return (
    <Overlay
      isOverlayActive={isHeaderOpen}
      className={clsx(
        !isHeaderOpen && "translate-x-full",
        "bg-gray-300 bg-opacity-80 transition-[transform,_visibility] duration-300 dark:bg-gray-800 dark:bg-opacity-90",
      )}
    >
      <Modal>
        <ul
          onClick={e => e.stopPropagation()}
          className="grid gap-6 p-2 text-3xl dark:[&>li>button>svg]:fill-white [&>li>button]:flex [&>li>button]:items-center [&>li>button]:gap-4 [&>li>button]:rounded-md"
        >
          <li>
            <ImportWords />
          </li>
          <li>
            <Button onClick={exportWordsHandler}>
              <ImportIcon dimensions={24} />
              {t("header.export")}
            </Button>
          </li>
          <li>
            <Button onClick={authenticationHandler}>
              <AccountIcon dimensions={24} />
              {isAuthed ? t("header.logout") : t("header.login")}
            </Button>
          </li>
          <li>
            <FontDropdown />
          </li>
          <li>
            <LanguageDropdown />
          </li>
          <li className="place-self-center">
            <Switch
              isChecked={isDarkTheme}
              handleCheck={themeToggleHandler}
              switchAction={t("header.changeTheme")}
            />
          </li>
        </ul>
      </Modal>
    </Overlay>
  );
}
