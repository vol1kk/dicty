import { useTranslation } from "next-i18next";
import React, { type SetStateAction } from "react";

import cn from "~/utils/cn";
import capitalize from "~/utils/capitalize";
import Dropdown from "~/components/Dropdown";
import { ChevronIcon } from "~/components/Icons";

type SortWordsProps = {
  currentLang: null | string;
  availableLanguages: string[];
  setLang: React.Dispatch<SetStateAction<null | string>>;
};

export default function FilterByLang({
  setLang,
  currentLang,
  availableLanguages,
}: SortWordsProps) {
  const { t } = useTranslation();

  function filterByLangCallback(data: HTMLLIElement) {
    setLang(data.dataset.lang as string);
  }

  return (
    <Dropdown
      classNameContent="right-1"
      className="rounded-md bg-primary bg-opacity-30 px-4 py-2 dark:bg-opacity-60"
      callback={filterByLangCallback}
      renderTitle={isDropdownOpen => (
        <div className="relative flex cursor-pointer items-center gap-2">
          <span className="sr-only">{t("header.changeFont")}</span>
          <span>
            <ChevronIcon
              width={14}
              height={14}
              className={cn(
                "transition-transform [&>path]:fill-black dark:[&>path]:fill-white",
                isDropdownOpen && "rotate-90 [&>path]:fill-primary",
              )}
            />
          </span>
          <span>
            {capitalize(t(currentLang || "words.sort.by_lang.default"))}
          </span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="word-filterbylang-list"
          className="mt-3 rounded-md bg-white p-2 dark:bg-gray-900"
        >
          {["words.sort.by_lang.all", ...availableLanguages].map(lang => {
            const isSameLang =
              lang.toLowerCase() === currentLang?.toLowerCase();

            return (
              <li
                role="option"
                key={lang}
                aria-selected={isSameLang}
                data-lang={lang.toLowerCase()}
                tabIndex={isSameLang ? 0 : -1}
                onClick={e => dropdownItemHandler(e)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-12 py-1 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary`}
              >
                {capitalize(t(lang))}
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}