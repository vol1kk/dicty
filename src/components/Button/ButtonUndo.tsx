import Button, { type ButtonProps } from "~/components/Button/Button";
import React from "react";

export default function ButtonUndo({ children, ...props }: ButtonProps) {
  return (
    <Button className="rounded-md bg-gray-300 py-1 dark:bg-gray-900" {...props}>
      {children}
    </Button>
  );
}
