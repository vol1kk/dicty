import { describe, it, vi, expect } from "vitest";
import { useImportWords } from "~/features/import-export-words";
import { renderHook } from "@testing-library/react";
import * as useSessionDataModule from "~/store/useSessionData";
import { createWord } from "#tests/utils";
import {
  mockedSetWords,
  mockedUseImportMutation,
  mockedUseUndoMutation,
} from "#tests/setup";

function setup() {
  const data = renderHook(() =>
    useImportWords({
      onError: vi.fn(),
      onSuccess: vi.fn(),
    }),
  );

  return {
    importWords: data.result.current.importWords,
    undoImport: data.result.current.undoImport,
  };
}

describe("useImportWords tests", function () {
  it("should call mockedUseImportMutation (api), when calling importWords with isAuthed=true", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { importWords } = setup();

    const words = [createWord(undefined, true)];
    importWords(words);

    expect(mockedUseImportMutation).toHaveBeenCalled();
  });

  it("should call mockedSetWords, when calling importWords with isAuthed=false", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(false);

    const { importWords } = setup();

    const words = [createWord(undefined, true)];
    importWords(words);

    expect(mockedSetWords).toHaveBeenCalled();
  });

  it("should call mockedUseUndoMutation (api), when calling undoImportWords with isAuthed=true", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { undoImport } = setup();

    const words = [createWord(undefined, true)];
    undoImport(words);

    expect(mockedUseUndoMutation).toHaveBeenCalledWith(words);
  });

  it("should call mockedSetWords, when calling undoImportWords with isAuthed=false", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(false);

    const { undoImport } = setup();

    const words = [createWord()];
    undoImport(words);

    expect(mockedSetWords).toHaveBeenCalled();
  });
});
