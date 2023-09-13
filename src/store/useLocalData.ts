import { create } from "zustand";
import { type Word } from "~/types/ApiTypes";

export type UseLocalDataProps = {
  font: string;
  theme: string;
  words: Word[];
  setFont: (name: string) => void;
  setTheme: (theme: string) => void;
  setWords: (data: Word[] | ((word: Word[]) => Word[])) => void;
};

const useLocalData = create<UseLocalDataProps>()(set => ({
  words: [],
  theme: "light",
  font: "Sans-Serif",
  setFont: name => set(() => ({ font: name })),
  setTheme: theme => set(() => ({ theme: theme })),
  setWords: data =>
    set(state => {
      if (Array.isArray(data)) return { words: data };

      return { words: data(state.words) };
    }),
}));

export default useLocalData;
