import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import cn from "~/utils/cn";
import useHeaderData from "~/store/useHeaderData";
import { DictionaryIcon } from "~/components/Icons";
import HeaderMenu from "~/layouts/Header/HeaderMenu";
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
          isOpen={isHeaderOpen}
          openHandler={openMenuHandler}
        />
        <Link
          href="/"
          className="place-self-center rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline [&>svg]:fill-black dark:[&>svg]:fill-white"
        >
          <DictionaryIcon
            width={48}
            height={48}
            aria-label={t("header.icon")}
            className={cn(
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
