import { type Word } from "~/types/ApiTypes";
import { type SortByDateType } from "~/features/sort-words";

const sortAscending = (a: Word, b: Word) =>
  a.createdAt && b.createdAt
    ? a.createdAt.getTime() - b.createdAt.getTime()
    : 0;
const sortDescending = (a: Word, b: Word) =>
  a.createdAt && b.createdAt
    ? b.createdAt.getTime() - a.createdAt.getTime()
    : 0;

export default function sortByDate(words: Word[], order: SortByDateType) {
  return words.sort(order === "newest" ? sortDescending : sortAscending);
}
