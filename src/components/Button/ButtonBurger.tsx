import clsx from "clsx";
import React from "react";

import Button, { type ButtonProps } from "~/components/Button/Button";

type BurgerMenuButtonProps = {
  ariaLabel?: string;
  className?: string;
  isBurgerMenuOpen: boolean;
  openBurgerMenuHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<ButtonProps, "children">;

export default function ButtonBurger({
  ariaLabel,
  className,
  isBurgerMenuOpen,
  openBurgerMenuHandler,
  ...props
}: BurgerMenuButtonProps) {
  return (
    <Button
      aria-label={ariaLabel ?? ""}
      onClick={openBurgerMenuHandler}
      aria-expanded={isBurgerMenuOpen}
      className={clsx(
        "group/burger relative flex h-6 w-6 items-center overflow-hidden [&>span]:w-full [&>span]:bg-gray-400 [&>span]:transition-transform [&>span]:duration-200 [&>span]:aria-expanded:bg-primary",
        className,
      )}
      {...props}
    >
      <span className="absolute top-0 h-[2px] group-aria-expanded/burger:top-1/2 group-aria-expanded/burger:rotate-45" />
      <span className="absolute h-[2px] group-aria-expanded/burger:translate-x-full" />
      <span className="absolute bottom-0 h-[2px] group-aria-expanded/burger:top-1/2 group-aria-expanded/burger:-rotate-45" />
    </Button>
  );
}
