import React, { useEffect, useState } from "react";
import cn from "~/utils/cn";

export type DropdownProps = {
  tabIndex?: number;
  className?: string;
  classNameContent?: string;
  callback: (data: HTMLLIElement) => void;
  renderTitle: (isDropdownOpen: boolean) => React.ReactElement;
  renderContent: (
    dropdownItemHandler: (item: React.MouseEvent<HTMLLIElement>) => void,
  ) => React.ReactElement;
};

export default function Dropdown({
  callback,
  className,
  renderTitle,
  tabIndex = 0,
  renderContent,
  classNameContent,
}: DropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const content = renderContent(dropdownItemHandler);
  const title = renderTitle(isDropdownOpen);

  useEffect(() => {
    const closeFontMenuHandler = () => setIsDropdownOpen(false);
    document.body.addEventListener("click", closeFontMenuHandler);

    return () => {
      document.body.removeEventListener("click", closeFontMenuHandler);
    };
  }, [setIsDropdownOpen]);

  function dropdownClickHandler(e: React.MouseEvent) {
    e.stopPropagation();
    setIsDropdownOpen(p => !p);
  }

  function dropdownFocusLoseHandler(e: React.FocusEvent) {
    // If focused element doesn't have role of listbox, then close the menu
    if (!e.relatedTarget?.closest("[role='listbox']")) setIsDropdownOpen(false);
  }

  function dropdownItemHandler(e: React.MouseEvent) {
    setIsDropdownOpen(false);
    callback(e.target as HTMLLIElement);
  }

  function dropdownKeyboardHandler(e: React.KeyboardEvent) {
    if (
      e.key === " " ||
      e.key === "Enter" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    )
      e.preventDefault();

    const dropdown = e.currentTarget.parentElement?.querySelector(
      "[role='listbox']",
    ) as HTMLDivElement;
    const dropdownItems = dropdown.querySelectorAll("li");
    const selectedItem = dropdown?.querySelector(
      "li[aria-selected=true]",
    ) as HTMLLIElement;

    let data = selectedItem;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (e.key === "ArrowUp") {
        data = selectedItem?.previousElementSibling
          ? (selectedItem.previousElementSibling as HTMLLIElement)
          : (dropdownItems[dropdownItems.length - 1] as HTMLLIElement);
      }

      if (e.key === "ArrowDown") {
        data = selectedItem?.nextElementSibling
          ? (selectedItem?.nextElementSibling as HTMLLIElement)
          : (dropdownItems[0] as HTMLLIElement);
      }

      selectedItem.ariaSelected = "false";
      data.ariaSelected = "true";
    }

    if (e.key === " " || e.key === "Enter") {
      setIsDropdownOpen(p => !p);
      if (isDropdownOpen) callback(data);
    }

    if (
      e.key === "Escape" ||
      e.key === "Tab" ||
      (e.key === "Tab" && e.shiftKey)
    )
      setIsDropdownOpen(false);
  }

  return (
    <div data-testid="dropdown" className={className}>
      <div
        tabIndex={tabIndex}
        data-testid="dropdown-title"
        aria-expanded={isDropdownOpen}
        onBlur={dropdownFocusLoseHandler}
        onKeyDown={dropdownKeyboardHandler}
        onClick={dropdownClickHandler}
        className="rounded-md outline-2 outline-offset-2 outline-primary focus-visible:outline"
      >
        {title}
      </div>

      <div
        role="listbox"
        data-testid="dropdown-content"
        tabIndex={-1}
        className={cn(
          "absolute z-10 mt-2 w-fit shadow-2xl transition-opacity",
          isDropdownOpen ? "opacity-100" : "pointer-events-none opacity-0",
          classNameContent || "left-0",
        )}
      >
        {content}
      </div>
    </div>
  );
}
