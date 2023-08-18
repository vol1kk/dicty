import clsx from "clsx";
import { useTranslation } from "next-i18next";

import Dropdown from "~/components/Dropdown";
import useLocalData from "~/store/useLocalData";
import { ChevronIcon } from "~/components/Icons";
import { FONT_TYPES } from "~/features/change-font";

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
      renderTitle={isDropdownOpen => (
        <div className="relative flex min-w-[120px] cursor-pointer items-center gap-4">
          <span className="sr-only">{t("header.changeFont")}</span>
          <span>
            <ChevronIcon
              width={18}
              height={18}
              className={clsx(
                "transition-transform [&>path]:fill-gray-600",
                isDropdownOpen && "rotate-90 [&>path]:!fill-primary",
              )}
            />
          </span>
          <span>{font}</span>
        </div>
      )}
      renderContent={dropdownItemHandler => (
        <ul
          data-testid="fonts-list"
          className="rounded-md bg-white p-4 dark:bg-gray-900 [&>li]:leading-8"
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
