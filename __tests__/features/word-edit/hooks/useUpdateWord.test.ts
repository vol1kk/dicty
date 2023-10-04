import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { createWord } from "#tests/utils";
import { useUpdateWord } from "~/features/word-edit";
import * as useSessionDataModule from "~/store/useSessionData";
import { mockedSetWords, mockedUseUpdateWordMutation } from "#tests/setup";

function setup() {
  const word = createWord();
  const data = renderHook(() => useUpdateWord());

  return { updateWord: data.result.current, word };
}

describe("useUpdateWord tests", function () {
  it("should call updateWord", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { updateWord, word } = setup();
    updateWord(word);

    expect(mockedUseUpdateWordMutation).toHaveBeenCalled();
  });

  it("should locally update words", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(false);

    const { updateWord, word } = setup();
    updateWord(word);

    expect(mockedSetWords).toHaveBeenCalled();
  });
});
