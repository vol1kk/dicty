import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ChangeFont from "~/features/change-font";
import { type UseLocalDataProps } from "~/store/useLocalData";

function setup() {
  const data = render(<ChangeFont />);

  const changeFontContainer = screen.getByTestId("fonts-list");

  const fontSans = {
    button: screen.getByTestId("font-poppins"),
    value: "Sans-Serif",
  };

  const fontSerif = {
    button: screen.getByTestId("font-merriweather"),
    value: "Serif",
  };

  const fontMono = {
    button: screen.getByTestId("font-inconsolata"),
    value: "Mono",
  };

  return { data, changeFontContainer, fontSans, fontSerif, fontMono };
}

const mockedSetFont = vi.fn();
vi.mock("~/store/useLocalData", () => ({
  default: function <T extends keyof UseLocalDataProps>(
    selector: (state: UseLocalDataProps) => T,
  ) {
    const state = {
      words: [],
      theme: "dark",
      font: "Sans-Serif",
      setFont: mockedSetFont,
      setTheme: vi.fn(),
      setWords: vi.fn(),
    };

    return selector(state);
  },
}));

describe("ChangeFont tests", function () {
  it("should render ChangeFont", () => {
    const { changeFontContainer } = setup();

    expect(changeFontContainer).toBeInTheDocument();
  });

  it("should change font to Sans-Serif", () => {
    const { fontSans } = setup();

    fireEvent.click(fontSans.button);

    expect(mockedSetFont).toHaveBeenCalledWith(fontSans.value);
  });

  it("should change font to serif", () => {
    const { fontSerif } = setup();

    fireEvent.click(fontSerif.button);

    expect(mockedSetFont).toHaveBeenCalledWith(fontSerif.value);
  });

  it("should change font to mono", () => {
    const { fontMono } = setup();

    fireEvent.click(fontMono.button);

    expect(mockedSetFont).toHaveBeenCalledWith(fontMono.value);
  });
});
