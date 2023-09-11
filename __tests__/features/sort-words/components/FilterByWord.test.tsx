import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { FilterByWord } from "~/features/sort-words";
import { type SearchWordsProps } from "~/features/sort-words/components/FilterByWord";

function setup(props?: Partial<SearchWordsProps>) {
  const mockedSetSearchValue = props?.setSearchValue || vi.fn();
  const mockedSearchValue = props?.searchValue || "";

  const data = render(
    <FilterByWord
      searchValue={mockedSearchValue}
      setSearchValue={mockedSetSearchValue}
    />,
  );

  const searchWordsInput = screen.getByTestId("search-words-input");
  const searchWordsContainer = screen.getByTestId("search-words-container");

  return {
    data,
    mockedSearchValue,
    mockedSetSearchValue,
    searchWordsInput,
    searchWordsContainer,
  };
}

describe("SearchWords Tests", function () {
  it("should render SearchWords", () => {
    const { searchWordsContainer } = setup();

    expect(searchWordsContainer).toBeInTheDocument();
  });

  it("should have specified initial value", () => {
    const { searchWordsInput, mockedSearchValue } = setup({
      searchValue: "Mocked Searched Value",
    });

    expect(searchWordsInput).toHaveAttribute("value", mockedSearchValue);
  });

  it("should call mockedSearchValue", async () => {
    const { searchWordsInput, mockedSetSearchValue } = setup();

    const value = "Mocked Searched Value";
    fireEvent.change(searchWordsInput, { target: { value } });

    await waitFor(() =>
      expect(mockedSetSearchValue).toHaveBeenCalledWith(value),
    );
  });
});
