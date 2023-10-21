import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { signIn, signOut } from "next-auth/react";

import cn from "~/utils/cn";
import { env } from "~/env.mjs";
import Modal from "~/components/Modal";
import useWords from "~/hooks/useWords";
import Overlay from "~/components/Overlay";
import { Button } from "~/components/Button";
import ChangeFont from "~/features/change-font";
import ChangeTheme from "~/features/change-theme";
import useHeaderData from "~/store/useHeaderData";
import useSessionData from "~/store/useSessionData";
import ChangeLanguage from "~/features/change-language";
import { AccountIcon, QuizIcon } from "~/components/Icons";
import { ExportWords, ImportWords } from "~/features/import-export-words";

export default function HeaderMenu() {
  const { t } = useTranslation();
  const router = useRouter();

  const isAuthEnabled = env.NEXT_PUBLIC_AUTH_ENABLED;
  console.log();

  const isAuthed = useSessionData(state => state.isAuthed);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);

  const words = useWords(null, {
    enabled: isHeaderOpen,
  });

  function quizHandler() {
    void router.push({ pathname: "/quiz", query: { dict: router.query.dict } });

    setIsHeaderOpen(false);
  }

  const buttonClasses =
    "hover:scale-105 hover:bg-opacity-100 dark:hover:bg-opacity-100 flex min-w-[170px] h-28 w-full items-center justify-center gap-2 bg-gray-400 bg-opacity-60 px-2 transition-[opacity,_transform] dark:bg-opacity-60 mobile-header:h-20";

  return (
    <Overlay
      isOpen={isHeaderOpen}
      setIsOpen={setIsHeaderOpen}
      className={cn(
        !isHeaderOpen && "translate-x-full",
        "bg-gray-300 bg-opacity-50 backdrop-blur-md transition-[transform,_visibility] duration-300 dark:bg-gray-800 dark:bg-opacity-50",
      )}
    >
      <Modal className="grid h-full w-full place-content-center text-2xl">
        <nav>
          <ul
            onClick={e => e.stopPropagation()}
            className="grid grid-cols-2 gap-4 p-4 text-3xl mobile-header:mt-4 mobile-header:grid-cols-1 [&_svg]:fill-black dark:[&_svg]:fill-white"
          >
            <li>
              <ImportWords words={words} className={buttonClasses} />
            </li>
            <li>
              <ExportWords words={words} className={buttonClasses} />
            </li>
            <li className="col-span-2 mobile-header:col-span-1">
              <Button
                variant="darker"
                onClick={quizHandler}
                className={buttonClasses}
              >
                <QuizIcon width={24} height={24} />
                {t("revisions.name", { count: 1 })}
              </Button>
            </li>
            {isAuthEnabled && (
              <li className="col-span-2 mobile-header:col-span-1">
                <Button
                  variant="darker"
                  className={buttonClasses}
                  onClick={() => void (isAuthed ? signOut() : signIn())}
                >
                  <AccountIcon width={24} height={24} />
                  {isAuthed ? t("logout") : t("login")}
                </Button>
              </li>
            )}
            <li>
              <ChangeFont />
            </li>
            <li>
              <ChangeLanguage />
            </li>
            <li className="col-span-2 place-self-center mobile-header:col-span-1">
              <ChangeTheme />
            </li>
          </ul>
        </nav>
      </Modal>
    </Overlay>
  );
}
