import React from "react";

import cn from "~/utils/cn";
import { Button, type ButtonProps } from "~/components/Button";

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
        "group/burger relative flex h-5 w-6 items-center  rounded-none bg-transparent dark:bg-transparent [&>span]:w-full [&>span]:bg-gray-400 [&>span]:transition-[transform,_opacity] [&>span]:duration-500 [&>span]:aria-expanded:bg-primary",
        className,
      )}
      {...props}
    >
      <span className="absolute top-0 h-[2px] origin-top-left group-aria-expanded/burger:translate-x-[5px] group-aria-expanded/burger:translate-y-[1px] group-aria-expanded/burger:rotate-45" />
      <span className="absolute h-[2px] group-aria-expanded/burger:translate-x-full  group-aria-expanded/burger:opacity-0" />
      <span className="absolute bottom-0 h-[2px] origin-bottom-left group-aria-expanded/burger:translate-x-[5px] group-aria-expanded/burger:-rotate-45" />
    </Button>
  );
}
