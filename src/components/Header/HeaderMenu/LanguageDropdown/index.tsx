import clsx from "clsx";
import { useRouter } from "next/router";

import Chevron from "~/components/Icons/Chevron";
import useHeaderData from "~/store/useHeaderData";
import Dropdown from "~/components/Dropdown/Dropdown";

const LANGUAGES = [
  {
    displayName: "English",
    i18Name: "en",
  },
  {
    displayName: "Українська",
    i18Name: "ua",
  },
];

export default function LanguageDropdown() {
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);
  const { locale, asPath, query, pathname, ...router } = useRouter();
  const languageDisplayName = LANGUAGES.find(
    language => language.i18Name === locale,
  )?.displayName;

  function languageCallback(data: HTMLLIElement) {
    router
      .push({ pathname, query }, asPath, { locale: data.dataset.lang })
      .catch(console.error)
      .finally(() => setIsHeaderOpen(false));
  }

  return (
    <Dropdown
      renderTitle={isDropdownOpen => (
        <div className="relative flex min-w-[120px] cursor-pointer items-center gap-4">
          <span className="sr-only">Change font</span>
          <span>
            <Chevron
              className={clsx(
                "transition-transform [&>path]:fill-gray-600",
                isDropdownOpen && "rotate-90 [&>path]:!fill-primary",
              )}
            />
          </span>
          <span>{languageDisplayName}</span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul className="rounded-md bg-white p-4 dark:bg-gray-900 [&>li]:leading-8">
          {LANGUAGES.map(language => {
            const isLanguageSelected =
              language.i18Name.toLowerCase() === locale?.toLowerCase();
            return (
              <li
                role="option"
                key={language.i18Name}
                data-lang={language.i18Name}
                aria-selected={isLanguageSelected}
                tabIndex={isLanguageSelected ? 0 : -1}
                className="cursor-pointer whitespace-nowrap rounded-md px-4 py-2 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary"
                onClick={e => dropdownItemHandler(e)}
              >
                {language.displayName}
              </li>
            );
          })}
        </ul>
      )}
      callback={languageCallback}
    />
  );
}
