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
      <span className="relative block h-6 w-12 rounded-full border-4 border-transparent bg-gray-600 outline-2 outline-offset-2 outline-primary peer-focus-visible:outline dark:bg-primary [&~svg]:hover:fill-primary dark:[&~svg]:fill-primary">
        <span className="absolute left-0 h-4 w-4 rounded-full bg-white transition-all dark:left-6" />
      </span>
      {/*<span className="-rotate-[32deg]">*/}
      {/*  <MoonIcon className="fill-none stroke-[#757575] stroke-[5px] group-hover:stroke-primary dark:stroke-primary" />*/}
      {/*</span>*/}
    </label>
  );
}
