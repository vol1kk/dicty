import { render, screen } from "@testing-library/react";
import WordTitle, {
  type WordTitleProps,
} from "~/features/words-list/components/Word/WordTitle";
import { describe, expect, it } from "vitest";

function setup(props?: Partial<WordTitleProps>) {
  const name = props?.name || "Test Word";
  const transcription = props?.transcription || "/test-transcription/";
  const data = render(<WordTitle name={name} transcription={transcription} />);

  const wordTitleComponent = screen.getByTestId("word-title");

  return { data, wordTitleComponent, name, transcription };
}

describe("WordTitle Tests", function () {
  it("should render WordTitle component", () => {
    const { wordTitleComponent } = setup();

    expect(wordTitleComponent).toBeInTheDocument();
  });

  it("should have specified name and transcription as text content", () => {
    const { wordTitleComponent, name, transcription } = setup();

    expect(wordTitleComponent).toHaveTextContent(name);
    expect(wordTitleComponent).toHaveTextContent(transcription);
  });
});
