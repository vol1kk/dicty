import { createWord } from "../../../utils";
import { readFileAsync } from "~/features/import-export-words";
import { describe, expect, it } from "vitest";

type ReadFileAsyncTestProps = {
  type: string;
};

function setup(props?: ReadFileAsyncTestProps) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const data = [createWord({ createdAt: new Date().toISOString() })];
  const dataFile = new File([JSON.stringify(data)], "words.json", {
    type: props?.type || "application/json",
  });

  return { data, dataFile };
}

describe("readFileAsync tests", function () {
  it("should match the original data", async () => {
    const { data, dataFile } = setup();
    const parsedData = await readFileAsync(dataFile);

    expect(parsedData).toEqual(data);
  });

  it("should reject if file type isn't application/json", async () => {
    const { dataFile } = setup({ type: "image/jpeg" });

    const rejected = readFileAsync(dataFile);
    await expect(rejected).rejects.toThrowError(
      new Error("File should be of .json format!"),
    );
  });
});
