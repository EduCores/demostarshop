"use client";
import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (t: { title: string; description?: string; variant?: ToastVariant; duration?: number }) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (t) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      title: t.title,
      description: t.description,
      variant: t.variant ?? "default",
      duration: t.duration ?? 3500,
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
    }, toast.duration);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Helper global para disparar toasts fuera del árbol de React. */
export function toast(title: string, opts?: Partial<Omit<Toast, "id" | "title">>) {
  useToastStore.getState().addToast({ title, ...opts });
}
