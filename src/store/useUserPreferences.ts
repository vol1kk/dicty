import { create } from "zustand";

type useUserPreferences = {
  font: string;
  darkTheme: boolean;
  setFont: (name: string) => void;
  setDarkTheme: () => void;
};

const useUserPreferences = create<useUserPreferences>()(set => ({
  font: "sans-serif",
  darkTheme: false,
  setFont: name => set(() => ({ font: name.toLowerCase() })),
  setDarkTheme: () => set(state => ({ darkTheme: !state.darkTheme })),
}));

export default useUserPreferences;
