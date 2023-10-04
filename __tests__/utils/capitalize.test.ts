import { it, describe, expect } from "vitest";
import capitalize from "~/utils/capitalize";

describe("capitalize tests", function () {
  it("should make first letter capitalized and everything lowercase", () => {
    expect(capitalize("wOrD")).toEqual("Word");
  });

  it("shouldn't change the word", () => {
    const word = "Word";

    expect(capitalize(word)).toEqual(word);
  });
});
