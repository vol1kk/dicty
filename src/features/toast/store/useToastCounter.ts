import { create } from "zustand";

type UseToastsCounterProps = {
  toastsCounter: Record<string, number>;
  getToastCounter: (id: string) => number;
  setToastCounter: (id: string) => void;
};

const useToastCounter = create<UseToastsCounterProps>()((set, get) => ({
  toastsCounter: {},

  getToastCounter(id) {
    return get().toastsCounter[id] || 0;
  },

  setToastCounter: id =>
    set(state => {
      const existingToast = state.toastsCounter[id];

      return {
        toastsCounter: {
          ...state.toastsCounter,
          [id]: existingToast === undefined ? 0 : existingToast + 1,
        },
      };
    }),
}));

export default useToastCounter;
