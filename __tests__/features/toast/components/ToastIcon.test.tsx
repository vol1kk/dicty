import { type ToastIconProps } from "~/features/toast/components/ToastIcon";
import { render, screen, within } from "@testing-library/react";
import { ToastIcon } from "~/features/toast";
import { describe, expect, it } from "vitest";

function setup(props?: Partial<ToastIconProps>) {
  const type = props?.type || "success";

  const data = render(<ToastIcon type={type} dimensions={28} />);

  const toastIconContainer = screen.getByTestId("toast-icon-container");
  const errorIcon = within(toastIconContainer).queryByTestId("icon-error");
  const successIcon = within(toastIconContainer).queryByTestId("icon-success");
  const warningIcon = within(toastIconContainer).queryByTestId("icon-warning");

  return {
    data,
    type,
    errorIcon,
    successIcon,
    warningIcon,
    toastIconContainer,
  };
}

describe("ToastIcon tests", function () {
  it("should render ToastIcon", () => {
    const { toastIconContainer } = setup();

    expect(toastIconContainer).toBeInTheDocument();
  });

  it("should render with SuccessIcon", () => {
    const { toastIconContainer, successIcon } = setup({ type: "success" });

    expect(successIcon).toBeInTheDocument();
    expect(toastIconContainer).toHaveClass("[&>svg]:fill-green-400");
  });

  it("should render with WarningIcon", () => {
    const { toastIconContainer, warningIcon } = setup({ type: "warning" });

    expect(warningIcon).toBeInTheDocument();
    expect(toastIconContainer).toHaveClass("[&>svg]:fill-blue-400");
  });

  it("should render with ErrorIcon", () => {
    const { toastIconContainer, errorIcon } = setup({ type: "error" });

    expect(errorIcon).toBeInTheDocument();
    expect(toastIconContainer).toHaveClass("[&>svg]:fill-red-400");
  });
});
