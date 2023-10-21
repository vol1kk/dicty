import { type Word } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";

export default function getModifiedWords(
  words: Word[],
  modifiedWord: Partial<Word>,
): Word[] {
  return words.map(word =>
    word.id === modifiedWord.id
      ? modifyWordId({ ...word, ...modifiedWord }, { appendWithId: true })
      : word,
  );
}
