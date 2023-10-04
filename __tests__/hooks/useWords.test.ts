import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import useWords from "~/hooks/useWords";
import * as useSessionModule from "~/store/useSessionData";
import { type UseSessionDataProps } from "~/store/useSessionData";
import { mockedAuthedWords, mockedLocalWords } from "#tests/setup";

function setup(props?: Partial<UseSessionDataProps>) {
  vi.spyOn(useSessionModule, "default").mockImplementation(selector => {
    const state = {
      session: props?.session || null,
      isAuthed: props?.isAuthed ?? false,
      setSession: props?.setSession || vi.fn(),
      status: props?.status || "unauthenticated",
    };

    return selector(state);
  });

  const data = renderHook(() => useWords(null));

  return { words: data.result.current };
}

describe("useWords tests", function () {
  it("should return mockedLocalWords if status=unauthenticated", () => {
    const { words } = setup({ isAuthed: false, status: "unauthenticated" });

    expect(words.data).toEqual(mockedLocalWords);
  });

  it("should return mockedAuthedWords if status=authenticated", () => {
    const { words } = setup({ isAuthed: true, status: "authenticated" });

    expect(words.data).toEqual(mockedAuthedWords);
  });
});
