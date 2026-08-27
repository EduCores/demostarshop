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

// Mapeo a imágenes locales en /public con mismo nombre exacto
const CAT_IMAGE_MAP: Record<string, string> = {
  "iluminacion-led-neon": "/Iluminacion LED & Neon Flex.png",
  "herramientas-maquinarias": "/Herramientas y Maquinarias.png",
  "instrumentos-medicion": "/Instrumentos de Medicion y Termicos.png",
  "tubos-lamparas-especiales": "/Tubos y Lamparas Especiales.png",
  "fuentes-poder-soldadura": "/Fuentes de Poder y Soldadura.png",
  "pilas-baterias-cargadores": "/Pilas Baterias & Cargadores.png",
  "seguridad-control-electrico": "/Seguridad & Control Electrico.png",
  "electronica-miscelaneos": "/Electronica & Miscelaneos.png",
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
                  <div className="aspect-square rounded-xl overflow-hidden bg-zinc-50 border group-hover:shadow-md transition relative">
                    <img
                      src={CAT_IMAGE_MAP[cat.id] ?? cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full flex items-center justify-center text-white shadow-md ${cat.color} group-hover:scale-105 transition`}>
                      <Icon className="h-7 w-7" />
                    </div>
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
