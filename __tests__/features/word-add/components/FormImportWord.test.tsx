import { nanoid } from "nanoid";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import * as useSessionModule from "~/store/useSessionData";
import { type UseSessionDataProps } from "~/store/useSessionData";
import FormImportWord, {
  type FormCodeShareProps,
} from "~/features/word-add/components/FormImportWord";

function setup(props?: Partial<FormCodeShareProps & UseSessionDataProps>) {
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
    const { inputImport, buttonImport } = setup({ isAuthed: true });

    const code = nanoid();
    fireEvent.change(inputImport, { target: { value: code } });
    fireEvent.click(buttonImport);

    await waitFor(() => {
      expect(mockedUseImportFromCode).toHaveBeenCalledWith({ code });
    });
  });

  it("should not call mockedUseImportFromCode on import button click", async () => {
    const { buttonImport } = setup({ isAuthed: false });

    fireEvent.click(buttonImport);

    await waitFor(() => {
      expect(mockedUseImportFromCode).not.toHaveBeenCalled();
    });
  });
});
