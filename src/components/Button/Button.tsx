import { type ButtonHTMLAttributes } from "react";

type ButtonProps = {
  isSubmit?: boolean;
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className = "",
  isSubmit = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={isSubmit ? "submit" : "button"}
      {...props}
      className={`outline-2 outline-offset-2 outline-primary focus-visible:outline ${className}`}
    >
      {children}
    </button>
  );
}
