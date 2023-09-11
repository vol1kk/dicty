import { describe, expect, vi, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { createWord } from "#tests/utils";
import FormAddWord from "~/features/word-add";
import * as useSessionModule from "~/store/useSessionData";
import * as formUtilsModule from "~/features/shared/ui/Form/utils/formUtils";

function setup() {
  const data = render(<FormAddWord />);

  const formOpenButton = screen.getByTestId("form-open");
  const formCreateWord = screen.getByTestId("word-form");
  const formContainer = screen.getByTestId("form-container");
  const formCloseButton = screen.getByTestId("button-form-close");
  const buttonCreateWord = screen.getByTestId("button-word-create");
  const formImportWord = screen.queryByTestId("form-import-from-code");

  return {
    data,
    formContainer,
    formOpenButton,
    formImportWord,
    formCreateWord,
    formCloseButton,
    buttonCreateWord,
  };
}

const mockedUseCreateWord = vi.fn();
vi.mock("~/features/word-add/hooks/useCreateWord", () => ({
  default: vi.fn(() => mockedUseCreateWord),
}));

vi.mock("~/features/word-add/hooks/useImportFromCode", () => ({
  default: vi.fn(() => vi.fn()),
}));

describe("FormWordAdd Tests", function () {
  it("should render FormWordAdd", () => {
    const { formContainer } = setup();

    expect(formContainer).toBeInTheDocument();
  });

  it("should render FormImportWord", () => {
    vi.spyOn(useSessionModule, "default").mockReturnValue(true);

    const { formImportWord } = setup();

    expect(formImportWord).toBeInTheDocument();
  });

  it("should not render FormImportWord", () => {
    vi.spyOn(useSessionModule, "default").mockReturnValue(false);

    const { formImportWord } = setup();

    expect(formImportWord).not.toBeInTheDocument();
  });

  it("should set aria-expanded to true on open button click", async () => {
    const { formOpenButton } = setup();

    fireEvent.click(formOpenButton);
    await waitFor(() => {
      expect(formOpenButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("should set aria-expanded to false on close button click", async () => {
    const { formOpenButton, formCloseButton } = setup();

    fireEvent.click(formCloseButton);
    await waitFor(() => {
      expect(formOpenButton).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("should call mockedUseCreateWord on create button click", async () => {
    const word = createWord({ language: "" });
    vi.spyOn(formUtilsModule, "formTemplate", "get").mockReturnValue(word);

    const { buttonCreateWord } = setup();

    fireEvent.click(buttonCreateWord);
    await waitFor(() => {
      expect(mockedUseCreateWord).toHaveBeenCalledWith(word);
    });
  });

  it("should not call mockedUseCreateWord", async () => {
    const { buttonCreateWord } = setup();

    fireEvent.click(buttonCreateWord);
    await waitFor(() => {
      expect(mockedUseCreateWord).not.toHaveBeenCalled();
    });
  });
});
