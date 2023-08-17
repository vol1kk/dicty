import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { createWord } from "../../utils";
import { WordsList } from "~/features/words-list";
import * as React from "react";
import * as useSessionModule from "~/store/useSessionData";
import { type WordsListProps } from "~/features/words-list/components/WordsList";

function setup(props?: Partial<WordsListProps>) {
  const data = render(
    <WordsList
      data={props?.data || [createWord()]}
      isLoading={props?.isLoading ?? false}
    />,
  );

  const wordsListComponent = screen.queryByTestId("words-list");
  const notFoundComponent = screen.queryByTestId("notfound-container");
  const spinnerComponent = screen.queryByRole("status");

  return { data, wordsListComponent, notFoundComponent, spinnerComponent };
}

vi.mock("~/features/words-list/hooks/useToggleShareCode", () => ({
  default: vi.fn(() => ({ toggleShareCodeMutation: vi.fn })),
}));

describe("WordsList Tests", function () {
  it("should render words", () => {
    const { wordsListComponent } = setup();

    expect(wordsListComponent).toBeInTheDocument();
  });

  it("should render loading spinner", () => {
    const { wordsListComponent, notFoundComponent, spinnerComponent } = setup({
      isLoading: true,
    });

    expect(wordsListComponent).not.toBeInTheDocument();
    expect(notFoundComponent).not.toBeInTheDocument();
    expect(spinnerComponent).toBeInTheDocument();
  });

  it("should render notfound component", () => {
    const { wordsListComponent, spinnerComponent, notFoundComponent } = setup({
      data: [],
    });

    expect(wordsListComponent).not.toBeInTheDocument();
    expect(spinnerComponent).not.toBeInTheDocument();
    expect(notFoundComponent).toBeInTheDocument();
  });

  it("should open/close accordions correctly", () => {
    setup({ data: [createWord(), createWord({ id: "word-2" })] });
    const firstHeader = screen.getByTestId("word-header-word-1");
    const secondHeader = screen.getByTestId("word-header-word-2");

    // Initial Status
    expect(firstHeader).toHaveAttribute("aria-expanded", "false");
    expect(secondHeader).toHaveAttribute("aria-expanded", "false");

    // Expand first word
    fireEvent.click(firstHeader);
    expect(firstHeader).toHaveAttribute("aria-expanded", "true");
    expect(secondHeader).toHaveAttribute("aria-expanded", "false");

    // Expand second word & collapse first
    fireEvent.click(secondHeader);
    expect(firstHeader).toHaveAttribute("aria-expanded", "false");
    expect(secondHeader).toHaveAttribute("aria-expanded", "true");

    // Expand first word & collapse second
    fireEvent.click(firstHeader);
    expect(firstHeader).toHaveAttribute("aria-expanded", "true");
    expect(secondHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("should render word.share component when sessionData.isAuthed is true", () => {
    vi.spyOn(useSessionModule, "default").mockReturnValue(true);

    setup();

    expect(screen.queryByTestId("word-share")).toBeInTheDocument();
  });

  it("should not render word.share component when sessionData.isAuthed is false", () => {
    vi.spyOn(useSessionModule, "default").mockReturnValue(false);

    setup();

    expect(screen.queryByTestId("word-share")).not.toBeInTheDocument();
  });
});
