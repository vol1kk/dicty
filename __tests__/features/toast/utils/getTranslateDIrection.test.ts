import { describe, expect, it } from "vitest";

import { getTranslateDirection, type ToastPosition } from "~/features/toast";

function setup(position: ToastPosition) {
  const result = getTranslateDirection(position);

  const expectedNegative = "-translate-x-[120%]";
  const expectedPositive = "translate-x-[120%]";

  return { result, expectedNegative, expectedPositive };
}

describe("getTranslateDirection tests", function () {
  it("should return negative translate if called with 'bottom-left'", () => {
    const { result, expectedNegative } = setup("bottom-left");

    expect(result).toEqual(expectedNegative);
  });

  it("should return negative translate if called with 'top-left'", () => {
    const { result, expectedNegative } = setup("top-left");

    expect(result).toEqual(expectedNegative);
  });

  it("should return positive translate if called with 'top-right'", () => {
    const { result, expectedPositive } = setup("top-right");

    expect(result).toEqual(expectedPositive);
  });

  it("should return positive translate if called with 'top-left'", () => {
    const { result, expectedPositive } = setup("bottom-right");

    expect(result).toEqual(expectedPositive);
  });
});
