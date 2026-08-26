"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer } from "@/lib/motion";

function Plain({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/** Hook para evitar mismatch de hidratación: solo true tras montar en cliente. */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Fade-up al montar (solo cliente). Evita mismatch de hidratación renderizando
 * el children directo en SSR y activando la animación solo tras montar.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const mounted = useMounted();
  const reduce = useReducedMotion();

  if (!mounted || reduce) return <Plain className={className}>{children}</Plain>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Contenedor que revela a sus hijos <StaggerItem> de forma escalonada al montar. */
export function Stagger({
  children,
  className,
  stagger = 0.06,
  delayChildren = 0.04,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  const mounted = useMounted();
  const reduce = useReducedMotion();

  if (!mounted || reduce) return <Plain className={className}>{children}</Plain>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

/** Ítem hijo de <Stagger>. Usar en lugar de un div simple. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mounted = useMounted();
  const reduce = useReducedMotion();

  if (!mounted || reduce) return <Plain className={className}>{children}</Plain>;

  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
