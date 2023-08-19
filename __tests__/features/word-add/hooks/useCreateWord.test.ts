import { describe, it, vi, expect } from "vitest";
import { type UseLocalDataProps } from "~/store/useLocalData";
import { type Word } from "~/types/ApiTypes";
import * as useSessionDataModule from "~/store/useSessionData";
import { createWord as createWordUtil } from "../../../utils";
import { useCreateWord } from "~/features/word-add";
import { renderHook } from "@testing-library/react";
import modifyWordId from "~/utils/modifyWordId";

function setup() {
  const data = renderHook(() =>
    useCreateWord({
      onError: vi.fn(),
      onSuccess: vi.fn(),
    }),
  );

  return {
    createWord: data.result.current,
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

const mockedUseCreateWordMutation = vi.fn();
vi.mock("~/utils/api", () => ({
  api: {
    useContext: vi.fn(),
    words: {
      createWord: {
        useMutation: vi.fn(() => ({ mutate: mockedUseCreateWordMutation })),
      },
    },
  },
}));

describe("useImportWords tests", function () {
  it("should call mockedUseCreateWordMutation (api), when calling createWord with isAuthed=true", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { createWord } = setup();

    const word = modifyWordId(createWordUtil(), { appendWithEmptyId: true });
    createWord(word);

    expect(mockedUseCreateWordMutation).toHaveBeenCalledWith(word);
  });

  it("should call mockedSetWords, when calling importWords with isAuthed=false", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(false);

    const { createWord } = setup();

    const word = createWordUtil();
    createWord(word);

    expect(mockedSetWords).toHaveBeenCalled();
  });
});
