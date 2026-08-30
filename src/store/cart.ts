"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: s.items.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i)),
            };
          }
          return { items: [...s.items, { product, quantity: qty }] };
        }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.product.id !== id) : s.items.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)),
        })),
      clearCart: () => set({ items: [] }),
      setOpen: (open) => set({ isOpen: open }),
      total: () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: "starshop-cart" }
  )
);
