import type { Variants } from "framer-motion";

// --- Easing suave tipo "spring-out" ---
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Aparece desde abajo con fade
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

// Solo fade
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

// Aparece con un "pop" de escala (spring)
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

// Contenedor que escalona a sus hijos
export const staggerContainer = (stagger = 0.06, delayChildren = 0.04): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

// Desliza desde un lado (para slides de hero)
export const slideIn: Variants = {
  hidden: { opacity: 0, x: 48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } },
  exit: { opacity: 0, x: -48, transition: { duration: 0.35, ease: EASE_OUT } },
};
