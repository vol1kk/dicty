import { describe, it, vi, expect } from "vitest";
import { renderHook } from "@testing-library/react";

import { useCreateWord } from "~/features/word-add";
import * as useSessionDataModule from "~/store/useSessionData";

import { createWord as createWordUtil } from "#tests/utils";
import { mockedSetWords, mockedUseCreateWordMutation } from "#tests/setup";

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

describe("useCreateWord tests", function () {
  it("should call mockedUseCreateWordMutation (api), when calling createWord with isAuthed=true", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { createWord } = setup();

    const word = createWordUtil();
    createWord(word);

    expect(mockedUseCreateWordMutation).toHaveBeenCalled();
  });

  it("should call mockedSetWords, when calling importWords with isAuthed=false", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(false);

    const { createWord } = setup();

    const word = createWordUtil();
    createWord(word);

    expect(mockedSetWords).toHaveBeenCalled();
  });
});
