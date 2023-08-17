import { type Category, type Meaning, type Word } from "~/types/ApiTypes";

function createMeaning(meaningExtenders?: Partial<Meaning>) {
  return {
    id: "meaning-1",
    definition: "Test Definition",
    example: "Test Example",
    ...meaningExtenders,
  };
}

function createCategory(categoryExtenders?: Partial<Category>) {
  return {
    id: "category-1",
    name: "Test Category",
    wordId: "word-1",
    meanings: [createMeaning()],
    ...categoryExtenders,
  };
}

function createWord(wordExtenders?: Partial<Word>) {
  return {
    id: "word-1",
    name: "Test Word",
    transcription: "/test-transcription/",
    createdAt: new Date(),
    shareCode: null,
    createdById: "user-1",
    categories: [createCategory()],
    ...wordExtenders,
  };
}

export { createMeaning, createCategory, createWord };
