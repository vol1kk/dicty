import Link from "next/link";
import Dictionary from "~/components/Icons/DictionaryIcon";

import Switch from "~/components/Header/Switch";
import FontDropdown from "~/components/Header/FontDropdown";
import { signIn, signOut } from "next-auth/react";
import Button from "~/components/Button/Button";
import useSessionData from "~/store/useSessionData";
import { useEffect } from "react";
import clsx from "clsx";
import useHeaderData from "~/store/useHeaderData";

export default function Header() {
  const isAuthed = useSessionData(state => state.isAuthed);
  const isMenuOpen = useHeaderData(state => state.isHeaderOpen);
  const setIsMenuOpen = useHeaderData(state => state.setIsHeaderOpen);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden");
    const clickCloseHandler = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    const keyboardCloseHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.body.addEventListener("click", clickCloseHandler);
    document.body.addEventListener("keydown", keyboardCloseHandler);
    return () => {
      document.body.removeEventListener("click", clickCloseHandler);
      document.body.removeEventListener("keydown", keyboardCloseHandler);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <header className="mb-10">
      <nav className="relative z-20 grid grid-cols-[auto,_1fr] items-center">
        <Button
          onClick={e => {
            e.stopPropagation();
            setIsMenuOpen();
          }}
          aria-expanded={isMenuOpen}
          className="group/menu relative flex h-6 w-6 items-center overflow-hidden [&>span]:w-full [&>span]:transition-transform [&>span]:duration-200"
        >
          <span className="absolute top-0 h-[2px] bg-gray-400 group-aria-expanded/menu:top-1/2 group-aria-expanded/menu:rotate-45"></span>
          <span className="absolute h-[2px] bg-gray-400 group-aria-expanded/menu:translate-x-full"></span>
          <span className="absolute bottom-0 h-[2px] bg-gray-400 group-aria-expanded/menu:top-1/2 group-aria-expanded/menu:-rotate-45"></span>
        </Button>
        <Link
          href="/"
          className="place-self-center rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
        >
          <Dictionary aria-label="Home Icon" />
        </Link>
      </nav>
      <div
        className={clsx(
          !isMenuOpen && "invisible translate-x-full",
          "fixed bottom-0 left-0 right-0 top-0 z-10 bg-gray-300 transition-[transform,_visibility] dark:bg-gray-800",
        )}
      >
        <div className="grid h-full place-content-center place-items-center gap-4 ">
          <ul
            onClick={e => e.stopPropagation()}
            className="grid place-items-center gap-4 text-2xl text-black dark:text-gray-100"
          >
            <li className="[&>button]:rounded-md">
              {isAuthed ? (
                <Button onClick={() => void signOut()}>Logout</Button>
              ) : (
                <Button onClick={() => void signIn()}>Login</Button>
              )}
            </li>

            <li>
              <FontDropdown />
            </li>
            <li>
              <Switch />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
