"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Fly = { id: number; x: number; y: number };

export function FlyingStars() {
  const [flies, setFlies] = useState<Fly[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number }>).detail;
      if (!detail) return;
      const id = Date.now() + Math.random();
      setFlies((f) => [...f, { id, x: detail.x, y: detail.y }]);
      setTimeout(() => setFlies((f) => f.filter((x) => x.id !== id)), 900);
    };
    window.addEventListener("star-fly" as any, handler);
    return () => window.removeEventListener("star-fly" as any, handler);
  }, []);

  const getCartPos = () => {
    const el = document.querySelector('button[aria-label^="Carrito con"]') as HTMLElement | null;
    if (el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return { x: window.innerWidth - 40, y: 32 };
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {flies.map((f) => {
          const target = getCartPos();
          return (
            <motion.div
              key={f.id}
              initial={{ x: f.x - 12, y: f.y - 12, scale: 0.6, opacity: 1, rotate: 0 }}
              animate={{ x: target.x - 12, y: target.y - 12, scale: 0.35, opacity: 0.9, rotate: 360 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              className="absolute"
            >
              <img src="/star2.svg" alt="" className="h-6 w-6 object-contain drop-shadow-[0_0_6px_rgba(253,216,23,0.9)]" />
              <motion.span
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 1.6 }}
                transition={{ duration: 0.85 }}
                className="absolute inset-0 rounded-full bg-[#FFD814]/30 blur-[2px]"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
