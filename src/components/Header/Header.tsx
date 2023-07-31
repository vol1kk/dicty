import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import useHeaderData from "~/store/useHeaderData";
import Dictionary from "~/components/Icons/DictionaryIcon";
import HeaderMenu from "~/components/Header/HeaderMenu";
import ButtonBurger from "~/components/Button/ButtonBurger";

export default function Header() {
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);
  const { t } = useTranslation();

  function openMenuHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsHeaderOpen();
  }

  return (
    <header className="mb-10">
      <nav className="relative z-20 grid grid-cols-[auto,_1fr] items-center">
        <ButtonBurger
          ariaLabel={t("header.openMenu")}
          isBurgerMenuOpen={isHeaderOpen}
          openBurgerMenuHandler={openMenuHandler}
        />
        <Link
          href="/"
          className="place-self-center rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
        >
          <Dictionary
            aria-label={t("header.icon")}
            className={clsx(
              "delay-75",
              isHeaderOpen && "fill-black dark:fill-gray-100",
            )}
          />
        </Link>
      </nav>
      <HeaderMenu />
    </header>
  );
}
