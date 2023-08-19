import { describe, it, vi, expect } from "vitest";
import { useImportWords } from "~/features/import-export-words";
import { renderHook } from "@testing-library/react";
import { type UseLocalDataProps } from "~/store/useLocalData";
import { type Word } from "~/types/ApiTypes";
import * as useSessionDataModule from "~/store/useSessionData";
import { createWord } from "../../../utils";

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

const mockedWords: Word[] = [];
const mockedSetWords = vi.fn();
vi.mock("~/store/useLocalData", () => ({
  default: function <T extends keyof UseLocalDataProps>(
    selector: (state: UseLocalDataProps) => T,
  ) {
    const state = {
      words: mockedWords,
      theme: "dark",
      font: "Sans-Serif",
      setFont: vi.fn(),
      setTheme: vi.fn(),
      setWords: mockedSetWords,
    };

    return selector(state);
  },
}));

const mockedUseImportMutation = vi.fn();
const mockedUseUndoMutation = vi.fn();
vi.mock("~/utils/api", () => ({
  api: {
    useContext: vi.fn(),
    words: {
      importWords: {
        useMutation: vi.fn(() => ({ mutate: mockedUseImportMutation })),
      },
      undoImportWords: {
        useMutation: vi.fn(() => ({ mutate: mockedUseUndoMutation })),
      },
    },
  },
}));

describe("useImportWords tests", function () {
  it("should call mockedUseImportMutation (api), when calling importWords with isAuthed=true", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { importWords } = setup();

    const words = [createWord(undefined, true)];
    importWords(words);

    expect(mockedUseImportMutation).toHaveBeenCalledWith(words);
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
