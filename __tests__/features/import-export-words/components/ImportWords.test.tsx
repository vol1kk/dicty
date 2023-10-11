import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";

import { createWord } from "#tests/utils";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { ImportWords } from "~/features/import-export-words";
import useWords from "~/hooks/useWords";

function setup() {
  const hookData = renderHook(() => useWords(null));
  const data = render(<ImportWords words={hookData.result.current} />, {
    wrapper: MemoryRouterProvider,
  });

  const importContainer = screen.getByTestId("import-container");
  const inputImport = screen.getByTestId("input-import");

  return { data, importContainer, inputImport };
}
const mockImportWords = vi.fn();
vi.mock("~/features/import-export-words/hooks/useImportWords", () => ({
  default: vi.fn(() => ({
    importWords: mockImportWords,
    undoImport: vi.fn(),
  })),
}));

vi.mock("~/hooks/useWords", () => ({
  default: vi.fn(() => vi.fn()),
}));

const mockedErrorToast = vi.fn();
vi.mock("~/features/toast/store/useToasts", () => ({
  default: vi.fn(() => ({
    toast: { error: mockedErrorToast },
    removeToast: vi.fn(),
  })),
}));

describe("ImportWords Tests", function () {
  it("should render ImportWords", () => {
    const { importContainer } = setup();

    expect(importContainer).toBeInTheDocument();
  });

  it("should call mockImportWords with data user loaded", async () => {
    const { inputImport } = setup();

    const data = [createWord({ createdAt: new Date() })];
    const dataFile = new File([JSON.stringify(data)], "words.json", {
      type: "application/json",
    });
    fireEvent.change(inputImport, { target: { files: [dataFile] } });

    await waitFor(() => expect(mockImportWords).toHaveBeenCalledWith(data));
  });

  it("should call addToast with error msg if readFileAsync fails", async () => {
    const { inputImport } = setup();

    const dataFile = new File(["something"], "words.json", {
      type: "not/json",
    });
    fireEvent.change(inputImport, { target: { files: [dataFile] } });

    await waitFor(() => {
      expect(mockImportWords).not.toHaveBeenCalled();
      expect(mockedErrorToast).toHaveBeenCalledWith({
        type: "error",
        autoClose: false,
        text: "toast.import.error",
      });
    });
  });
});
