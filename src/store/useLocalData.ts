import { create } from "zustand";
import { type Word } from "~/types/ApiTypes";

type useLocalData = {
  font: string;
  theme: string;
  words: Word[];
  setFont: (name: string) => void;
  setTheme: (theme: string) => void;
  setWords: (words: Word[]) => void;
};

const useLocalData = create<useLocalData>()(set => ({
  words: [],
  theme: "light",
  font: "Sans-Serif",
  setFont: name => set(() => ({ font: name })),
  setTheme: theme => set(() => ({ theme: theme })),
  setWords: words => set(() => ({ words })),
}));

export default useLocalData;
