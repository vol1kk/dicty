import { type Word } from "~/types/ApiTypes";

export default function parseLocalWord(word: Word) {
  const createdAt = word.createdAt as unknown;

  if (typeof createdAt === "string")
    return { ...word, createdAt: new Date(createdAt) };

  return word;
}
