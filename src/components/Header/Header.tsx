import clsx from "clsx";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import Modal from "~/components/Modal/Modal";
import Button from "~/components/Button/Button";
import useHeaderData from "~/store/useHeaderData";
import Overlay from "~/components/Overlay/Overlay";
import useSessionData from "~/store/useSessionData";
import Dictionary from "~/components/Icons/DictionaryIcon";
import FontDropdown from "~/components/Header/FontDropdown";
import Switch from "~/components/Switch";
import useUserPreferences from "~/store/useUserPreferences";

export default function Header() {
  const setTheme = useUserPreferences(state => state.setTheme);
  const isAuthed = useSessionData(state => state.isAuthed);
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  function themeToggleHandler() {
    const calculatedTheme = isDarkTheme ? "light" : "dark";
    setTheme(calculatedTheme);
    localStorage.setItem("theme", calculatedTheme);
  }

  function authenticationHandler() {
    if (isAuthed) void signOut();

    if (!isAuthed) void signIn();
  }

  function openMenuHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsHeaderOpen();
  }

  return (
    <header className="mb-10">
      <nav className="relative z-20 grid grid-cols-[auto,_1fr] items-center">
        <Button
          onClick={openMenuHandler}
          aria-expanded={isHeaderOpen}
          className="group/menu relative flex h-6 w-6 items-center overflow-hidden [&>span]:w-full [&>span]:bg-gray-400 [&>span]:transition-transform [&>span]:duration-200 [&>span]:aria-expanded:bg-primary"
        >
          <span className="sr-only">Open header menu</span>
          <span className="absolute top-0 h-[2px] group-aria-expanded/menu:top-1/2 group-aria-expanded/menu:rotate-45" />
          <span className="absolute h-[2px] group-aria-expanded/menu:translate-x-full" />
          <span className="absolute bottom-0 h-[2px] group-aria-expanded/menu:top-1/2 group-aria-expanded/menu:-rotate-45" />
        </Button>
        <Link
          href="/"
          className="place-self-center rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
        >
          <Dictionary
            aria-label="Home Icon"
            className={clsx(isHeaderOpen && "fill-black dark:fill-gray-100")}
          />
        </Link>
      </nav>
      <Overlay
        isOverlayActive={isHeaderOpen}
        className={clsx(
          !isHeaderOpen && "translate-x-full",
          "bg-gray-300 transition-[transform,_visibility] dark:bg-gray-800",
        )}
      >
        <Modal>
          <ul
            onClick={e => e.stopPropagation()}
            className="grid place-items-center gap-6 p-2 text-3xl"
          >
            <li className="[&>button]:rounded-md">
              <Button onClick={authenticationHandler}>
                {isAuthed ? "Logout" : "Login"}
              </Button>
            </li>
            <li>
              <FontDropdown />
            </li>
            <li>
              <Switch
                isChecked={isDarkTheme}
                handleCheck={themeToggleHandler}
              />
            </li>
          </ul>
        </Modal>
      </Overlay>
    </header>
  );
}
