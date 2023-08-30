import { describe, it, expect } from "vitest";

import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";

function setup() {
  const initialWordWithIds: Word = {
    id: "6278bc1a-80a6-4de2-8f90-b932380a9729",
    name: "Test.Name",
    transcription: "Test.Transcription",
    synonyms: [],
    shareCode: null,
    createdAt: "2023-08-18T18:54:49.722Z",
    createdById: "0be0039f-a766-4e3a-a545-72e76d678885",
    categories: [
      {
        id: "db81374b-b373-4c9a-9e41-36e5911d7427",
        name: "Test.Category",
        wordId: "6278bc1a-80a6-4de2-8f90-b932380a9729",
        meanings: [
          {
            id: "a66815aa-98dc-46f7-b3c5-abb0c205768b",
            definition: "Test.Definition",
            categoryId: "db81374b-b373-4c9a-9e41-36e5911d7427",
            example: "Test.Example",
          },
        ],
      },
    ],
  };

  const initialWordWithoutIds: Word = {
    id: "",
    name: "Test.Name",
    transcription: "Test.Transcription",
    synonyms: [],
    shareCode: null,
    createdAt: "2023-08-18T18:54:49.722Z",
    createdById: "",
    categories: [
      {
        id: "",
        name: "Test.Category",
        wordId: "",
        meanings: [
          {
            id: "",
            definition: "Test.Definition",
            categoryId: "",
            example: "Test.Example",
          },
        ],
      },
    ],
  };

  return {
    initialWordWithIds,
    initialWordWithoutIds,
  };
}

describe("modifyWordId tests", function () {
  it("should not change anything", () => {
    const { initialWordWithIds } = setup();

    expect(modifyWordId(initialWordWithIds)).toEqual(initialWordWithIds);
  });

  it("should clear IDs", () => {
    const { initialWordWithIds, initialWordWithoutIds } = setup();

    expect(
      modifyWordId(initialWordWithIds, { appendWithEmptyId: true }),
    ).toEqual(initialWordWithoutIds);
  });

  it("should add IDs", () => {
    const { initialWordWithoutIds } = setup();

    const wordWithIds = modifyWordId(initialWordWithoutIds, {
      appendWithId: true,
    });

    expect(wordWithIds.id).toBeTruthy();
    expect(wordWithIds.createdById).toBeTruthy();

    expect(wordWithIds.categories[0]?.id).toBeTruthy();
    expect(wordWithIds.categories[0]?.wordId).toBeTruthy();

    expect(wordWithIds.categories[0]?.meanings[0]?.id).toBeTruthy();
    expect(wordWithIds.categories[0]?.meanings[0]?.categoryId).toBeTruthy();
  });
});
