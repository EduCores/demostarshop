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
                  <div className="aspect-square rounded-xl bg-zinc-50 dark:bg-zinc-800 border group-hover:shadow-md transition relative flex flex-col items-center justify-center p-3">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-sm ${cat.color} group-hover:scale-105 transition`}>
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
