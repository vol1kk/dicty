import { vi, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import Button, { type ButtonProps } from "~/components/Button/Button";
import ButtonBurger, {
  type BurgerButtonProps,
} from "~/components/Button/ButtonBurger";

function setupButton(props?: Partial<ButtonProps>) {
  const data = render(
    <Button isSubmit={props?.isSubmit ?? true} {...props}>
      Button
    </Button>,
  );

  const button = screen.getByRole("button");

  return { data, button };
}

describe("Button Tests", function () {
  it("should render button", () => {
    const { button } = setupButton();

    expect(button).toBeInTheDocument();
  });

  it("should be type=submit", () => {
    const { button } = setupButton({ isSubmit: true });

    expect(button).not.toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("should not be type=submit", () => {
    const { button } = setupButton({ isSubmit: false });

    expect(button).not.toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("type", "button");
  });
});

function setupBurgerButton(props?: Partial<BurgerButtonProps>) {
  const data = render(
    <ButtonBurger
      isOpen={props?.isOpen ?? true}
      openHandler={props?.openHandler || vi.fn}
      ariaLabel={props?.ariaLabel || "Burger Button Test"}
    />,
  );

  const button = screen.getByRole("button");

  return { data, button };
}

describe("Burger Button Tests", function () {
  it("should render burger button", () => {
    const { button } = setupBurgerButton();

    expect(button).toBeInTheDocument();
  });

  it("should have aria-expanded=true", () => {
    const { button } = setupBurgerButton({ isOpen: true });

    expect(button).not.toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("should have aria-expanded=false", () => {
    const { button } = setupBurgerButton({ isOpen: false });

    expect(button).not.toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("should trigger onClick event", () => {
    const mockOnClick = vi.fn();

    const { button } = setupBurgerButton({ openHandler: mockOnClick });

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledOnce();
  });
});
