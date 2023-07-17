import Link from "next/link";
import Dictionary from "~/components/Icons/DictionaryIcon";

import Switch from "~/components/Header/Switch";
import FontDropdown from "~/components/Header/FontDropdown";

export default function Header() {
  return (
    <header className="mb-10 flex items-center justify-between">
      <Link
        href="/"
        className="rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
      >
        <Dictionary aria-label="Home Icon" />
      </Link>
      <div className="flex items-center gap-4">
        <FontDropdown />
        <Switch />
      </div>
    </header>
  );
}
