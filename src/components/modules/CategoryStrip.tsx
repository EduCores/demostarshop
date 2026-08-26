import { superCategories } from "@/lib/mock-data";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

export function CategoryStrip() {
  return (
    <section className="container mt-6">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border p-4">
        <h2 className="font-black text-lg mb-4">Compra por Categoría</h2>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {superCategories.map((cat) => (
            <StaggerItem key={cat.id}>
              <Link href={`/categoria/${cat.slug}`} className="group text-center block transition-transform duration-200 hover:-translate-y-1">
                <div className="aspect-square rounded-xl overflow-hidden bg-zinc-50 border group-hover:shadow-md transition relative">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="mt-2 text-xs font-bold leading-tight line-clamp-2 group-hover:text-[#FF3B30]">{cat.name}</div>
                <div className="text-[11px] text-zinc-500">{cat.subcategories.reduce((a, b) => a + b.count, 0)} productos</div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
