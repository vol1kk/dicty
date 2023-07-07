import clsx from "clsx";
import EditIcon from "~/components/Icons/EditIcon";
import Link from "next/link";
import useUserPreferences from "~/store/useUserPreferences";

type WordEditProps = {
  href: string;
  children: React.ReactNode;
};

export default function WordEdit({ href, children }: WordEditProps) {
  const isDarkTheme = useUserPreferences(state => state.theme) === "dark";

  return (
    <Link
      href={href}
      onClick={e => e.stopPropagation()}
      className={clsx(
        isDarkTheme && "bg-gray-900",
        !isDarkTheme && "bg-primary bg-opacity-30 [&>svg]:fill-primary",
        "group rounded-full p-4 outline-2 outline-offset-2 outline-primary transition-transform hover:scale-105 focus-visible:outline",
      )}
    >
      <span className="sr-only">Edit word</span>
      {children}
    </Link>
  );
}
