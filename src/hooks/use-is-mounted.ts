"use client";
import { useEffect, useState } from "react";

/**
 * Hook para evitar errores de hidratación al leer estado persistido
 * (localStorage / Zustand persist) en componentes SSR de Next.js.
 * Devuelve `false` durante el primer render (servidor y cliente) y
 * `true` recién después del montaje en el cliente.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
