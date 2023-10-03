import { expect, afterEach, vi } from "vitest";
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { type UseLocalDataProps } from "~/store/useLocalData";
import { type Word } from "~/types/ApiTypes";
import { createWord } from "./utils";

afterEach(function () {
  cleanup();
  vi.restoreAllMocks();
});

export const mockedLocalWords: Word[] = [createWord({ name: "Local Word" })];
export const mockedSetWords = vi.fn();
export const mockedSetFont = vi.fn();
vi.mock("~/store/useLocalData", () => ({
  default: function <T extends keyof UseLocalDataProps>(
    selector: (state: UseLocalDataProps) => T,
  ) {
    const state = {
      theme: "dark",
      font: "Sans-Serif",
      words: mockedLocalWords,
      setTheme: vi.fn(),
      setFont: mockedSetFont,
      setWords: mockedSetWords,
    };

    return selector(state);
  },
}));

export const mockedUseImportMutation = vi.fn();
export const mockedUseUndoMutation = vi.fn();
export const mockedUseCreateWordMutation = vi.fn();
export const mockedAuthedWords: Word[] = [createWord({ name: "Authed Word" })];
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
      createWord: {
        useMutation: vi.fn(() => ({ mutate: mockedUseCreateWordMutation })),
      },
      getAll: {
        useQuery: vi.fn(() => ({ isLoading: false, data: mockedAuthedWords })),
      },
    },
  },
}));

vi.mock("next-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

export const mockedUseToggleShareCode = vi.fn();
vi.mock("~/features/word-edit/hooks/useToggleShareCode", () => ({
  default: vi.fn(() => ({ toggleShareCodeMutation: mockedUseToggleShareCode })),
}));

export const mockedGetQueryKey = vi.fn();
vi.mock("@trpc/react-query", () => ({ getQueryKey: mockedGetQueryKey }));

expect.extend(matchers);
