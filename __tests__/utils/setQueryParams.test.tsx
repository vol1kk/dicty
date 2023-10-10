import mockRouter from "next-router-mock";
import { it, describe, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import setQueryParams from "~/features/sort-words/utils/setQueryParams";

async function setup() {
  const data = render(<main>Query Test</main>, {
    wrapper: MemoryRouterProvider,
  });

  await mockRouter.push("/", { query: { vi: "test" } });

  const searchParams = new URLSearchParams(mockRouter.asPath.slice(2));

  return { data, searchParams };
}

describe("setQueryParams tests", function () {
  it("should update param", async () => {
    const { searchParams } = await setup();

    const viParam = searchParams.get("vi");
    expect(viParam).toEqual("test");

    setQueryParams(mockRouter, "vi", "works");
    expect(mockRouter.query.vi).toEqual("works");
  });

  it("shouldn't change param", async () => {
    const { searchParams } = await setup();

    const viParam = searchParams.get("vi");
    expect(viParam).toEqual("test");

    setQueryParams(mockRouter, "vi", "test");
    expect(mockRouter.asPath).toEqual("/?vi=test");
  });

  it("should delete param", async () => {
    const { searchParams } = await setup();

    const viParam = searchParams.get("vi");
    expect(viParam).toEqual("test");

    setQueryParams(mockRouter, "vi", null);
    expect(mockRouter.query.vi).toEqual(undefined);
  });

  it("should add another param", async () => {
    const { searchParams } = await setup();

    expect([...searchParams.entries()]).toHaveLength(1);

    setQueryParams(mockRouter, "test", "vi");
    expect(mockRouter.query.vi).toEqual("test");
    expect(mockRouter.query.test).toEqual("vi");
    expect(Object.entries(mockRouter.query)).toHaveLength(2);
  });
});
