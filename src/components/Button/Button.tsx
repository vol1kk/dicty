import React from "react";

import cn from "~/utils/cn";

export type ButtonProps = {
  isSubmit?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  isSubmit = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      className={cn(
        `outline-2 outline-offset-2 outline-primary focus-visible:outline`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
