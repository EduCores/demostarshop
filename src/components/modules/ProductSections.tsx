"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Shuffle, Star, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { products, superCategories } from "@/lib/mock-data";
import { SuperCategoryId, Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

const CAT_NAME: Record<string, string> = Object.fromEntries(
  superCategories.map((c) => [c.id, c.name])
);

interface SectionDef {
  id: string;
  label: string;
  desc: string;
  categoryIds: SuperCategoryId[];
}

// 3 secciones principales, cada una con sus subcategorías (filter-menu)
const SECTIONS: SectionDef[] = [
  {
    id: "sec-iluminacion",
    label: "Iluminación & Seguridad",
    desc: "La mejor gama en LED, tubos especiales y control eléctrico",
    categoryIds: ["iluminacion-led-neon", "tubos-lamparas-especiales", "seguridad-control-electrico"],
  },
  {
    id: "sec-herramientas",
    label: "Herramientas & Medición",
    desc: "Maquinarias, soldadura e instrumentos de precisión",
    categoryIds: ["herramientas-maquinarias", "fuentes-poder-soldadura", "instrumentos-medicion"],
  },
  {
    id: "sec-baterias",
    label: "Baterías & Electrónica",
    desc: "Cargadores, power banks y componentes electrónicos",
    categoryIds: ["pilas-baterias-cargadores", "electronica-miscelaneos"],
  },
];

function pickFeatured(pool: Product[], count: number): Product[] {
  const featured = pool.filter((p) => p.isFeatured || p.isBestSeller);
  const rest = [...pool].sort((a, b) => b.soldCount - a.soldCount);
  const combined = [...featured, ...rest.filter((r) => !featured.includes(r))];
  return combined.slice(0, count);
}

/** Fila de productos como carrusel horizontal con flechas (slider a la derecha). */
function ProductRowSlider({
  title,
  icon,
  items,
  onShuffle,
}: {
  title: string;
  icon: ReactNode;
  items: Product[];
  onShuffle?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const idsKey = items.map((p) => p.id).join(",");
  useEffect(() => {
    update();
    const el = ref.current;
    if (el) el.scrollTo({ left: 0 });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const scroll = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.8, 240);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!mounted) {
      return (
        <div className="overflow-hidden">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-1.5">{icon} {title}</h3>
          </div>
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
            {items.map((p) => (
              <div key={p.id} className="snap-start flex-none w-[47%] sm:w-[31%] lg:w-[23%] opacity-50">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      );
    }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-black uppercase tracking-wide flex items-center gap-1.5">{icon} {title}</h3>
        <div className="flex items-center gap-1.5">
          {onShuffle && (
            <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs mr-1" onClick={onShuffle}>
              <Shuffle className="h-3.5 w-3.5" /> Mezclar
            </Button>
          )}
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canLeft}
            aria-label="Anterior"
            className="h-8 w-8 rounded-full border flex items-center justify-center text-zinc-600 hover:text-[#ff5916] hover:border-[#ff5916] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canRight}
            aria-label="Siguiente"
            className="h-8 w-8 rounded-full border flex items-center justify-center text-zinc-600 hover:text-[#ff5916] hover:border-[#ff5916] disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        onScroll={update}
        className="flex gap-2 sm:gap-3 overflow-x-auto scroll-smooth scrollbar-hide snap-x pb-2"
      >
        {items.length === 0 ? (
          <div className="w-full py-8 text-center text-sm text-zinc-400 border border-dashed rounded-lg">Sin productos en esta categoría</div>
        ) : (
          items.map((p) => (
            <div key={p.id} className="snap-start flex-none w-[47%] sm:w-[31%] lg:w-[23%]">
              <ProductCard product={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SectionBlock({ section }: { section: SectionDef }) {
  const [cat, setCat] = useState<SuperCategoryId>(section.categoryIds[0]);
  const [seed, setSeed] = useState(0);

  const pool = useMemo(() => products.filter((p) => p.categoryId === cat), [cat]);

  // Pool de TODA la sección (las 3 subcategorías) para la fila "Sugeridos"
  const sectionPool = useMemo(
    () => products.filter((p) => section.categoryIds.includes(p.categoryId)),
    [section]
  );

  const featured = useMemo(() => pickFeatured(pool, 6), [pool]);

  // Fila aleatoria: productos de la sección (excluyendo destacados). Solo en cliente para evitar mismatch de hidratación.
  const [randomRow, setRandomRow] = useState<Product[]>([]);
  useEffect(() => {
    const excluded = new Set(featured.map((f) => f.id));
    const shuffled = [...sectionPool.filter((p) => !excluded.has(p.id))].sort(() => Math.random() - 0.5);
    setRandomRow(shuffled.slice(0, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, seed]);

  const secondRow = useMemo(
    () => (randomRow.length > 0 ? randomRow : sectionPool.filter((p) => !featured.includes(p)).slice(0, 8)),
    [randomRow, sectionPool, featured]
  );

  return (
    <div suppressHydrationWarning className="bg-white dark:bg-zinc-900 rounded-lg border p-2 sm:p-3 md:p-4 overflow-hidden max-w-full">
      {/* Encabezado de la sección */}
      <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-black">{section.label}</h2>
          <p className="text-sm text-zinc-500">{section.desc}</p>
        </div>
      </div>

      {/* filter-menu: subcategorías de la sección */}
      <div
        className="filter-menu flex flex-wrap gap-2 mb-4 border-b pb-3"
        role="tablist"
        aria-label={`Categorías de ${section.label}`}
      >
        {section.categoryIds.map((cid) => {
          const isActive = cid === cat;
          return (
            <button
              key={cid}
              role="tab"
              id={`tab-${section.id}-${cid}`}
              aria-selected={isActive}
              aria-controls={`panel-${section.id}-${cid}`}
              onClick={() => setCat(cid)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold border transition-colors duration-200 ${
                isActive
                  ? "border-transparent text-white"
                  : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-[#ff5916] hover:border-[#ff5916]/40"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`pill-${section.id}`}
                  className="absolute inset-0 rounded-full bg-[#232F3E]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {CAT_NAME[cid]}
                <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "text-[#FFD814]" : "opacity-50"}`} />
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel de contenido ligado al tab activo */}
      <div
        role="tabpanel"
        id={`panel-${section.id}-${cat}`}
        aria-labelledby={`tab-${section.id}-${cat}`}
      >
        {/* Fila 1: Destacados de la subcategoría (slider) */}
        <div className="mb-5">
          <ProductRowSlider
            title={`Destacados · ${CAT_NAME[cat]}`}
            icon={<Star className="h-4 w-4 fill-[#FFA41C] text-[#FFA41C]" />}
            items={featured}
          />
        </div>

        {/* Fila 2: Aleatorios de la sección (slider) */}
        <ProductRowSlider
          title="Sugeridos para ti"
          icon={<Sparkles className="h-4 w-4 text-emerald-500" />}
          items={secondRow}
          onShuffle={() => setSeed((s) => s + 1)}
        />
      </div>
    </div>
  );
}

export function ProductSections() {
  return (
    <section id="explorar-lineas" className="container mt-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {SECTIONS.map((s) => (
        <SectionBlock key={s.id} section={s} />
      ))}
    </section>
  );
}
