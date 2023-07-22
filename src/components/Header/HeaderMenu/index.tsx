import Overlay from "~/components/Overlay/Overlay";
import clsx from "clsx";
import Modal from "~/components/Modal/Modal";
import Button from "~/components/Button/Button";
import FontDropdown from "~/components/Header/HeaderMenu/FontDropdown";
import Switch from "~/components/Switch";
import { signIn, signOut } from "next-auth/react";
import useUserPreferences from "~/store/useUserPreferences";
import useSessionData from "~/store/useSessionData";
import useHeaderData from "~/store/useHeaderData";

export default function HeaderMenu() {
  const setTheme = useUserPreferences(state => state.setTheme);
  const isAuthed = useSessionData(state => state.isAuthed);
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

  return (
    <Overlay
      isOverlayActive={isHeaderOpen}
      className={clsx(
        !isHeaderOpen && "translate-x-full",
        "bg-gray-300 bg-opacity-80 transition-[transform,_visibility] duration-300 dark:bg-gray-800 dark:bg-opacity-90",
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
            <Switch isChecked={isDarkTheme} handleCheck={themeToggleHandler} />
          </li>
        </ul>
      </Modal>
    </Overlay>
  );
}
