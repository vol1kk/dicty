import mockRouter from "next-router-mock";
import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import ChangeLanguage from "~/features/change-language";

function setup() {
  const data = render(<ChangeLanguage />, { wrapper: MemoryRouterProvider });

  const changeLanguageContainer = screen.getByTestId("languages-list");

  const ukrainianLang = screen.getByTestId("language-ua");
  const englishLang = screen.getByTestId("language-en");

  return { data, changeLanguageContainer, ukrainianLang, englishLang };
}

describe("ChangeLanguage tests", function () {
  it("should render ChangeLanguage", () => {
    const { changeLanguageContainer } = setup();

    expect(changeLanguageContainer).toBeInTheDocument();
  });

  it("should have language set to ukrainian", () => {
    const { ukrainianLang } = setup();

    fireEvent.click(ukrainianLang);
    expect(mockRouter.locale).toEqual("ua");
  });

  it("should have language set to english", () => {
    const { englishLang, ukrainianLang } = setup();

    fireEvent.click(ukrainianLang);
    expect(mockRouter.locale).toEqual("ua");

    fireEvent.click(englishLang);
    expect(mockRouter.locale).toEqual("en");
  });
});
