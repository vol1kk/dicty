import { nanoid } from "nanoid";
import { create } from "zustand";

import { type IToast } from "~/features/toast";
import { DefaultOptions } from "~/features/toast/constants";

type PredefinedToasts = {
  success: (toast: Partial<IToast>) => void;
  warning: (toast: Partial<IToast>) => void;
  error: (toast: Partial<IToast>) => void;
};

type UseToastsStoreProps = {
  toasts: IToast[];

  toast: PredefinedToasts;

  addToast: (toast: IToast, prepend?: boolean) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<IToast>) => void;
};

const useToasts = create<UseToastsStoreProps>()((set, get) => ({
  toasts: [],

  toast: {
    success: overrides => {
      get().addToast({ ...DefaultOptions, id: nanoid(), ...overrides });
    },

    warning: overrides => {
      get().addToast({
        ...DefaultOptions,
        id: nanoid(),
        type: "warning",
        autoClose: 10000,
        ...overrides,
      });
    },

    error: overrides => {
      get().addToast({
        ...DefaultOptions,
        id: nanoid(),
        type: "error",
        autoClose: false,
        ...overrides,
      });
    },
  },

  addToast: (toast, prepend = true) =>
    set(state => {
      if (prepend) return { toasts: [toast, ...state.toasts] };

      return { toasts: [...state.toasts, toast] };
    }),

  removeToast: id =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  updateToast: (id, overrides) =>
    set(state => ({
      toasts: state.toasts.map(t => (t.id === id ? { ...t, ...overrides } : t)),
    })),
}));

export default useToasts;
