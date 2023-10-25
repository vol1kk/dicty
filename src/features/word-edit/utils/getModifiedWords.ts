import { type Word, WordSchema } from "~/types/ApiTypes";
import modifyWordId from "~/utils/modifyWordId";

export default function getModifiedWords(
  words: Word[],
  modifiedWord: Partial<Word>,
): Word[] {
  const existingWord = words.find(word => word.id === modifiedWord.id);

  // For creating words
  if (!existingWord && isNotPartial(modifiedWord)) {
    return [modifyWordId(modifiedWord), ...words];
  }

  // For updating words
  return words.map(word =>
    word.id === modifiedWord.id
      ? modifyWordId({ ...word, ...modifiedWord }, { appendWithId: true })
      : word,
  );
}

export function isNotPartial(word: Partial<Word>): word is Word {
  const parsedWord = WordSchema.safeParse(word);

  return parsedWord.success;
}
