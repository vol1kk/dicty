import { describe, it, expect } from "vitest";

import { createWord } from "#tests/utils";
import { type Word } from "~/types/ApiTypes";
import { filterByWord } from "~/features/sort-words";
import { type FilterByWordProps } from "~/features/sort-words/utils/filterByWord";

function setup(props?: Partial<FilterByWordProps<Word>>) {
  const initialData = props?.data || [
    createWord({ name: "Live" }),
    createWord({ name: "Lie" }),
    createWord({ name: "LinkedIn" }),
    createWord({ name: "Australia" }),
  ];

  const query = props?.query ?? "";
  const matchCharDiff = props?.matchCharDiff ?? 3;
  const matchThreshold = props?.matchThreshold ?? 0.35;

  const result = filterByWord({
    query,
    matchCharDiff,
    matchThreshold,
    data: initialData,
  });

  return { initialData, result, query, matchCharDiff, matchThreshold };
}

describe("filterByWord tests", function () {
  it("should return all words", () => {
    const { initialData, result } = setup({ query: "" });

    expect(initialData).toEqual(result);
  });

  it("should return exact word", () => {
    const { initialData, result } = setup({
      query: "Australia",
    });

    expect(result).toHaveLength(1);
    expect(result).toEqual([initialData.at(-1)]);
  });

  it("should return word that satisfies given substring", () => {
    const { initialData, result } = setup({
      query: "ie",
    });

    expect(result).toHaveLength(1);
    expect(result).toEqual([initialData.at(1)]);
  });

  it("should return multiple words based on similar letters occurrences", () => {
    const { initialData, result } = setup({
      query: "liev",
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual(initialData.slice(0, 2));
  });
});
