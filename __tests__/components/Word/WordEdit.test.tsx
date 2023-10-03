import mockRouter from "next-router-mock";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import WordEdit, { type WordEditProps } from "~/components/Word/WordEdit";

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

  it("should redirect to edit page", () => {
    const { wordEditComponent, wordId } = setup();

    fireEvent.click(wordEditComponent);

    expect(mockRouter.asPath).toEqual("/edit/" + wordId);
  });
});
