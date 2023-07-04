import clsx from "clsx";
import Link from "next/link";
import MoonIcon from "~/components/Icons/MoonIcon";
import Dictionary from "~/components/Icons/DictionaryIcon";
import useUserPreferences from "~/store/useUserPreferences";

export default function Header() {
  const darkTheme = useUserPreferences(state => state.darkTheme);
  const setDarkTheme = useUserPreferences(state => state.setDarkTheme);
  const changeFont = useUserPreferences(state => state.setFont);

  const state = useUserPreferences(state => state);
  console.log(state);

  return (
    <header className="flex items-center justify-between">
      <Link
        href="/"
        className="rounded-md outline-2 outline-offset-2 outline-fuchsia-300 focus-visible:outline"
      >
        <Dictionary />
      </Link>
      <div className="flex items-center gap-4">
        <select
          onChange={e => changeFont(e.currentTarget.value)}
          className="rounded-md border-2 border-[#757575] px-2 py-1 outline-2 outline-offset-2 outline-fuchsia-300 focus-visible:outline"
          name="font"
          id="font"
        >
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-Serif</option>
          <option value="mono">Mono</option>
        </select>

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
              darkTheme ? "bg-primary [&~svg]:fill-primary" : "bg-[#757575]",
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
