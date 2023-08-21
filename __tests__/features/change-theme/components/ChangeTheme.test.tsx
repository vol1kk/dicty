import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ChangeTheme from "~/features/change-theme";
import * as useLocalDataModule from "~/store/useLocalData";

type ChangeThemeTest = {
  initialTheme: "light" | "dark";
};

function setup(props?: Partial<ChangeThemeTest>) {
  vi.spyOn(useLocalDataModule, "default").mockImplementation(selector => {
    const state = {
      theme: props?.initialTheme || "light",
      words: [],
      font: "Sans-Serif",
      setFont: vi.fn(),
      setTheme: mockedSetTheme,
      setWords: vi.fn(),
    };

    return selector(state);
  });

  const data = render(<ChangeTheme />);

  const changeThemeContainer = screen.getByTestId("switch-container");
  const buttonChangeTheme = screen.getByRole("switch");

  return { data, changeThemeContainer, buttonChangeTheme };
}

const mockedSetTheme = vi.fn();
describe("ChangeTheme tests", function () {
  it("should render ChangeTheme", () => {
    const { changeThemeContainer } = setup();

    expect(changeThemeContainer).toBeInTheDocument();
  });

  it("should change theme to light", () => {
    const { buttonChangeTheme } = setup({ initialTheme: "dark" });

    fireEvent.click(buttonChangeTheme);

    expect(mockedSetTheme).toHaveBeenCalledWith("light");
  });

  it("should change theme to dark", () => {
    const { buttonChangeTheme } = setup({ initialTheme: "light" });

    fireEvent.click(buttonChangeTheme);

    expect(mockedSetTheme).toHaveBeenCalledWith("dark");
  });
});
