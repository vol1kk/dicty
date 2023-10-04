import mockRouter from "next-router-mock";
import { describe, it, vi, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { FilterByDictionary } from "~/features/sort-words";
import { type FilterByDictionaryProps } from "~/features/sort-words/components/FilterByDictionary";

function setup(props?: FilterByDictionaryProps) {
  const currentDictionary = "ukrainian";
  const availableDictionaries = ["english", "japanese", "ukrainian"];
  const setDictionary = vi.fn();

  const data = render(
    <FilterByDictionary
      setDictionary={props?.setDictionary || setDictionary}
      currentDictionary={props?.currentDictionary || currentDictionary}
      availableDictionaries={
        props?.availableDictionaries || availableDictionaries
      }
    />,
    { wrapper: MemoryRouterProvider },
  );

  const dictionaryContainer = screen.getByTestId("dropdown");
  const switchToAll = screen.getByTestId("dict-all");
  const switchToEN = screen.getByTestId("dict-english");
  const switchToJP = screen.getByTestId("dict-japanese");

  return {
    data,
    switchToEN,
    switchToJP,
    switchToAll,
    setDictionary,
    currentDictionary,
    dictionaryContainer,
    availableDictionaries,
  };
}

describe("FilterByDictionary tests", function () {
  it("should render FilterByDictionary component", () => {
    const { dictionaryContainer } = setup();

    expect(dictionaryContainer).toBeInTheDocument();
  });

  it("should select english dictionary", () => {
    const { switchToEN } = setup();

    fireEvent.click(switchToEN);

    expect(mockRouter.query.dict).toEqual("english");
  });

  it("should select japanese dictionary", () => {
    const { switchToJP } = setup();

    fireEvent.click(switchToJP);

    expect(mockRouter.query.dict).toEqual("japanese");
  });

  it("should switch between dictionaries", () => {
    const { switchToJP, switchToEN } = setup();

    fireEvent.click(switchToJP);
    expect(mockRouter.query.dict).toEqual("japanese");

    fireEvent.click(switchToEN);
    expect(mockRouter.query.dict).toEqual("english");
  });

  it("should select reset to all dictionaries", () => {
    const { switchToAll } = setup();

    fireEvent.click(switchToAll);

    expect(mockRouter.query.dict).toEqual(undefined);
  });
});
