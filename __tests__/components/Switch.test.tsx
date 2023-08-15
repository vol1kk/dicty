import { vi, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import Switch, { type SwitchProps } from "~/components/Switch";

function setup(props?: Partial<SwitchProps>) {
  const switchAction = props?.switchAction || "Switch Test";

  const data = render(
    <Switch
      isChecked={props?.isChecked || false}
      switchAction={switchAction}
      handleCheck={props?.handleCheck || vi.fn}
    />,
  );

  const switchButton = screen.getByRole("switch");

  return { data, switchButton, switchAction };
}

describe("Switch Tests", function () {
  it("should render switch", () => {
    const { switchButton } = setup();

    expect(switchButton).toBeInTheDocument();
  });

  it("should call handleCheck", () => {
    const mockHandleCheck = vi.fn();
    const { switchButton } = setup({ handleCheck: mockHandleCheck });

    fireEvent.click(switchButton);
    expect(mockHandleCheck).toHaveBeenCalledOnce();
  });

  it("should render provided text content", () => {
    const { switchAction, switchButton } = setup();

    expect(switchButton).toHaveTextContent(switchAction);
  });
});
