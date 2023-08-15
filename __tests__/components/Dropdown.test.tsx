import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import Dropdown, { type DropdownProps } from "~/components/Dropdown";

function setup(props?: Partial<DropdownProps>) {
  const data = render(
    <Dropdown
      tabIndex={props?.tabIndex || 0}
      className={props?.className || ""}
      renderTitle={props?.renderTitle || (() => <h1>Title</h1>)}
      renderContent={props?.renderContent || (() => <div>Content</div>)}
      callback={props?.callback || console.log}
    />,
  );

  const container = screen.getByTestId("dropdown");
  const title = screen.getByTestId("dropdown-title");
  const content = screen.getByTestId("dropdown-content");

  return { data, container, title, content };
}

describe("Dropdown Tests", function () {
  it("should render dropdown", () => {
    const { container } = setup();

    expect(container).toBeInTheDocument();
  });

  it("should render dropdown", () => {
    const { title, content } = setup();

    expect(content).toHaveClass("pointer-events-none opacity-0");

    fireEvent.click(title);
    expect(content).not.toHaveClass("pointer-events-none opacity-0");

    fireEvent.click(title);
    expect(content).toHaveClass("pointer-events-none opacity-0");
  });
});
