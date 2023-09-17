import { type Category, type Meaning, type Word } from "~/types/ApiTypes";

function createMeaning(meaningExtenders?: Partial<Meaning>, clearId = false) {
  return {
    id: clearId ? "" : "meaning-1",
    definition: "Test Definition",
    categoryId: clearId ? "" : "category-1",
    example: "Test Example",
    ...meaningExtenders,
  };
}

function createCategory(
  categoryExtenders?: Partial<Category>,
  clearId = false,
) {
  return {
    id: clearId ? "" : "category-1",
    name: "Test Category",
    wordId: clearId ? "" : "word-1",
    meanings: [createMeaning(undefined, clearId)],
    ...categoryExtenders,
  };
}

function createWord(wordExtenders?: Partial<Word>, clearId = false): Word {
  return {
    id: clearId ? "" : "word-1",
    name: "Test Word",
    transcription: "/test-transcription/",
    synonyms: [],
    language: null,
    easinessFactor: 2.5,
    repetitions: 0,
    interval: new Date(),
    createdAt: new Date(),
    shareCode: null,
    createdById: clearId ? "" : "user-1",
    categories: [createCategory(undefined, clearId)],
    ...wordExtenders,
  };
}

export { createMeaning, createCategory, createWord };
