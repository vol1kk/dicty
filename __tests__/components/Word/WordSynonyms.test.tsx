import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { createWord } from "#tests/utils";
import WordSynonyms, {
  type WordSynonymsProps,
} from "~/components/Word/WordSynonyms";

function setup(props?: Partial<WordSynonymsProps>) {
  const words = [createWord({ id: "2", name: "Word 2" })];
  const synonyms = ["Word 1", "Word 2"];
  const data = render(
    <WordSynonyms
      words={props?.words || words}
      synonyms={props?.synonyms || synonyms}
    />,
  );

  const synonymsContainer = screen.getByTestId("word-synonyms");
  const wordOne = screen.getByTestId("synonym-word2");

  return { data, synonymsContainer, wordOne };
}

describe("WordSynonyms tests", function () {
  it("should render WorSynonyms component", () => {
    const { synonymsContainer } = setup();

    expect(synonymsContainer).toBeInTheDocument();
  });

  it("should add hover to synonyms that are in dictionary", () => {
    const { wordOne } = setup();

    expect(wordOne).toHaveClass(
      "cursor-pointer underline-offset-2 hover:underline",
    );
  });
});
