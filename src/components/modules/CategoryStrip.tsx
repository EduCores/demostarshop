import { superCategories } from "@/lib/mock-data";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { Lightbulb, Wrench, Gauge, FlaskConical, Zap, BatteryCharging, ShieldCheck, Cpu, LucideProps } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Lightbulb,
  Wrench,
  Gauge,
  FlaskConical,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Cpu,
};

const BG_MAP: Record<string, string> = {
  "iluminacion-led-neon": "/Cinta Neón Flex 12V RGB 5 Metros-Control Remoto IP65.png",
  "herramientas-maquinarias": "/Kit Electricista 12 Piezas Acero.png",
  "instrumentos-medicion": "/Pinza Amperimetrica UNI-T UT210E True RMS 100A ACDC NCV.png",
  "tubos-lamparas-especiales": "/Tubo Germicida UV-C 36W G13 120cm Esterilizacion O3 Free.png",
  "fuentes-poder-soldadura": "/Fuente Laboratorio 30V 5A Display Dual.png",
  "pilas-baterias-cargadores": "/Pack 4x Bateria Litio 18650 3000mAh 15A Samsung 30Q.png",
  "seguridad-control-electrico": "/Alarma Hogar 8 Zonas Inalambrica.png",
  "electronica-miscelaneos": "/Arduino UNO R3 Original Cable USBPack Resistencias & Jumpers.png",
};

export function CategoryStrip() {
  return (
    <section className="container mt-6 max-w-full overflow-hidden">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border p-3 sm:p-4 overflow-hidden">
        <h2 className="font-black text-lg mb-4">Compra por Categoría</h2>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {superCategories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] ?? Cpu;
            return (
              <StaggerItem key={cat.id}>
                <Link href={`/categoria/${cat.slug}`} className="group text-center block transition-transform duration-200 hover:-translate-y-1">
                  <div className="aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border group-hover:shadow-md transition relative flex flex-col items-center justify-center p-3">
                    <img src={BG_MAP[cat.id] ?? ""} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.12] group-hover:opacity-[0.22] transition" loading="lazy" />
                    <div className="absolute inset-0 bg-white/60 dark:bg-zinc-900/40 group-hover:bg-white/40 dark:group-hover:bg-zinc-900/20 transition" />
                    <div className={`relative h-14 w-14 rounded-full flex items-center justify-center text-white shadow-sm ${cat.color} group-hover:scale-105 transition`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-[#FF3B30]/30 transition" />
                  </div>
                  <div className="mt-2 text-xs font-bold leading-tight line-clamp-2 group-hover:text-[#FF3B30]">{cat.name}</div>
                  <div className="text-[11px] text-zinc-500">{cat.subcategories.reduce((a, b) => a + b.count, 0)} productos</div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
