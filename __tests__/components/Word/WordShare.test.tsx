import { expect, describe, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { mockedUseToggleShareCode } from "#tests/setup";
import WordShare, { type WordShareProps } from "~/components/Word/WordShare";

function setup(props?: Partial<WordShareProps>) {
  const wordId = props?.wordId || "word-1";

  const data = render(<WordShare code={props?.code || null} wordId={wordId} />);

  const wordShareComponent = screen.getByTestId("word-share");
  const buttonComponent = within(wordShareComponent).getByRole("button");

  const iconComponent = buttonComponent.querySelector("svg");
  const inputComponent = wordShareComponent.querySelector("input");

  return {
    data,
    wordId,
    wordShareComponent,
    iconComponent,
    buttonComponent,
    inputComponent,
  };
}

describe("WordShare Tests", function () {
  it("should render WordShare component", () => {
    const { wordShareComponent } = setup();

    expect(wordShareComponent).toBeInTheDocument();
  });

  it("should call toggleShareCodeMutation with correct wordId argument", () => {
    const { buttonComponent, wordId } = setup();

    fireEvent.click(buttonComponent);
    expect(mockedUseToggleShareCode).toHaveBeenCalledOnce();
    expect(mockedUseToggleShareCode).toHaveBeenCalledWith({ wordId });
  });

  it("should render svg responsible for code deletion & input with attributes that correspond to existing share-code", () => {
    const { iconComponent, inputComponent } = setup({ code: "code-exists" });

    expect(iconComponent).toHaveAttribute("aria-label", "form.code.delete");
    expect(inputComponent).toHaveAttribute("tabIndex", "0");
    expect(inputComponent).toHaveAttribute("value", "code-exists");
  });

  it("should render svg responsible for code generation & input with attributes that correspond to non-existing share-code", () => {
    const { iconComponent, inputComponent } = setup({ code: null });

    expect(iconComponent).toHaveAttribute("aria-label", "form.code.generate");
    expect(inputComponent).toHaveAttribute("tabIndex", "-1");
    expect(inputComponent).toHaveAttribute("value", "");
  });
});
