import HomeIcon from "~/components/Icons/HomeIcon";
import useUserPreferences from "~/store/useUserPreferences";
import MoonIcon from "~/components/Icons/MoonIcon";
import clsx from "clsx";
import SearchIcon from "~/components/Icons/SearchIcon";
import Button from "~/components/Button/Button";
import AccountIcon from "~/components/Icons/AccountIcon";
import Link from "next/link";

export default function MobileHeader() {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";
  const setTheme = useUserPreferences(state => state.setTheme);

  function onThemeToggle() {
    const calculatedTheme = isDarkTheme ? "light" : "dark";
    setTheme(calculatedTheme);
    localStorage.setItem("theme", calculatedTheme);
  }

  return (
    <header className="relative hidden before:absolute before:-top-5 before:left-0 before:right-0 before:h-1 before:rounded-md before:bg-[#757575] mobile:block">
      <ul className="relative z-10 flex items-center justify-around [&>li>*]:rounded-md">
        <li>
          <Link
            className="inline-block outline-2 outline-primary focus-visible:outline"
            href="/"
          >
            <HomeIcon dimensions={38} />
          </Link>
        </li>
        <li>
          <Button>
            <SearchIcon dimensions={34} className="fill-[#757575]" />
          </Button>
        </li>
        <li className="mt-1 -rotate-[25deg]">
          <Button onClick={onThemeToggle}>
            <MoonIcon
              dimensions={28}
              className={clsx(
                isDarkTheme ? "fill-[#757575]" : "fill-none",
                "stroke-[#757575] stroke-[3px] transition-all",
              )}
            />
          </Button>
        </li>
        <li>
          <Button>
            <AccountIcon />
          </Button>
        </li>
      </ul>
    </header>
  );
}
