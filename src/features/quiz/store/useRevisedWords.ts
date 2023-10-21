import { create } from "zustand";

import { type Word } from "~/types/ApiTypes";
import { type QualityValues } from "~/features/quiz";

type UseRevisedWordsProps = {
  revisedWords: Record<string, RevisedWord[]>;
  setRevisedWords: (words: Record<string, RevisedWord[]>) => void;
};

const useRevisedWords = create<UseRevisedWordsProps>()(set => ({
  revisedWords: {},
  setRevisedWords: words => set({ revisedWords: words }),
}));

export type RevisedWord = Pick<
  Word,
  "id" | "name" | "repetitions" | "easinessFactor"
> & {
  interval: Date | undefined;
  quality: QualityValues;
};

export function setRevisedWords(
  word: Word | RevisedWord,
  quality: QualityValues,
  dateString?: string,
) {
  const localStorageKey = "revisedWords";
  const today = dateString || new Date().toLocaleDateString("en-us");

  const revisedWord: RevisedWord = {
    id: word.id,
    name: word.name,
    interval: word.interval,
    repetitions: word.repetitions,
    easinessFactor: word.easinessFactor,
    quality,
  };

  const localData = localStorage.getItem(localStorageKey);
  const parsedWords = localData
    ? (JSON.parse(localData) as Record<string, RevisedWord[]>)
    : null;

  let data: RevisedWord[] = [];
  if (parsedWords) {
    const todayWords = parsedWords[today];

    if (!todayWords) data = [revisedWord];

    // Prepend array with new word
    const existingWord = todayWords?.find(w => w.id === revisedWord.id);
    if (todayWords && !existingWord) data = [revisedWord, ...todayWords];

    // Handling if it's duplicate
    if (todayWords && existingWord)
      data = todayWords.map(w => (w.id === revisedWord.id ? revisedWord : w));
  } else data = [revisedWord];

  const state = parsedWords
    ? { ...parsedWords, [today]: data }
    : { [today]: data };

  localStorage.setItem(localStorageKey, JSON.stringify(state));
  useRevisedWords.getState().setRevisedWords(state);
}

export default useRevisedWords;
