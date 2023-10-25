import mockRouter from "next-router-mock";
import { it, describe, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import useSetQueryParams from "~/hooks/useSetQueryParams";

async function setup() {
  await mockRouter.push("/", { query: { vi: "test" } });

  const searchParams = new URLSearchParams(mockRouter.asPath.slice(2));

  const setQueryParams = renderHook(() => useSetQueryParams(), {
    wrapper: MemoryRouterProvider,
  });

  return { searchParams, setQueryParams: setQueryParams.result.current };
}

describe("setQueryParams tests", function () {
  it("should update param", async () => {
    const { searchParams, setQueryParams } = await setup();

    const viParam = searchParams.get("vi");
    expect(viParam).toEqual("test");

    setQueryParams("vi", "works");
    expect(mockRouter.query.vi).toEqual("works");
  });

  it("shouldn't change param", async () => {
    const { searchParams, setQueryParams } = await setup();

    const viParam = searchParams.get("vi");
    expect(viParam).toEqual("test");

    setQueryParams("vi", "test");
    expect(mockRouter.asPath).toEqual("/?vi=test");
  });

  it("should delete param", async () => {
    const { searchParams, setQueryParams } = await setup();

    const viParam = searchParams.get("vi");
    expect(viParam).toEqual("test");

    setQueryParams("vi", null);
    expect(mockRouter.query.vi).toEqual(undefined);
  });

  it("should add another param", async () => {
    const { searchParams, setQueryParams } = await setup();

    expect([...searchParams.entries()]).toHaveLength(1);

    setQueryParams("test", "vi");
    expect(mockRouter.query.vi).toEqual("test");
    expect(mockRouter.query.test).toEqual("vi");
    expect(Object.entries(mockRouter.query)).toHaveLength(2);
  });
});
