"use client";
import { useEffect, useState } from "react";

export type Countdown = {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

/**
 * Countdown seguro para SSR/Next.js.
 * Devuelve `null` durante el render inicial (servidor y primer render del
 * cliente) para no generar diferencias de hidratación por la hora del reloj.
 * El primer valor real se calcula recién en el cliente, dentro de `useEffect`.
 */
export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState<Countdown | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft(targetDate));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}
