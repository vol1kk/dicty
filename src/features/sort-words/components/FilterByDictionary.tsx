import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { type SetStateAction } from "react";

import cn from "~/utils/cn";
import capitalize from "~/utils/capitalize";
import Dropdown from "~/components/Dropdown";
import { ChevronIcon } from "~/components/Icons";
import setQueryParams from "~/utils/setQueryParams";

type SortWordsProps = {
  currentDictionary: null | string;
  availableDictionaries: string[];
  setDictionary: React.Dispatch<SetStateAction<null | string>>;
};

export default function FilterByDictionary({
  setDictionary,
  availableDictionaries,
  currentDictionary,
}: SortWordsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  function filterByLangCallback(data: HTMLLIElement) {
    const dataDictionary = data.dataset.dict as string;
    const parsedData = dataDictionary === "all" ? null : dataDictionary;

    setDictionary(parsedData);
    setQueryParams(router, "dict", parsedData);
  }

  return (
    <Dropdown
      classNameContent="left-1/2 -translate-x-1/2 mobile-header:w-full mobile-header:right-0 mobile-header:px-2"
      className="rounded-md bg-primary bg-opacity-30 px-4 py-2 dark:bg-opacity-60"
      callback={filterByLangCallback}
      renderTitle={isDropdownOpen => (
        <div className="relative flex cursor-pointer items-center justify-center pl-4 mobile-header:py-1">
          <ChevronIcon
            width={14}
            height={14}
            className={cn(
              "absolute left-0 transition-transform [&>path]:fill-black dark:[&>path]:fill-white",
              isDropdownOpen && "rotate-90 [&>path]:fill-primary",
            )}
          />
          <span>
            {currentDictionary
              ? capitalize(currentDictionary)
              : t("all") + " " + t("words.sort.by_dict.default", { count: 0 })}
          </span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="word-filterbylang-list"
          className="mt-3 rounded-md bg-white p-3 shadow-3xl dark:bg-gray-900 [&>li]:leading-8"
        >
          {["all", ...availableDictionaries].map(dictionary => {
            const isSameLang =
              dictionary.toLowerCase() === currentDictionary?.toLowerCase();

            return (
              <li
                role="option"
                key={dictionary}
                aria-selected={isSameLang}
                data-dict={dictionary.toLowerCase()}
                tabIndex={isSameLang ? 0 : -1}
                onClick={e => dropdownItemHandler(e)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-12 py-1 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary mobile-header:text-center`}
              >
                {capitalize(t(dictionary === "all" ? "all" : dictionary))}
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}
