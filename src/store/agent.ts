"use client";
import { create } from "zustand";

interface AgentState {
  isOpen: boolean;
  pendingProduct: string | null;
  setOpen: (open: boolean) => void;
  setPendingProduct: (name: string | null) => void;
  openWithProduct: (productName: string) => void;
}

export const useAgent = create<AgentState>((set) => ({
  isOpen: false,
  pendingProduct: null,
  setOpen: (isOpen) => set({ isOpen }),
  setPendingProduct: (pendingProduct) => set({ pendingProduct }),
  openWithProduct: (productName: string) => set({ isOpen: true, pendingProduct: productName }),
}));
