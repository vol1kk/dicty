import clsx from "clsx";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import useHeaderData from "~/store/useHeaderData";

type OverlayProps = {
  className: string;
  usePortal?: boolean;
  isOverlayActive: boolean;
  children: React.ReactNode;
};

export default function Overlay({
  children,
  className,
  isOverlayActive,
  usePortal = true,
}: OverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const setIsMenuOpen = useHeaderData(state => state.setIsHeaderOpen);
  const [_document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    setDocument(document);
  }, []);

  useEffect(() => {
    const clickCloseHandler = () => {
      if (isOverlayActive) setIsMenuOpen(false);
    };

    const keyboardCloseHandler = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === "Escape") setIsMenuOpen(false);

      const focusableNodes = overlayRef.current?.querySelectorAll(
        "a, input, button, div[tabindex='0']",
      );

      if (focusableNodes?.length === 0) return;

      const focusableElements = Array.from(focusableNodes ?? []);
      const currentFocusIndex = focusableElements.findIndex(
        e => e === document.activeElement,
      );

      let nextIndex = currentFocusIndex;

      if (e.key === "Tab") {
        nextIndex =
          focusableElements.length - 1 === currentFocusIndex
            ? 0
            : nextIndex + 1;
      }

      if (e.key === "Tab" && e.shiftKey) {
        nextIndex =
          currentFocusIndex - 1 < 0
            ? focusableElements.length - 1
            : currentFocusIndex - 1;
      }

      const nextFocusedElement = focusableElements[nextIndex] as HTMLElement;
      nextFocusedElement?.focus();
    };

    document.body.classList.toggle("overflow-hidden");
    if (isOverlayActive) {
      document.body.addEventListener("click", clickCloseHandler);
      document.body.addEventListener("keydown", keyboardCloseHandler);
    }

    return () => {
      document.body.removeEventListener("click", clickCloseHandler);
      document.body.removeEventListener("keydown", keyboardCloseHandler);
    };
  }, [isOverlayActive, setIsMenuOpen]);

  const content = (
    <div
      ref={overlayRef}
      className={clsx(
        !isOverlayActive && "invisible",
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
