import { useRouter } from "next/router";

import cn from "~/utils/cn";
import { ChevronIcon } from "~/components/Icons";
import useHeaderData from "~/store/useHeaderData";
import { LANGUAGES } from "~/features/change-language";
import Dropdown from "~/components/Dropdown";

export default function ChangeLanguage() {
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
      callback={languageCallback}
      className="relative"
      classNameContent="-translate-x-1/2 right-1/2 left-1/2"
      renderTitle={isDropdownOpen => (
        <div className="flex min-w-[120px] cursor-pointer items-center justify-center gap-4">
          <ChevronIcon
            width={18}
            height={18}
            className={cn(
              "transition-transform [&>path]:fill-gray-600",
              isDropdownOpen && "rotate-90 [&>path]:fill-primary",
            )}
          />
          <span>{languageDisplayName}</span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="languages-list"
          className="rounded-md bg-white p-4 shadow-3xl dark:bg-gray-900 [&>li]:leading-8"
        >
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
                data-testid={"language-" + language.i18Name}
                onClick={e => dropdownItemHandler(e)}
                className="cursor-pointer whitespace-nowrap rounded-md px-4 py-2 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary mobile:text-center"
              >
                {language.displayName}
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}
