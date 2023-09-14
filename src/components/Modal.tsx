import React from "react";
import cn from "~/utils/cn";

type ModalProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Modal({ children, className }: ModalProps) {
  return (
    <div
      className={cn(
        className || "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
      )}
    >
      {children}
    </div>
  );
}
