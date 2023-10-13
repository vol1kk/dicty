import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useDeleteWord } from "~/features/word-edit";
import * as useSessionDataModule from "~/store/useSessionData";
import { mockedSetWords, mockedUseDeleteWordMutation } from "#tests/setup";

function setup() {
  const data = renderHook(() => useDeleteWord());

  return { deleteWord: data.result.current };
}

describe("useDeleteWord tests", function () {
  it("should call deleteWordMutation", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(true);

    const { deleteWord } = setup();
    deleteWord({ id: "word-1", dictionary: null });

    expect(mockedUseDeleteWordMutation).toHaveBeenCalled();
  });

  it("should locally remove word", () => {
    vi.spyOn(useSessionDataModule, "default").mockReturnValue(false);

    const { deleteWord } = setup();
    deleteWord({ id: "word-1", dictionary: null });

    expect(mockedSetWords).toHaveBeenCalled();
  });
});
