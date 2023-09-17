import { type Word } from "~/types/ApiTypes";

export default function parseLocalWord(word: Word) {
  const createdAt = word.createdAt as unknown;
  const interval = word.interval as unknown;

  if (typeof createdAt === "string") word.createdAt = new Date(createdAt);

  if (typeof interval === "string") word.interval = new Date(interval);

  return word;
}
