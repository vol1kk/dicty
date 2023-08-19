import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import useWords from "~/hooks/useWords";
import { type Word } from "~/types/ApiTypes";
import * as useSessionModule from "~/store/useSessionData";
import { type UseLocalDataProps } from "~/store/useLocalData";

const mockedLocalWords: Word[] = [];
const mockedSetWords = vi.fn();
vi.mock("~/store/useLocalData", () => ({
  default: function <T extends keyof UseLocalDataProps>(
    selector: (state: UseLocalDataProps) => T,
  ) {
    const state = {
      words: mockedLocalWords,
      theme: "dark",
      font: "Sans-Serif",
      setFont: vi.fn(),
      setTheme: vi.fn(),
      setWords: mockedSetWords,
    };

    return selector(state);
  },
}));

const mockedAuthedWords: Word[] = [];
vi.mock("~/utils/api", () => ({
  api: {
    words: {
      getAll: {
        useQuery: vi.fn(() => ({ isLoading: true, data: mockedAuthedWords })),
      },
    },
  },
}));

function setup() {
  const data = renderHook(() => useWords());

  return { words: data.result.current };
}

describe("useWords tests", function () {
  it("should return isLoading=false, data=mockedWords", () => {
    vi.spyOn(useSessionModule, "default").mockImplementation(selector => {
      const state = {
        session: null,
        isAuthed: false,
        setSession: vi.fn(),
        status: "unauthenticated" as const,
      };

      return selector(state);
    });

    const { words } = setup();

    expect(words.data).toEqual(mockedLocalWords);
    expect(words.isLoading).toEqual(false);
  });

  it("should return isLoading=true, data=mockedWords", () => {
    vi.spyOn(useSessionModule, "default").mockImplementation(selector => {
      const state = {
        session: null,
        isAuthed: false,
        setSession: vi.fn(),
        status: "loading" as const,
      };

      return selector(state);
    });

    const { words } = setup();

    expect(words.data).toEqual(mockedAuthedWords);
    expect(words.isLoading).toEqual(true);
  });
});
