import { create } from "zustand";

import { type Word } from "~/types/ApiTypes";
import { parseQuality, type QualityValues, SuperMemo } from "~/features/quiz";

type UseRevisedWordsProps = {
  revisedWords: RevisedWord[];
  setRevisedWords: (words: RevisedWord[]) => void;
};

const useRevisedWords = create<UseRevisedWordsProps>()(set => ({
  revisedWords: [],
  setRevisedWords: words => set({ revisedWords: words }),
}));

export type RevisedWord = Pick<
  Word,
  "id" | "name" | "easinessFactor" | "repetitions" | "interval"
> & { quality: QualityValues };

export function setRevisedWords(word: Word, quality: QualityValues) {
  const localStorageKey = "revisedWords";

  const revisingData = SuperMemo.getUpdatedValues(
    word.easinessFactor,
    word.repetitions,
    parseQuality(quality),
  );

  const transformedWord: RevisedWord = {
    id: word.id,
    name: word.name,
    quality,
    ...revisingData,
  };

  const localData = localStorage.getItem(localStorageKey);
  const currentDate = new Date().toLocaleDateString("en-us");

  let newData: RevisedWord[];
  if (localData) {
    const parsedWords = JSON.parse(localData) as Record<string, RevisedWord[]>;
    const existingWords = parsedWords[currentDate];

    newData = existingWords
      ? [transformedWord, ...existingWords]
      : [transformedWord];
  } else newData = [transformedWord];

  // Removing duplicates, if there are any
  const existingIds = newData.map(w => w.id);
  newData = newData.filter((w, i) => !existingIds.includes(w.id, i + 1));

  localStorage.setItem(
    localStorageKey,
    JSON.stringify({ [currentDate]: newData }),
  );
  useRevisedWords.getState().setRevisedWords(newData);
}

export default useRevisedWords;
