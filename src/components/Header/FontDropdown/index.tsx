/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain,@typescript-eslint/no-non-null-assertion */
import capitalize from "~/utils/capitalize";
import Chevron from "~/components/Icons/Chevron";
import clsx from "clsx";
import { useEffect, useState } from "react";
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
  const setFont = useUserPreferences(state => state.setFont);
  const font = useUserPreferences(state => state.font);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  useEffect(() => {
    const closeFontMenuHandler = () => setIsFontMenuOpen(false);
    document.body.addEventListener("click", closeFontMenuHandler);

    return () => {
      document.body.removeEventListener("click", closeFontMenuHandler);
    };
  }, []);

  function fontMenuKeyboardHandler(e: React.KeyboardEvent) {
    if (e.key === "Tab" || (e.key === "Tab" && e.shiftKey))
      setIsFontMenuOpen(false);

    if (e.key === " " || e.key === "Enter") setIsFontMenuOpen(p => !p);

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const fontMenu =
        e.currentTarget.parentElement?.querySelector("[role='listbox']")!;
      const allFontItems = fontMenu.querySelectorAll("li");
      const currentSelectedFont = fontMenu.querySelector(
        "li[aria-selected=true]",
      ) as HTMLLIElement;

      let newFont;
      if (e.key === "ArrowUp") {
        newFont = currentSelectedFont.previousElementSibling
          ? currentSelectedFont.previousElementSibling
          : allFontItems[allFontItems.length - 1];
      }

      if (e.key === "ArrowDown") {
        newFont = currentSelectedFont.nextElementSibling
          ? currentSelectedFont.nextElementSibling
          : allFontItems[0];
      }

      const font = (newFont as HTMLLIElement).dataset.font ?? "sans-serif";
      setFont(font);
      localStorage.setItem("font", font);
    }
  }
  function fontMenuClickHandler(e: React.MouseEvent) {
    e.stopPropagation();
    setIsFontMenuOpen(p => !p);
  }
  function fontLinkClickHandler(name: string) {
    setIsFontMenuOpen(false);
    setFont(name);
    localStorage.setItem("font", name);
  }

  return (
    <div className="relative z-10">
      <div
        tabIndex={0}
        aria-expanded={isFontMenuOpen}
        onKeyDown={fontMenuKeyboardHandler}
        onClick={fontMenuClickHandler}
        className="min-w-[125px] rounded-md p-2 outline-2 outline-offset-2 outline-primary focus-visible:outline"
      >
        <div className="relative flex cursor-pointer items-center justify-between gap-2">
          <span className="sr-only">Change font</span>
          <span>{capitalize(font.split("-")).join("-")}</span>
          <span>
            <Chevron
              className={clsx(
                "transition-transform [&>path]:fill-gray-600",
                isFontMenuOpen && "rotate-90 [&>path]:!fill-primary",
              )}
            />
          </span>
        </div>
      </div>

      <div
        tabIndex={-1}
        role="listbox"
        className={clsx(
          isFontMenuOpen ? "block" : "hidden",
          "absolute mt-4 min-w-[175px] rounded-md bg-white p-4 shadow-2xl dark:bg-gray-800",
        )}
      >
        <ul className="[&>li]:leading-8">
          {FONT_TYPES.map(type => {
            const isFontSame = type.name.toLowerCase() === font.toLowerCase();
            return (
              <li
                role="option"
                key={type.name}
                data-font={type.name}
                aria-selected={isFontSame}
                tabIndex={isFontSame ? 0 : -1}
                className={`${type.className} cursor-pointer rounded-md px-4 py-2 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary`}
                onClick={() => fontLinkClickHandler(type.name)}
              >
                {type.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
