import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WordEdit, {
  type WordEditProps,
} from "~/features/words-list/components/Word/WordEdit";

function setup(props?: Partial<WordEditProps>) {
  const wordId = props?.wordId || "word-1";
  const data = render(<WordEdit wordId={wordId} />, {
    wrapper: MemoryRouterProvider,
  });

  const wordEditComponent = screen.getByTestId("word-edit");

  return { data, wordEditComponent, wordId };
}

describe("WordEdit Tests", function () {
  it("should render WordEdit Component", () => {
    const { wordEditComponent } = setup();

    expect(wordEditComponent).toBeInTheDocument();
  });

  it("should render link with proper href attribute", () => {
    const { wordEditComponent, wordId } = setup();

    expect(wordEditComponent).toHaveAttribute("href", "/edit/" + wordId);
  });

  it("should redirect to proper page", () => {
    const { wordEditComponent, wordId } = setup();

    fireEvent.click(wordEditComponent);

    expect(mockRouter.asPath).toEqual("/edit/" + wordId);
  });
});
