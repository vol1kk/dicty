import { type Category, type Meaning, type Word } from "~/types/ApiTypes";

export const meaningTemplate: Meaning = {
  id: "",
  definition: "",
  categoryId: "",
  example: "",
};

export const categoryTemplate: Category = {
  id: "",
  name: "",
  wordId: "",
  meanings: [meaningTemplate],
};

export const formTemplate: Word = {
  id: "",
  createdById: "",
  name: "",
  language: null,
  createdAt: null,
  shareCode: null,
  transcription: "",
  categories: [categoryTemplate],
  synonyms: [],
};
