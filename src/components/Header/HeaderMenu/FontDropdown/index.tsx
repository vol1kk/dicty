import clsx from "clsx";
import capitalize from "~/utils/capitalize";
import Chevron from "~/components/Icons/Chevron";
import Dropdown from "~/components/Dropdown/Dropdown";
import useUserPreferences from "~/store/useUserPreferences";

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
  const font = useUserPreferences(state => state.font);
  const setFont = useUserPreferences(state => state.setFont);

  function fontCallback(data: HTMLLIElement) {
    const parsedData = data.dataset.font ?? "sans-serif";

    setFont(parsedData);
    localStorage.setItem("font", parsedData);
  }

  return (
    <Dropdown
      callback={fontCallback}
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
          <span>{capitalize(font.split("-")).join("-")}</span>
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
