import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { createCategory } from "#tests/utils";
import WordCategories, {
  type WordCategoryProps,
} from "~/features/words-list/components/Word/WordCategories";

function setup(props?: Partial<WordCategoryProps>) {
  const data = render(
    <WordCategories categories={props?.categories || [createCategory()]} />,
  );

  const categoriesContainer = screen.getByTestId("word-categories");

  return { data, categoriesContainer };
}

describe("WordCategories tests", function () {
  it("should render WordCategories component", () => {
    const { categoriesContainer } = setup();

    expect(categoriesContainer).toBeInTheDocument();
  });

  it("should render specified category name as text content", () => {
    const { categoriesContainer } = setup();

    expect(categoriesContainer).toHaveTextContent("Test Category");
  });

  it("should render specified definition and example as text content", () => {
    const { categoriesContainer } = setup();

    const meaningsContainer =
      within(categoriesContainer).getByTestId("meaning-meaning-1");

    expect(meaningsContainer).toHaveTextContent("Test Definition");
    expect(meaningsContainer).toHaveTextContent("Test Example");
  });
});
