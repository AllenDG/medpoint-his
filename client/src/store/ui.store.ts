import { create } from "zustand";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface UIState {
  toasts: Toast[];
  sidebarOpen: boolean;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  sidebarOpen: true,
  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
