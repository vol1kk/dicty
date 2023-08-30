import { create } from "zustand";
import { type IToast } from "~/features/toast";
import { nanoid } from "nanoid";

type UseToastsStoreProps = {
  toasts: IToast[];
  addToast: (toast: Partial<IToast>, prepend?: boolean) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, toast: Partial<IToast>) => void;
};

const DEFAULT_OPTIONS = {
  action: null,
  type: "success",
  autoClose: 5000,
  text: "Success!",
  isOpen: true,
  pauseOnBlur: true,
  pauseOnHover: true,
  position: "bottom-right",
} as const;

const useToasts = create<UseToastsStoreProps>()(set => ({
  toasts: [],
  addToast: (toast, prepend = true) =>
    set(state => {
      const toastWithDefaults = { ...DEFAULT_OPTIONS, id: nanoid(), ...toast };

      if (prepend) return { toasts: [toastWithDefaults, ...state.toasts] };

      return { toasts: [...state.toasts, toastWithDefaults] };
    }),

  removeToast: id =>
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  updateToast: (id, overrides) =>
    set(state => ({
      toasts: state.toasts.map(t => (t.id === id ? { ...t, ...overrides } : t)),
    })),
}));

export default useToasts;
