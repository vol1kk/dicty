import React from "react";

import cn from "~/utils/cn";
import Button, { type ButtonProps } from "~/components/Button/Button";

export type BurgerButtonProps = {
  isOpen: boolean;
  ariaLabel: string;
  openHandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<ButtonProps, "children">;

export default function ButtonBurger({
  isOpen,
  className,
  ariaLabel,
  openHandler,
  ...props
}: BurgerButtonProps) {
  return (
    <Button
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      onClick={openHandler}
      className={cn(
        "group/burger relative flex h-6 w-6 items-center overflow-hidden [&>span]:w-full [&>span]:bg-gray-400 [&>span]:transition-transform [&>span]:duration-200 [&>span]:aria-expanded:bg-primary",
        className,
      )}
      {...props}
    >
      <span className="absolute top-0 h-[2px] group-aria-expanded/burger:top-1/2 group-aria-expanded/burger:rotate-45" />
      <span className="absolute h-[2px] group-aria-expanded/burger:translate-x-[105%]" />
      <span className="absolute bottom-0 h-[2px] group-aria-expanded/burger:top-1/2 group-aria-expanded/burger:-rotate-45" />
    </Button>
  );
}
