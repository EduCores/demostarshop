"use client";
import { Award, Truck, FileText, BadgeCheck, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function B2BBanner() {
  return (
    <section id="b2b" className="container mt-6">
      <Reveal>
        <div className="rounded-lg overflow-hidden bg-gradient-to-r from-[#0F1111] via-[#232F3E] to-[#0F1111] text-white relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative grid md:grid-cols-2 gap-6 p-6 md:p-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFD814] text-black text-xs font-black px-3 py-1 rounded-full">
                <Award className="h-4 w-4" /> VENTA MAYORISTA B2B
              </div>
              <h2 className="text-2xl md:text-3xl font-black mt-3 leading-tight">
                Precios especiales para
                <br />
                <span className="text-[#FFD814]">contratistas e industrias</span>
              </h2>
              <p className="text-sm text-zinc-300 mt-3 max-w-lg">
                Abastece tu obra, taller o empresa con descuentos por volumen, facturación inmediata y despacho prioritario a todo Chile. Únete a más de 8.500 empresas que ya confían en Starshop.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { icon: FileText, title: "Cotización 2h", desc: "Respuesta express" },
                  { icon: Truck, title: "Despacho 24h", desc: "En RM y V Región" },
                  { icon: BadgeCheck, title: "Crédito 30d", desc: "Para empresas" },
                ].map((b) => (
                  <div key={b.title} className="bg-white/10 backdrop-blur rounded-lg p-3 text-center border border-white/10 transition-transform duration-200 hover:scale-105 hover:bg-white/15">
                    <b.icon className="h-6 w-6 mx-auto text-[#FFD814]" />
                    <div className="text-xs font-bold mt-1">{b.title}</div>
                    <div className="text-[11px] text-zinc-400">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white text-black rounded-xl p-6 shadow-2xl">
              <h3 className="font-black text-lg">Solicita tu cuenta empresa</h3>
              <p className="text-sm text-zinc-600 mt-1">Obtén lista de precios mayorista y ejecutivo asignado.</p>
              <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input placeholder="RUT Empresa" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF3B30] outline-none" />
                <input placeholder="Email corporativo" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF3B30] outline-none" />
                <input placeholder="Teléfono" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF3B30] outline-none" />
                <Button className="w-full bg-[#FF3B30] hover:bg-[#E6352B] font-bold gap-2 shimmer">
                  Solicitar acceso B2B <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex flex-col items-center gap-1 mt-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> 22 697 2072 | +56 9 9330 1557 | +56 9 8900 5158
                </span>
                <a href="mailto:ventas@starshop.cl" className="hover:text-[#FF3B30] hover:underline">
                  ventas@starshop.cl
                </a>
                <span className="flex items-center gap-1 text-[11px]">
                  🕒 Lun-Jue 10:00-18:00h | Vie 10:00-16:00h
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 text-center mt-2">Aprobación en 24h hábiles • Sin costo</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
