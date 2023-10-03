import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { createWord } from "#tests/utils";
import * as useSessionModule from "~/store/useSessionData";
import { type UseSessionDataProps } from "~/store/useSessionData";
import WordsList, { type WordsListProps } from "~/features/words-list";

function setup(props?: Partial<WordsListProps & UseSessionDataProps>) {
  vi.spyOn(useSessionModule, "default").mockImplementation(selector => {
    const state = {
      session: props?.session || null,
      isAuthed: props?.isAuthed ?? false,
      setSession: props?.setSession || vi.fn(),
      status: props?.status || "unauthenticated",
    };

    return selector(state);
  });

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

  // Probably very hacky way to check if ariaExpanded is set,
  // because 'toHaveAttribute' didn't really work here
  it("should open/close accordions correctly", () => {
    setup({ data: [createWord(), createWord({ id: "word-2" })] });
    const firstHeader = screen.getByTestId("word-header-word-1");
    const secondHeader = screen.getByTestId("word-header-word-2");

    // Initial Status
    expect(firstHeader.ariaExpanded).toEqual(undefined);
    expect(secondHeader.ariaExpanded).toEqual(undefined);

    // Expand first word
    fireEvent.click(firstHeader);
    expect(firstHeader.ariaExpanded).toEqual("true");
    expect(secondHeader.ariaExpanded).toEqual(undefined);

    // Expand second word
    fireEvent.click(secondHeader);
    expect(firstHeader.ariaExpanded).toEqual("true");
    expect(secondHeader.ariaExpanded).toEqual("true");

    // Collapse first word
    fireEvent.click(firstHeader);
    expect(firstHeader.ariaExpanded).toEqual("false");
    expect(secondHeader.ariaExpanded).toEqual("true");

    // Collapse second word
    fireEvent.click(secondHeader);
    expect(firstHeader.ariaExpanded).toEqual("false");
    expect(secondHeader.ariaExpanded).toEqual("false");
  });

  it("should render word.share component when sessionData.isAuthed is true", () => {
    setup({ isAuthed: true });

    expect(screen.queryByTestId("word-share")).toBeInTheDocument();
  });

  it("should not render word.share component when sessionData.isAuthed is false", () => {
    setup({ isAuthed: false });

    expect(screen.queryByTestId("word-share")).not.toBeInTheDocument();
  });
});
