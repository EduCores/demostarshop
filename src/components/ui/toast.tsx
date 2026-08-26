"use client";
import { useToastStore } from "@/store/toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  default: Bell,
};

const accent = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  info: "border-l-blue-500",
  default: "border-l-zinc-300",
};

const iconColor = {
  success: "text-emerald-600",
  error: "text-red-600",
  info: "text-blue-600",
  default: "text-zinc-500",
};

export function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 border-l-4 rounded-md shadow-lg p-3 flex items-start gap-3",
                accent[t.variant]
              )}
              role="status"
            >
              <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor[t.variant])} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-zinc-900 dark:text-white">{t.title}</div>
                {t.description && <div className="text-xs text-zinc-500 mt-0.5">{t.description}</div>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
