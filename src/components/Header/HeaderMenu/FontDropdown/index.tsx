import clsx from "clsx";
import { useTranslation } from "next-i18next";

import ChevronIcon from "~/assets/chevron.svg";
import useLocalData from "~/store/useLocalData";
import Dropdown from "~/components/Dropdown/Dropdown";

const FONT_TYPES = [
  {
    name: "Sans-Serif",
    className: "font-poppins",
  },
  {
    name: "Serif",
    className: "font-merriweather",
  },
  {
    name: "Mono",
    className: "font-inconsolata",
  },
] as const;

export default function FontDropdown() {
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
              heigth={18}
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
        <ul className="rounded-md bg-white p-4 dark:bg-gray-900 [&>li]:leading-8">
          {FONT_TYPES.map(type => {
            const isFontSame = type.name.toLowerCase() === font.toLowerCase();
            return (
              <li
                role="option"
                key={type.name}
                data-font={type.name}
                aria-selected={isFontSame}
                tabIndex={isFontSame ? 0 : -1}
                className={`${type.className} cursor-pointer whitespace-nowrap rounded-md px-4 py-2 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary`}
                onClick={e => dropdownItemHandler(e)}
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
