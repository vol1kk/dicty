import clsx from "clsx";
import Link from "next/link";
import useHeaderData from "~/store/useHeaderData";
import Dictionary from "~/components/Icons/DictionaryIcon";
import HeaderMenu from "~/components/Header/HeaderMenu";
import ButtonBurger from "~/components/Button/ButtonBurger";

export default function Header() {
  const setIsHeaderOpen = useHeaderData(state => state.setIsHeaderOpen);
  const isHeaderOpen = useHeaderData(state => state.isHeaderOpen);

  function openMenuHandler(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    setIsHeaderOpen();
  }

  return (
    <header className="mb-10">
      <nav className="relative z-20 grid grid-cols-[auto,_1fr] items-center">
        <ButtonBurger
          ariaLabel="Open header menu"
          isBurgerMenuOpen={isHeaderOpen}
          openBurgerMenuHandler={openMenuHandler}
        />
        <Link
          href="/"
          className="place-self-center rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
        >
          <Dictionary
            aria-label="Home Icon"
            className={clsx(
              isHeaderOpen && "fill-black delay-150 dark:fill-gray-100",
            )}
          />
        </Link>
      </nav>
      <HeaderMenu />
    </header>
  );
}
