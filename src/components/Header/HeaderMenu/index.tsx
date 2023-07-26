import { signIn, signOut } from "next-auth/react";
import React from "react";
import clsx from "clsx";
import useWords from "~/hooks/useWords";
import Switch from "~/components/Switch";
import Modal from "~/components/Modal/Modal";
import modifyWordId from "~/utils/modifyWordId";
import Button from "~/components/Button/Button";
import useHeaderData from "~/store/useHeaderData";
import readFileAsync from "~/utils/readFileAsync";
import Overlay from "~/components/Overlay/Overlay";
import useSessionData from "~/store/useSessionData";
import ImportIcon from "~/components/Icons/ImportIcon";
import AccountIcon from "~/components/Icons/AccountIcon";
import useUserPreferences from "~/store/useUserPreferences";
import FontDropdown from "~/components/Header/HeaderMenu/FontDropdown";
import { nanoid } from "nanoid";

export default function HeaderMenu() {
  const { data: words, importWords } = useWords();
  const setTheme = useUserPreferences(state => state.setTheme);
  const isAuthed = useSessionData(state => state.isAuthed);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

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

    const encodedWords = encodeURIComponent(JSON.stringify(modifiedWords));
    const jsonString = `data:text/json;charset=utf-8,` + encodedWords;

    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `words${+new Date()}.json`;

    link.click();

    setIsHeaderOpen(false);
  }

  function triggerInputHandler(e: React.MouseEvent<HTMLButtonElement>) {
    const fileInput = e.currentTarget.querySelector(
      "input[type=file]",
    ) as HTMLInputElement;
    fileInput.click();
  }

  function importWordsHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    readFileAsync(file)
      .then(data => importWords(data))
      .catch(console.error);

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
            <Button onClick={triggerInputHandler}>
              <ImportIcon dimensions={24} type="import" /> Import
              <input
                onChange={importWordsHandler}
                className="hidden"
                aria-hidden={true}
                type="file"
              />
            </Button>
          </li>
          <li>
            <Button onClick={exportWordsHandler}>
              <ImportIcon dimensions={24} />
              Export
            </Button>
          </li>
          <li>
            <Button onClick={authenticationHandler}>
              <AccountIcon dimensions={24} />
              {isAuthed ? "Logout" : "Login"}
            </Button>
          </li>
          <li className="place-self-center">
            <FontDropdown />
          </li>
          <li className="place-self-center">
            <Switch isChecked={isDarkTheme} handleCheck={themeToggleHandler} />
          </li>
        </ul>
      </Modal>
    </Overlay>
  );
}
