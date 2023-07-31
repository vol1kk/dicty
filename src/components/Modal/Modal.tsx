import React from "react";

type ModalProps = {
  children: React.ReactNode;
};

export default function Modal({ children }: ModalProps) {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
      {children}
    </div>
  );
}
