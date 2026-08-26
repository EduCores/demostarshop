"use client";
import { ShieldCheck, Truck, RefreshCcw, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  {
    icon: ShieldCheck,
    title: "Garantía Oficial",
    desc: "Hasta 3 años",
    chip: "bg-[#FFD814]/15 text-[#FFD814]",
  },
  {
    icon: Truck,
    title: "Despacho 24h RM",
    desc: "Todo Chile 2-4 días",
    chip: "bg-sky-500/15 text-sky-300",
  },
  {
    icon: RefreshCcw,
    title: "Cambios 30 días",
    desc: "Sin costo",
    chip: "bg-violet-500/15 text-violet-300",
  },
  {
    icon: MessageCircle,
    title: "Soporte WhatsApp",
    desc: "Lun-Sáb 9-19h",
    chip: "bg-emerald-500/15 text-emerald-300",
  },
];

export function TrustBand() {
  return (
    <section className="container mt-8">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#232F3E] to-[#0F1111] border border-white/5">
        {/* Detalle decorativo superior con color de marca */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#FF3B30] via-[#FFD814] to-[#25D366]" aria-hidden />

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className={`flex items-center gap-3 p-4 md:p-5 ${
                i % 2 === 1 ? "border-l border-white/10" : ""
              } ${i >= 2 ? "max-lg:border-t max-lg:border-white/10" : ""} ${
                i > 0 ? "lg:border-l lg:border-white/10" : ""
              } group`}
            >
              <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${item.chip}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white leading-tight">{item.title}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
