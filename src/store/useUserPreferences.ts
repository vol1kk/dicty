import { create } from "zustand";
import { type Word } from "~/types/ApiTypes";

type useUserPreferences = {
  font: string;
  theme: string;
  words: Word[];
  setFont: (name: string) => void;
  setTheme: (theme: string) => void;
  setWords: (words: Word[]) => void;
};

const useUserPreferences = create<useUserPreferences>()(set => ({
  font: "Sans-Serif",
  theme: "light",
  words: [],
  setFont: name => set(() => ({ font: name })),
  setTheme: theme => set(() => ({ theme: theme })),
  setWords: words => set(() => ({ words })),
}));

export default useUserPreferences;
