import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  color?: 'success' | 'warning' | 'danger' | 'primary';
}

interface UiState {
  isLoading: boolean;
  toasts: Toast[];

  setLoading: (loading: boolean) => void;
  showToast: (message: string, color?: Toast['color']) => void;
  dismissToast: (id: string) => void;
}

let _toastCounter = 0;

export const useUiStore = create<UiState>((set) => ({
  isLoading: false,
  toasts: [],

  setLoading: (isLoading) => set({ isLoading }),

  showToast: (message, color = 'primary') =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: String(++_toastCounter), message, color },
      ],
    })),

  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
