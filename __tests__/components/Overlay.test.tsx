import { vi, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";

import Overlay, { type OverlayProps } from "~/components/Overlay";

function setup(props?: Partial<OverlayProps>) {
  const data = render(
    <>
      <div data-testid="overlay-wrapper" id="overlay" />,
      <Overlay
        isOpen={props?.isOpen || false}
        setIsOpen={props?.setIsOpen || vi.fn}
        usePortal={props?.usePortal}
        className={props?.className}
      >
        <ul onClick={e => e.stopPropagation()}>
          <li>
            <button data-testid="button-first">First Button</button>
          </li>
          <li>
            <button data-testid="button-second">Second Button</button>
          </li>
        </ul>
      </Overlay>
    </>,
  );

  const overlayWrapper = screen.getByTestId("overlay-wrapper");
  const overlay = screen.getByTestId("overlay");

  const firstButton = screen.getByTestId("button-first");
  const secondButton = screen.getByTestId("button-second");

  return { data, overlay, overlayWrapper, firstButton, secondButton };
}

describe("Overlay Tests", function () {
  it("should render overlay w/o portals", () => {
    const { overlay, overlayWrapper } = setup({ usePortal: false });

    expect(overlay).toBeInTheDocument();
    expect(overlayWrapper).not.toContainElement(overlay);
  });

  it("should render overlay using portals", () => {
    const { overlay, overlayWrapper } = setup({ usePortal: true });

    expect(overlayWrapper).toContainElement(overlay);
  });

  it("should be hidden", () => {
    const { overlay } = setup({ isOpen: false });

    expect(overlay).toHaveClass("invisible");
  });

  it("should be visible", () => {
    const { overlay } = setup({ isOpen: true });

    expect(overlay).not.toHaveClass("invisible");
  });

  it("should call setIsOpen with false to close overlay", () => {
    const mockSetIsOpen = vi.fn();

    setup({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });

    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(mockSetIsOpen).toHaveBeenCalledTimes(1);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);

    fireEvent.click(document.body);
    expect(mockSetIsOpen).toHaveBeenCalledTimes(2);
    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it("should focus elements on tab press", async () => {
    const { secondButton, firstButton } = setup({
      isOpen: true,
    });

    await userEvent.tab();
    expect(firstButton).toHaveFocus();

    await userEvent.tab();
    expect(secondButton).toHaveFocus();
  });

  it("should focus prev element on shift+tab press", async () => {
    const { secondButton, firstButton } = setup({
      isOpen: true,
    });
    await userEvent.tab({ shift: true });
    expect(secondButton).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(firstButton).toHaveFocus();
  });
});
