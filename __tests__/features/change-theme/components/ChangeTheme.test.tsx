import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ChangeTheme from "~/features/change-theme";
import * as useLocalDataModule from "~/store/useLocalData";

function setup() {
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
    const mockedSetTheme = vi.fn();
    vi.spyOn(useLocalDataModule, "default").mockImplementation(selector => {
      const state = {
        words: [],
        theme: "dark",
        font: "Sans-Serif",
        setFont: vi.fn(),
        setTheme: mockedSetTheme,
        setWords: vi.fn(),
      };

      return selector(state);
    });

    const { buttonChangeTheme } = setup();

    fireEvent.click(buttonChangeTheme);

    expect(mockedSetTheme).toHaveBeenCalledWith("light");
  });

  it("should change theme to dark", () => {
    vi.spyOn(useLocalDataModule, "default").mockImplementation(selector => {
      const state = {
        words: [],
        theme: "light",
        font: "Sans-Serif",
        setFont: vi.fn(),
        setTheme: mockedSetTheme,
        setWords: vi.fn(),
      };

      return selector(state);
    });

    const { buttonChangeTheme } = setup();

    fireEvent.click(buttonChangeTheme);

    expect(mockedSetTheme).toHaveBeenCalledWith("dark");
  });
});
