import mockRouter from "next-router-mock";
import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { FilterByLang } from "~/features/sort-words";
import { type FilterByLangProps } from "~/features/sort-words/components/FilterByLang";

function setup(props?: Partial<FilterByLangProps>) {
  const currentLang = "ukrainian";
  const availableLanguages = ["english", "ukrainian"];
  const setLang = vi.fn();

  const data = render(
    <FilterByLang
      currentLang={props?.currentLang || currentLang}
      availableLanguages={props?.availableLanguages || availableLanguages}
      setLang={props?.setLang || setLang}
    />,
    { wrapper: MemoryRouterProvider },
  );

  const languagesContainer = screen.getByTestId("dropdown");
  const switchToAll = screen.getByTestId("lang-all");
  const switchToEN = screen.getByTestId("lang-english");
  const switchToUA = screen.getByTestId("lang-ukrainian");

  return {
    data,
    setLang,
    switchToUA,
    switchToEN,
    switchToAll,
    currentLang,
    languagesContainer,
    availableLanguages,
  };
}

describe("FilterByLang tests", function () {
  it("should render FilterByLang component", () => {
    const { languagesContainer } = setup();

    expect(languagesContainer).toBeInTheDocument();
  });

  it("should select english language", () => {
    const { switchToEN } = setup();

    fireEvent.click(switchToEN);

    expect(mockRouter.query.lang).toEqual("english");
  });

  it("should select ukrainian language", () => {
    const { switchToUA } = setup();

    fireEvent.click(switchToUA);

    expect(mockRouter.query.lang).toEqual("ukrainian");
  });

  it("should switch between languages", () => {
    const { switchToUA, switchToEN } = setup();

    fireEvent.click(switchToUA);
    expect(mockRouter.query.lang).toEqual("ukrainian");

    fireEvent.click(switchToEN);
    expect(mockRouter.query.lang).toEqual("english");
  });

  it("should be reset to all languages", () => {
    const { switchToAll, switchToUA } = setup();

    fireEvent.click(switchToUA);
    expect(mockRouter.query.lang).toEqual("ukrainian");

    fireEvent.click(switchToAll);
    expect(mockRouter.query.lang).toEqual(undefined);
  });
});
