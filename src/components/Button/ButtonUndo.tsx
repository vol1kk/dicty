import React from "react";

import Button, { type ButtonProps } from "~/components/Button/Button";

export default function ButtonUndo({ children, ...props }: ButtonProps) {
  return (
    <Button
      className="rounded-md bg-primary bg-opacity-30 py-1 transition-transform dark:bg-gray-900"
      {...props}
    >
      {children}
    </Button>
  );
}
