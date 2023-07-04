/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain,@typescript-eslint/no-non-null-assertion */
import clsx from "clsx";
import Link from "next/link";
import MoonIcon from "~/components/Icons/MoonIcon";
import Dictionary from "~/components/Icons/DictionaryIcon";
import useUserPreferences from "~/store/useUserPreferences";
import { useEffect, useState } from "react";
import capitalize from "~/utils/capitalize";
import Chevron from "~/components/Icons/Chevron";

const FONT_TYPES = [
  {
    name: "Serif",
    className: "font-merriweather",
  },
  {
    name: "Sans-Serif",
    className: "font-poppins",
  },
  {
    name: "Mono",
    className: "font-inconsolata",
  },
] as const;

export default function Header() {
  const setFont = useUserPreferences(state => state.setFont);
  const font = useUserPreferences(state => state.font);
  const setDarkTheme = useUserPreferences(state => state.setDarkTheme);
  const darkTheme = useUserPreferences(state => state.darkTheme);
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
      setFont((newFont as HTMLLIElement).dataset.font ?? "sans-serif");
    }
  }
  function fontMenuClickHandler(e: React.MouseEvent) {
    e.stopPropagation();
    setIsFontMenuOpen(p => !p);
  }
  function fontLinkClickHandler(name: string) {
    setFont(name);
    setIsFontMenuOpen(false);
  }

  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        className="rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
      >
        <Dictionary />
      </Link>
      <div className="flex items-center gap-4">
        <div className="relative z-10">
          <div
            tabIndex={0}
            aria-expanded={isFontMenuOpen}
            onKeyDown={fontMenuKeyboardHandler}
            onClick={fontMenuClickHandler}
            className="min-w-[125px] rounded-md p-2 outline-offset-2 outline-primary group-focus-visible:outline-2"
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
              "absolute min-w-[175px] rounded-md bg-white p-4 shadow-2xl",
            )}
          >
            <ul className="[&>li]:leading-8">
              {FONT_TYPES.map(type => {
                const isFontSame =
                  type.name.toLowerCase() === font.toLowerCase();
                return (
                  <li
                    role="option"
                    key={type.name}
                    data-font={type.name}
                    aria-selected={isFontSame}
                    tabIndex={isFontSame ? 0 : -1}
                    className={`${type.className} cursor-pointer rounded-md px-4 py-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline-2 aria-selected:text-primary`}
                    onClick={() => fontLinkClickHandler(type.name)}
                  >
                    {type.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <label className="group flex cursor-pointer gap-2">
          <button
            className="peer sr-only"
            aria-checked={darkTheme}
            onClick={setDarkTheme}
            role="switch"
          >
            Toggle Dark Theme
          </button>
          <span
            className={clsx(
              darkTheme ? "bg-primary [&~svg]:fill-primary" : "bg-gray-600",
              "relative block h-6 w-12 rounded-full border-4 border-transparent peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 [&~svg]:hover:fill-primary",
            )}
          >
            <span
              className={clsx(
                darkTheme ? "left-6" : "left-0",
                "absolute h-4 w-4 rounded-full bg-white transition-all",
              )}
            />
          </span>
          <MoonIcon className="group-hover:fill-primary" />
        </label>
      </div>
    </header>
  );
}
