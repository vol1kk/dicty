import { createPortal } from "react-dom";
import clsx from "clsx";
import { useEffect, useState } from "react";
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
  usePortal = false,
}: OverlayProps) {
  const [_document, setDocument] = useState<null | Document>(null);
  const setIsMenuOpen = useHeaderData(state => state.setIsHeaderOpen);

  useEffect(() => {
    setDocument(document);
  }, []);

  useEffect(() => {
    const clickCloseHandler = () => {
      if (isOverlayActive) setIsMenuOpen(false);
    };

    const keyboardCloseHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.body.classList.toggle("overflow-hidden");
    document.body.addEventListener("click", clickCloseHandler);
    document.body.addEventListener("keydown", keyboardCloseHandler);
    return () => {
      document.body.removeEventListener("click", clickCloseHandler);
      document.body.removeEventListener("keydown", keyboardCloseHandler);
    };
  }, [isOverlayActive, setIsMenuOpen]);

  if (!_document) return null;

  const content = (
    <>
      <div
        className={clsx(
          !isOverlayActive && "invisible",
          "fixed inset-0 z-10 bg-gray-300 dark:bg-gray-800",
          className,
        )}
      >
        {children}
      </div>
    </>
  );

  if (usePortal)
    return createPortal(
      content,
      _document.getElementById("overlay") as HTMLDivElement,
    );

  return content;
}
