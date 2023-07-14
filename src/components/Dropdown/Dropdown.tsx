import clsx from "clsx";
import { useEffect, useState } from "react";

type DropdownProps = {
  tabIndex?: number;
  className?: string;
  renderTitle: (isDropdownOpen: boolean) => React.ReactElement;
  renderContent: (
    dropdownItemHandler: (item: React.MouseEvent<HTMLLIElement>) => void,
  ) => React.ReactElement;
  callback: (data: HTMLLIElement) => void;
};

export default function Dropdown({
  tabIndex = 0,
  className,
  renderTitle,
  renderContent,
  callback,
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
    <div className={className}>
      <div
        tabIndex={tabIndex}
        aria-expanded={isDropdownOpen}
        onKeyDown={dropdownKeyboardHandler}
        onClick={dropdownClickHandler}
        className="rounded-md p-2 outline-2 outline-offset-2 outline-primary focus-visible:outline"
      >
        {title}
      </div>

      <div
        role="listbox"
        tabIndex={-1}
        className={clsx(
          isDropdownOpen ? "block" : "hidden",
          "absolute z-10 mt-2 w-fit shadow-2xl",
        )}
      >
        {content}
      </div>
    </div>
  );
}
