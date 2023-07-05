import { create } from "zustand";

type useUserPreferences = {
  font: string;
  theme: string;
  setFont: (name: string) => void;
  setTheme: (theme: string) => void;
};

const useUserPreferences = create<useUserPreferences>()(set => ({
  font: "sans-serif",
  theme: "light",
  setFont: name => set(() => ({ font: name.toLowerCase() })),
  setTheme: theme => set(() => ({ theme: theme })),
}));

export default useUserPreferences;
