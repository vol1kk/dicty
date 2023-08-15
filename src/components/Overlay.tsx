import clsx from "clsx";
import { createPortal } from "react-dom";
import React, { useEffect, useRef, useState } from "react";

export type OverlayProps = {
  className?: string;
  usePortal?: boolean;
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
  children: React.ReactNode;
};

export default function Overlay({
  children,
  className,
  isOpen,
  setIsOpen,
  usePortal = true,
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [_document, setDocument] = useState<Document | null>(null);

  useEffect(() => setDocument(document), []);

  useEffect(() => {
    const clickCloseHandler = () => {
      if (isOpen) setIsOpen(false);
    };

    const keyboardCloseHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);

      const focusableNodes = overlayRef.current?.querySelectorAll(
        "a, button, div[tabindex='0']",
      );

      if (focusableNodes?.length === 0) return;

      const focusableElements = Array.from(focusableNodes ?? []);
      const currentFocusIndex = focusableElements.findIndex(
        e => e === document.activeElement,
      );

      let nextIndex = currentFocusIndex;

      if (e.key === "Tab") {
        e.preventDefault();
        nextIndex =
          focusableElements.length - 1 === currentFocusIndex
            ? 0
            : nextIndex + 1;
      }

      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        nextIndex =
          currentFocusIndex - 1 < 0
            ? focusableElements.length - 1
            : currentFocusIndex - 1;
      }

      const nextFocusedElement = focusableElements[nextIndex] as HTMLElement;
      nextFocusedElement?.focus();
    };

    document.body.classList.toggle("overflow-hidden");
    if (isOpen) {
      document.body.addEventListener("click", clickCloseHandler);
      document.body.addEventListener("keydown", keyboardCloseHandler);
    }

    return () => {
      document.body.removeEventListener("click", clickCloseHandler);
      document.body.removeEventListener("keydown", keyboardCloseHandler);
    };
  }, [isOpen, setIsOpen]);

  const content = (
    <div
      role="dialog"
      ref={overlayRef}
      data-testid="overlay"
      className={clsx(
        !isOpen && "invisible",
        "fixed inset-0 z-10 text-black dark:text-gray-100",
        className,
      )}
    >
      {children}
    </div>
  );

  if (_document && usePortal)
    return createPortal(
      content,
      _document.getElementById("overlay") as HTMLDivElement,
    );

  return content;
}
