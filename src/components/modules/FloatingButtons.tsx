"use client";
import { useState, useEffect } from "react";
import { ArrowUp, Bot, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentInput, setAgentInput] = useState("");
  const [agentMessages, setAgentMessages] = useState<{ role: "user" | "agent"; text: string }[]>([
    { role: "agent", text: "¡Hola! Soy el asistente Starshop (demo mockup). Pregunta por productos, envíos o cotizaciones." },
  ]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sendAgent = () => {
    const t = agentInput.trim();
    if (!t) return;
    setAgentMessages((m) => [...m, { role: "user", text: t }, { role: "agent", text: `Demo (mockup): recibí "${t}". Productos son de catálogo de ejemplo. Prueba preguntar por "panel LED" o "cotización".` }]);
    setAgentInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end gap-3">
      {/* Volver arriba - arriba del agente */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-[#232F3E] text-white shadow-lg flex items-center justify-center hover:bg-[#0F1111] transition-colors"
            aria-label="Volver arriba"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Agente IA - alineado vertical con WhatsApp */}
      <motion.button
        onClick={() => setAgentOpen((o) => !o)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-[rgb(255_216_20/var(--tw-bg-opacity,1))] text-black shadow-xl flex items-center justify-center hover:bg-[rgb(247_202_0/var(--tw-bg-opacity,1))] transition-colors"
        aria-label="Agente IA"
      >
        <Bot className="h-7 w-7 md:h-8 md:w-8" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white" aria-hidden />
      </motion.button>

      {/* Panel agente */}
      <AnimatePresence>
        {agentOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="w-[320px] md:w-[360px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
          >
            <div className="bg-[#7c3aed] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm"><Bot className="h-5 w-5" /> Agente Starshop (demo)</div>
              <button onClick={() => setAgentOpen(false)} className="p-1 hover:bg-white/20 rounded" aria-label="Cerrar"><X className="h-4 w-4" /></button>
            </div>
            <div className="text-[11px] bg-amber-50 border-b border-amber-200 text-amber-800 px-3 py-2">Mockup: sin IA real. Productos de catálogo son de ejemplo.</div>
            <div className="flex-1 max-h-[320px] overflow-auto p-3 space-y-2">
              {agentMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-[#7c3aed] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="border-t p-2 flex gap-2">
              <input
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAgent()}
                placeholder="Pregunta por un producto mockup..."
                className="flex-1 border rounded-full px-4 py-2 text-sm bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
              />
              <button onClick={sendAgent} className="h-9 w-9 rounded-full bg-[#7c3aed] text-white flex items-center justify-center hover:bg-[#6d28d9]"><Send className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp - alineado vertical con agente */}
      <motion.a
        href="https://wa.me/56993301557?text=Hola%20Starshop,%20quiero%20hacer%20una%20consulta"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:bg-[#128C7E] transition-colors"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" aria-hidden />
        <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8 relative" />
      </motion.a>
    </div>
  );
}
