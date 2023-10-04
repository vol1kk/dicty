import { describe, vi, it, expect } from "vitest";

import * as useSessionModule from "~/store/useSessionData";
import { type UseSessionDataProps } from "~/store/useSessionData";
import { renderHook } from "@testing-library/react";
import { useDictionaries } from "~/features/sort-words";
import { mockedAuthedDictionaries } from "#tests/setup";

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

  const dictionaries = renderHook(() => useDictionaries());

  return { dictionaries: dictionaries.result.current };
}

describe("useDictionaries tests", function () {
  it("should mockedAuthedDictionaries", () => {
    const { dictionaries } = setup({ isAuthed: true, status: "authenticated" });

    expect(dictionaries.data).toEqual(mockedAuthedDictionaries);
  });
});
