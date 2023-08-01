import clsx from "clsx";
import React from "react";
import { useTranslation } from "next-i18next";
import { signIn, signOut } from "next-auth/react";

import Modal from "~/components/Modal";
import Overlay from "~/components/Overlay";
import AccountIcon from "~/assets/account.svg";
import Button from "~/components/Button/Button";
import ChangeFont from "~/features/change-font";
import ChangeTheme from "~/features/change-theme";
import useHeaderData from "~/store/useHeaderData";
import useSessionData from "~/store/useSessionData";
import ChangeLanguage from "~/features/change-language";
import { ExportWords, ImportWords } from "~/features/import-export-words";

export default function HeaderMenu() {
  const { t } = useTranslation();

  const isAuthed = useSessionData(state => state.isAuthed);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);

  function authenticationHandler() {
    if (isAuthed) void signOut();

    if (!isAuthed) void signIn();
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
            <ExportWords />
          </li>
          <li>
            <Button onClick={authenticationHandler}>
              <AccountIcon dimensions={24} />
              {isAuthed ? t("header.logout") : t("header.login")}
            </Button>
          </li>
          <li>
            <ChangeFont />
          </li>
          <li>
            <ChangeLanguage />
          </li>
          <li className="place-self-center">
            <ChangeTheme />
          </li>
        </ul>
      </Modal>
    </Overlay>
  );
}
