"use client";
import { useState } from "react";
import { products } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

type Tab = "destacados" | "nuevos" | "populares";

export function ProductGrid() {
  const [tab, setTab] = useState<Tab>("destacados");

  const filtered = (() => {
    if (tab === "nuevos") return products.filter((p) => p.isNew || p.id === "p005" || p.id === "p013").slice(0, 8);
    if (tab === "populares") return products.filter((p) => p.isBestSeller).slice(0, 8);
    return products.filter((p) => p.isFeatured).slice(0, 15);
  })();

  const tabs: { id: Tab; label: string }[] = [
    { id: "destacados", label: "Destacados" },
    { id: "nuevos", label: "Nuevos" },
    { id: "populares", label: "Más Populares" },
  ];

  return (
    <section id="mas-vendidos" className="container mt-6 max-w-full overflow-hidden">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border p-2 sm:p-3 md:p-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg md:text-xl font-black">Productos Destacados</h2>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${tab === t.id ? "bg-white dark:bg-zinc-700 shadow text-[#FF3B30]" : "text-zinc-600 dark:text-zinc-400 hover:text-black"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Stagger key={tab} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="text-center mt-6">
          <Button variant="outline" className="rounded-full px-8">Ver más productos</Button>
        </div>
      </div>
    </section>
  );
}
