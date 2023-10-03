import React from "react";

import { Button, type ButtonProps } from "~/components/Button";

export default function ButtonUndo({ children, ...props }: ButtonProps) {
  return (
    <Button
      variant="darker"
      className="bg-primary bg-opacity-30 py-1 transition-transform"
      {...props}
    >
      {children}
    </Button>
  );
}
