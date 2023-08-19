import { vi, describe, expect, it } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import Dropdown, { type DropdownProps } from "~/components/Dropdown";

function setup(props?: Partial<DropdownProps>) {
  const mockedCallback = vi.fn();

  const data = render(
    <Dropdown
      tabIndex={props?.tabIndex || 0}
      className={props?.className || ""}
      renderTitle={props?.renderTitle || (() => <h1>Title</h1>)}
      renderContent={
        props?.renderContent ||
        (dropdownItemHandler => (
          <ul
            data-testid="dropdown-list"
            className="rounded-md bg-white p-4 dark:bg-gray-900 [&>li]:leading-8"
          >
            {["First Option", "Second Option"].map((i, ind) => (
              <li
                key={ind}
                data-testid={`option-${ind}`}
                role="option"
                aria-selected={ind === 0}
                tabIndex={ind === 1 ? 0 : -1}
                onClick={e => dropdownItemHandler(e)}
                className="cursor-pointer whitespace-nowrap rounded-md px-4 py-2 outline-2 outline-offset-2 outline-primary hover:text-primary focus-visible:outline aria-selected:text-primary"
              >
                {i}
              </li>
            ))}
          </ul>
        ))
      }
      callback={props?.callback || mockedCallback}
    />,
  );

  const container = screen.getByTestId("dropdown");
  const title = screen.getByTestId("dropdown-title");
  const content = screen.getByTestId("dropdown-content");

  const dropdownListContainer = screen.getByTestId("dropdown-list");
  const firstOption = within(dropdownListContainer).getByTestId("option-0");
  const secondOption = within(dropdownListContainer).getByTestId("option-1");

  return {
    data,
    container,
    title,
    content,
    mockedCallback,
    firstOption,
    secondOption,
  };
}

describe("Dropdown Tests", function () {
  it("should render dropdown", () => {
    const { container } = setup();

    expect(container).toBeInTheDocument();
  });

  it("should open & close dropdown on click", () => {
    const { title, content } = setup();

    expect(content).toHaveClass("pointer-events-none opacity-0");
    expect(title).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(title);
    expect(title).toHaveAttribute("aria-expanded", "true");
    expect(content).toHaveClass("opacity-100");

    fireEvent.click(title);
    expect(content).toHaveClass("pointer-events-none opacity-0");
    expect(title).toHaveAttribute("aria-expanded", "false");
  });

  it("should close dropdown on Escape press", () => {
    const { title } = setup();

    // Initial Status - Open
    fireEvent.click(title);
    expect(title).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(title, { key: "Escape", code: "Escape", charCode: 27 });
    expect(title).toHaveAttribute("aria-expanded", "false");
  });

  it("should close dropdown on Tab press", () => {
    const { title } = setup();

    // Initial Status - Open
    fireEvent.click(title);
    expect(title).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(title, { key: "Tab", code: "Tab", charCode: 9 });
    expect(title).toHaveAttribute("aria-expanded", "false");
  });

  it("should open/close dropdown on Space press", () => {
    const { title, mockedCallback, firstOption } = setup();

    // Initial Status - Open
    fireEvent.keyDown(title, { key: " ", code: "Space", charCode: 32 });
    expect(title).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(title, { key: " ", code: "Space", charCode: 32 });
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(mockedCallback).toHaveBeenCalledWith(firstOption);
  });

  it("should open/close dropdown on Enter press", () => {
    const { title, firstOption, mockedCallback } = setup();

    // Initial Status - Open
    fireEvent.keyDown(title, { key: "Enter", code: "Enter", charCode: 13 });
    expect(title).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(title, { key: "Enter", code: "Enter", charCode: 13 });
    expect(title).toHaveAttribute("aria-expanded", "false");
    expect(mockedCallback).toHaveBeenCalledWith(firstOption);
  });

  it("should close on focus lose", () => {
    const { title } = setup();

    // Initial Status - Open
    fireEvent.keyDown(title, { key: "Enter", code: "Enter", charCode: 13 });
    expect(title).toHaveAttribute("aria-expanded", "true");

    fireEvent.blur(title);
    expect(title).toHaveAttribute("aria-expanded", "false");
  });
});
