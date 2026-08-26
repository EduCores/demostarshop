"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function SuggestedProducts({ products: suggested }: { products: Product[] }) {
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = suggested.length;

  useEffect(() => {
    if (paused || len <= 1) return;
    const id = setInterval(() => setStart((s) => (s + 1) % len), 3500);
    return () => clearInterval(id);
  }, [paused, len]);

  const visible = Array.from({ length: Math.min(4, len) }, (_, i) => suggested[(start + i) % len]);

  return (
    <section className="mt-8">
      <div className="container">
        <div
          className="bg-white dark:bg-zinc-900 rounded-lg border p-3 md:p-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-lg md:text-xl font-black">Productos Sugeridos</h2>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {suggested.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStart(i)}
                    aria-label={`Ir a grupo ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${((start + 0) % len) === i ? "w-6 bg-[#FF3B30]" : "w-2 bg-zinc-300 hover:bg-zinc-400"}`}
                  />
                ))}
              </div>
              <span className="hidden lg:inline text-[11px] text-zinc-400">{paused ? "Pausado" : "Auto"}</span>
            </div>
          </div>

          {/* Ventana deslizante: entra por la izquierda y se mueve hacia la derecha cada 3.5s */}
          <motion.div
            key={start}
            initial={{ x: -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
