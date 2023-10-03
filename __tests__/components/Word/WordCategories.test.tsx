import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { createCategory } from "#tests/utils";
import WordCategory, {
  type WordCategoryProps,
} from "~/components/Word/WordCategory";
import WordMeanings from "~/components/Word/WordMeanings";

function setup(props?: Partial<WordCategoryProps>) {
  const categoryName = props?.categoryName || "Test Category";

  const category = createCategory();
  const data = render(
    <WordCategory categoryName={category.name}>
      <WordMeanings meanings={category.meanings} />
    </WordCategory>,
  );

  const categoryContainer = screen.getByTestId(
    `category-${categoryName}-container`,
  );

  return { data, categoryContainer };
}

describe("WordCategory tests", function () {
  it("should render WordCategory component", () => {
    const { categoryContainer } = setup();

    expect(categoryContainer).toBeInTheDocument();
  });

  it("should render specified category name as text content", () => {
    const { categoryContainer } = setup();

    expect(categoryContainer).toHaveTextContent("Test Category");
  });

  it("should render specified definition and example as text content", () => {
    const { categoryContainer } = setup();

    const meaningsContainer =
      within(categoryContainer).getByTestId("meaning-meaning-1");

    expect(meaningsContainer).toHaveTextContent("Test Definition");
    expect(meaningsContainer).toHaveTextContent("Test Example");
  });
});
