import { useTranslation } from "next-i18next";

import cn from "~/utils/cn";
import useLocalData from "~/store/useLocalData";
import { ChevronIcon } from "~/components/Icons";
import { FONT_TYPES } from "~/features/change-font";
import Dropdown from "~/components/Dropdown";

export default function ChangeFont() {
  const { t } = useTranslation();
  const font = useLocalData(state => state.font);
  const setFont = useLocalData(state => state.setFont);

  function fontCallback(data: HTMLLIElement) {
    const parsedData = data.dataset.font ?? "Sans-Serif";

    setFont(parsedData);
    localStorage.setItem("font", parsedData);
  }

  return (
    <Dropdown
      callback={fontCallback}
      className="relative"
      classNameContent="-translate-x-1/2 right-1/2 left-1/2"
      renderTitle={isDropdownOpen => (
        <div className="flex min-w-[120px] cursor-pointer items-center justify-center gap-4">
          <span className="sr-only">{t("header.changeFont")}</span>
          <ChevronIcon
            width={18}
            height={18}
            className={cn(
              "transition-transform [&>path]:fill-gray-600",
              isDropdownOpen && "rotate-90 [&>path]:fill-primary",
            )}
          />
          <span>{font}</span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="fonts-list"
          className="rounded-md bg-white p-4 shadow-3xl dark:bg-gray-900 [&>li]:leading-8"
        >
          {FONT_TYPES.map(type => {
            const isFontSame = type.name.toLowerCase() === font.toLowerCase();
            return (
              <li
                role="option"
                key={type.name}
                data-font={type.name}
                aria-selected={isFontSame}
                tabIndex={isFontSame ? 0 : -1}
                data-testid={type.className.toLowerCase()}
                onClick={e => dropdownItemHandler(e)}
                className={`${type.className} cursor-pointer whitespace-nowrap rounded-md px-4 py-2 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary`}
              >
                {type.name}
              </li>
            );
          })}
        </ul>
      )}
    />
  );
}
