import mockRouter from "next-router-mock";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { useSortingParams } from "~/features/sort-words";

describe("useSortingParams tests", function () {
  it("should have default values", () => {
    const {
      lang: [lang],
      date: [order],
      dictionary: [dict],
    } = renderHook(() => useSortingParams(), { wrapper: MemoryRouterProvider })
      .result.current;

    expect(lang).toEqual(null);
    expect(dict).toEqual(null);
    expect(order).toEqual("newest");
  });

  it("should have based that are in path", async () => {
    const { result, rerender } = renderHook(() => useSortingParams(), {
      wrapper: MemoryRouterProvider,
    });

    const {
      lang: [oldLang],
      date: [oldOrder],
      dictionary: [oldDict],
    } = result.current;

    expect(oldLang).toEqual(null);
    expect(oldDict).toEqual(null);
    expect(oldOrder).toEqual("newest");

    await mockRouter.push("/", {
      query: { dict: "japanese", lang: "en", order: "oldest" },
    });

    rerender();

    const {
      lang: [newLang],
      date: [newOrder],
      dictionary: [newDict],
    } = result.current;

    expect(newLang).toEqual("en");
    expect(newOrder).toEqual("oldest");
    expect(newDict).toEqual("japanese");
  });
});
