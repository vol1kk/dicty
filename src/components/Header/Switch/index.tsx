import clsx from "clsx";
import MoonIcon from "~/components/Icons/MoonIcon";
import useUserPreferences from "~/store/useUserPreferences";

export default function Switch() {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";
  const setTheme = useUserPreferences(state => state.setTheme);

  function onThemeToggle() {
    const calculatedTheme = isDarkTheme ? "light" : "dark";
    setTheme(calculatedTheme);
    localStorage.setItem("theme", calculatedTheme);
  }

  return (
    <label className="group flex cursor-pointer gap-2">
      <button
        role="switch"
        onClick={onThemeToggle}
        className="peer sr-only"
        aria-checked={isDarkTheme}
      >
        Toggle Dark Theme
      </button>
      <span
        className={clsx(
          isDarkTheme ? "bg-primary [&~svg]:fill-primary" : "bg-gray-600",
          "relative block h-6 w-12 rounded-full border-4 border-transparent outline-2 outline-offset-2 outline-primary peer-focus-visible:outline [&~svg]:hover:fill-primary",
        )}
      >
        <span
          className={clsx(
            isDarkTheme ? "left-6" : "left-0",
            "absolute h-4 w-4 rounded-full bg-white transition-all",
          )}
        />
      </span>
      <span className="-rotate-[32deg]">
        <MoonIcon
          className={clsx(
            "fill-none stroke-[5px] group-hover:stroke-primary",
            isDarkTheme ? "stroke-primary" : "stroke-[#757575]",
          )}
        />
      </span>
    </label>
  );
}
