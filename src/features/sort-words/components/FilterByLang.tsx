import { useTranslation } from "next-i18next";
import { type Dispatch, type SetStateAction } from "react";

import cn from "~/utils/cn";
import capitalize from "~/utils/capitalize";
import Dropdown from "~/components/Dropdown";
import { ChevronIcon } from "~/components/Icons";
import useSetQueryParams from "~/hooks/useSetQueryParams";

export type FilterByLangProps = {
  currentLang: null | string;
  availableLanguages: string[];
  setLang: Dispatch<SetStateAction<null | string>>;
};

export default function FilterByLang({
  setLang,
  currentLang,
  availableLanguages,
}: FilterByLangProps) {
  const { t } = useTranslation();
  const setQueryParams = useSetQueryParams();

  function filterByLangCallback(data: HTMLLIElement) {
    const dataLang = data.dataset.lang as string;
    const parsedLang = dataLang === "all" ? null : dataLang;

    setLang(parsedLang);
    setQueryParams("lang", parsedLang);
  }

  return (
    <Dropdown
      classNameContent="right-1 mobile-header:w-full mobile-header:right-0 mobile-header:px-2"
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
            {currentLang
              ? capitalize(t(currentLang))
              : t("all") + " " + t("words.sort.by_lang.default")}
          </span>
        </>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="word-filterbylang-list"
          className="mt-3 rounded-md bg-white p-3 shadow-subtle dark:bg-gray-900 dark:shadow-3xl [&>li]:leading-8"
        >
          {["all", ...availableLanguages].map(lang => {
            const isSameLang =
              currentLang === null && lang === "all"
                ? true
                : lang.toLowerCase() === currentLang?.toLowerCase();

            return (
              <li
                role="option"
                key={lang}
                aria-selected={isSameLang}
                data-lang={lang.toLowerCase()}
                tabIndex={isSameLang ? 0 : -1}
                data-testid={"lang-" + lang.toLowerCase()}
                onClick={e => dropdownItemHandler(e)}
                className={`cursor-pointer whitespace-nowrap rounded-md px-12 py-1 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary mobile-header:text-center`}
              >
                {capitalize(t(lang === "all" ? "all" : lang))}
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}
