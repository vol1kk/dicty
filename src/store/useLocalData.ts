import { create } from "zustand";
import { type Word } from "~/types/ApiTypes";

export type UseLocalDataProps = {
  font: string;
  theme: string;
  words: Word[];
  setFont: (name: string) => void;
  setTheme: (theme: string) => void;
  setWords: (words: Word[]) => void;
};

const useLocalData = create<UseLocalDataProps>()(set => ({
  words: [],
  theme: "light",
  font: "Sans-Serif",
  setFont: name => set(() => ({ font: name })),
  setTheme: theme => set(() => ({ theme: theme })),
  setWords: words => set(() => ({ words })),
}));

export default useLocalData;
