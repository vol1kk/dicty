import React from "react";

import cn from "~/utils/cn";

export type ButtonProps = {
  isSubmit?: boolean;
  variant?: "darker" | "lighter";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  isSubmit = false,
  variant = "lighter",
  ...props
}: ButtonProps) {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      className={cn(
        variant === "darker" && "bg-gray-300 dark:bg-gray-900",
        variant === "lighter" && "bg-gray-100 dark:bg-gray-800",
        `rounded-md  outline-2 outline-offset-2 outline-primary focus-visible:outline`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
