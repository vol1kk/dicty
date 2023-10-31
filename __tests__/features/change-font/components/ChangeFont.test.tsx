import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ChangeFont from "~/features/change-font";
import { mockedSetFont } from "#tests/setup";

vi.mock("next/font/google", () => ({
  Poppins: () => ({ className: "poppins" }),
  Merriweather: () => ({ className: "merriweather" }),
  Inconsolata: () => ({ className: "inconsolata" }),
}));

function setup() {
  const data = render(<ChangeFont />);

  const changeFontContainer = screen.getByTestId("fonts-list");

  const fontSans = {
    button: screen.getByTestId("sans-serif"),
    value: "Sans-Serif",
  };

  const fontSerif = {
    button: screen.getByTestId("serif"),
    value: "Serif",
  };

  const fontMono = {
    button: screen.getByTestId("mono"),
    value: "Mono",
  };

  return { data, changeFontContainer, fontSans, fontSerif, fontMono };
}

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
