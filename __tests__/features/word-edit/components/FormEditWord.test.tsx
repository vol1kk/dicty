import mockRouter from "next-router-mock";
import { vi, describe, expect, it } from "vitest";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { createWord } from "#tests/utils";
import WordEdit from "~/features/word-edit";
import { type FormEditWordProps } from "~/features/word-edit/components/FormEditWord";

function setup(props?: Partial<FormEditWordProps>) {
  const word = props?.word || createWord();
  const data = render(<WordEdit word={word} />, {
    wrapper: MemoryRouterProvider,
  });

  const formComponent = screen.getByTestId("word-form");
  const saveButton = screen.getByTestId("button-save");
  const deleteButton = screen.getByTestId("button-delete");
  const goBackButton = screen.getByTestId("button-back");

  return { data, word, formComponent, saveButton, deleteButton, goBackButton };
}

const mockedCreateWord = vi.fn();
vi.mock("~/features/word-add/hooks/useCreateWord", () => ({
  default: vi.fn(() => mockedCreateWord),
}));

const mockedUseDeleteWord = vi.fn();
vi.mock("~/features/word-edit/hooks/useDeleteWord", () => ({
  default: vi.fn(() => mockedUseDeleteWord),
}));

const mockedUseUpdateWord = vi.fn();
vi.mock("~/features/word-edit/hooks/useUpdateWord", () => ({
  default: vi.fn(() => mockedUseUpdateWord),
}));

describe("EditWord Page Test", function () {
  it("should render component", () => {
    const { formComponent } = setup();

    expect(formComponent).toBeInTheDocument();
  });

  it("should call mockedUseUpdateWord with specified word & redirect to main page on save button click", async () => {
    const { saveButton, word } = setup();

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockRouter.asPath).toEqual("/");
      expect(mockedUseUpdateWord).toHaveBeenCalledWith(word);
    });
  });

  it("should call mockedUseDeleteWord with specified word.id & redirect to main page on delete button click", async () => {
    const { deleteButton, word } = setup();

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockRouter.asPath).toEqual("/");
      expect(mockedUseDeleteWord).toHaveBeenCalledWith(word.id);
    });
  });

  it("should redirect to main page on cancel button click", () => {
    const { goBackButton } = setup();

    fireEvent.click(goBackButton);
    expect(mockRouter.asPath).toEqual("/");
  });
});
