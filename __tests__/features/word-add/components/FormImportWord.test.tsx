import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import * as useSessionModule from "~/store/useSessionData";
import FormImportWord, {
  type FormCodeShareProps,
} from "~/features/word-add/components/FormImportWord";
import { nanoid } from "nanoid";

function setup(props?: Partial<FormCodeShareProps>) {
  const data = render(
    <FormImportWord
      ref={props?.ref || createRef<HTMLInputElement>()}
      closeHandler={props?.closeHandler || vi.fn()}
    />,
  );

  const formImport = screen.getByTestId("form-import-from-code");
  const inputImport = screen.getByTestId("input-import-from-code");
  const buttonImport = screen.getByTestId("button-import-from-code");

  return { data, formImport, buttonImport, inputImport };
}

const mockedUseImportFromCode = vi.fn();
vi.mock("~/features/word-add/hooks/useImportFromCode", () => ({
  default: vi.fn(() => mockedUseImportFromCode),
}));

describe("FormImport Tests", function () {
  it("should render FormImport", () => {
    const { formImport } = setup();

    expect(formImport).toBeInTheDocument();
  });

  it("should call mockedUseImportFromCode with specified code on import button click", async () => {
    vi.spyOn(useSessionModule, "default").mockReturnValue(true);

    const { inputImport, buttonImport } = setup();

    const code = nanoid();
    fireEvent.change(inputImport, { target: { value: code } });

    fireEvent.click(buttonImport);

    await waitFor(() => {
      expect(mockedUseImportFromCode).toHaveBeenCalledWith({ code });
    });
  });

  it("should not call mockedUseImportFromCode on import button click", async () => {
    vi.spyOn(useSessionModule, "default").mockReturnValue(false);

    const { buttonImport } = setup();

    fireEvent.click(buttonImport);

    await waitFor(() => {
      expect(mockedUseImportFromCode).not.toHaveBeenCalled();
    });
  });
});
