import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { createMeaning } from "#tests/utils";
import WordMeanings, {
  type WordMeaningsProps,
} from "~/components/Word/WordMeanings";

function setup(props?: Partial<WordMeaningsProps>) {
  const data = render(
    <WordMeanings
      meanings={props?.meanings || [createMeaning()]}
      showExamples={props?.showExamples ?? true}
    />,
  );

  const meaningsContainer = screen.getByTestId("word-meanings");

  return { data, meaningsContainer };
}

describe("WordMeanings tests", function () {
  it("should render WordMeanings component", () => {
    const { meaningsContainer } = setup();

    expect(meaningsContainer).toBeInTheDocument();
  });

  it("should render specified definition and example as text content", () => {
    const { meaningsContainer } = setup();

    const meaning = within(meaningsContainer).getByTestId("meaning-meaning-1");

    expect(meaningsContainer).toBeInTheDocument();
    expect(meaning).toHaveTextContent("Test Definition");
    expect(meaning).toHaveTextContent("Test Example");
  });

  it("should render examples in WordMeanings component", () => {
    const { meaningsContainer } = setup({
      showExamples: true,
      meanings: [createMeaning(), createMeaning({ id: "meaning-2" })],
    });

    const examples =
      within(meaningsContainer).getAllByTestId("meaning-example");

    expect(examples).toHaveLength(2);
  });

  it("should not render examples in WordMeanings component", () => {
    const { meaningsContainer } = setup({
      showExamples: false,
      meanings: [
        createMeaning(),
        createMeaning({ id: "meaning-2", example: "Test Example 2" }),
      ],
    });

    const examples =
      within(meaningsContainer).queryAllByTestId("meaning-example");

    expect(examples).toHaveLength(0);
  });
});
