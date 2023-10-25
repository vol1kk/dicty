import { useTranslation } from "next-i18next";
import { type Dispatch, type SetStateAction } from "react";

import cn from "~/utils/cn";
import capitalize from "~/utils/capitalize";
import Dropdown from "~/components/Dropdown";
import { ChevronIcon } from "~/components/Icons";
import useSetQueryParams from "~/hooks/useSetQueryParams";

export type FilterByDictionaryProps = {
  dropdownContentStyles?: string;
  currentDictionary: null | string;
  availableDictionaries: string[];
  setDictionary: Dispatch<SetStateAction<null | string>>;
};

export default function FilterByDictionaryProps({
  setDictionary,
  currentDictionary,
  availableDictionaries,
  dropdownContentStyles,
}: FilterByDictionaryProps) {
  const { t } = useTranslation();
  const setQueryParams = useSetQueryParams();

  function filterByLangCallback(data: HTMLLIElement) {
    const dataDictionary = data.dataset.dict as string;
    const parsedData = dataDictionary === "all" ? null : dataDictionary;

    setDictionary(parsedData);
    setQueryParams("dict", parsedData);
  }

  return (
    <Dropdown
      classNameContent="left-1/2 -translate-x-1/2 mobile-header:w-full mobile-header:right-0 mobile-header:px-2"
      classNameTitle="relative flex cursor-pointer items-center justify-center rounded-md bg-primary bg-opacity-30 px-4 py-2 dark:bg-opacity-60 outline-2 outline-offset-2 outline-primary focus-visible:outline"
      callback={filterByLangCallback}
      renderTitle={isDropdownOpen => (
        <>
          <ChevronIcon
            width={14}
            height={14}
            aria-hidden
            className={cn(
              "absolute left-4 transition-transform [&>path]:fill-black dark:[&>path]:fill-white",
              isDropdownOpen && "rotate-90 [&>path]:fill-primary",
            )}
          />
          <span>
            {currentDictionary
              ? capitalize(currentDictionary)
              : t("all") + " " + t("words.sort.by_dict.default")}
          </span>
        </>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="word-filterbylang-list"
          className={cn(
            "mt-3 rounded-md bg-white p-3 shadow-subtle dark:bg-gray-900 dark:shadow-3xl [&>li]:leading-8",
            dropdownContentStyles,
          )}
        >
          {["all", ...availableDictionaries].map(dictionary => {
            const isSameDictionary =
              dictionary === "all" && currentDictionary === null
                ? true
                : dictionary.toLowerCase() === currentDictionary?.toLowerCase();

            return (
              <li
                role="option"
                key={dictionary}
                aria-selected={isSameDictionary}
                tabIndex={isSameDictionary ? 0 : -1}
                data-dict={dictionary.toLowerCase()}
                data-testid={"dict-" + dictionary.toLowerCase()}
                onClick={e => dropdownItemHandler(e)}
                className="cursor-pointer whitespace-nowrap rounded-md px-12 py-1 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary mobile-header:text-center"
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
