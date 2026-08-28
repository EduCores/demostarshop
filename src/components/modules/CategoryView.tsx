"use client";
import { useMemo, useState } from "react";
import { SuperCategory, Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, RotateCcw, PackageSearch, Lightbulb, Wrench, Gauge, FlaskConical, Zap, BatteryCharging, ShieldCheck, Cpu, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Sort = "popular" | "price-asc" | "price-desc";

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Wrench,
  Gauge,
  FlaskConical,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Cpu,
};

export function CategoryView({ category, products }: { category: SuperCategory; products: Product[] }) {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [onlySec, setOnlySec] = useState(false);
  const [onlyB2B, setOnlyB2B] = useState(false);
  const [sort, setSort] = useState<Sort>("popular");
  const [mobileOpen, setMobileOpen] = useState(false);

  const CatIcon = CATEGORY_ICON_MAP[category.icon];

  const resetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setOnlySec(false);
    setOnlyB2B(false);
    setSort("popular");
  };

  const filtered = useMemo(() => {
    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    let result = products.filter((p) => p.price >= min && p.price <= max);
    if (onlySec) result = result.filter((p) => p.secCertified);
    if (onlyB2B) result = result.filter((p) => (p.tierPrices?.length ?? 0) > 0);
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else result = [...result].sort((a, b) => b.soldCount - a.soldCount);
    return result;
  }, [products, priceMin, priceMax, onlySec, onlyB2B, sort]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Ordenar por</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="mt-1.5 w-full border rounded-md h-9 px-2 text-sm bg-white dark:bg-zinc-900"
        >
          <option value="popular">Más populares</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wide text-zinc-500">Rango de precio (CLP)</label>
        <div className="flex gap-2 mt-1.5">
          <input
            type="number"
            min={0}
            placeholder="Mín"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full border rounded-md h-9 px-2 text-sm bg-white dark:bg-zinc-900"
          />
          <input
            type="number"
            min={0}
            placeholder="Máx"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border rounded-md h-9 px-2 text-sm bg-white dark:bg-zinc-900"
          />
        </div>
      </div>

      <div className="space-y-3 border-t pt-4">
        <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={onlySec} onChange={(e) => setOnlySec(e.target.checked)} className="h-4 w-4 accent-emerald-600" />
          Certificación SEC (Sí)
        </label>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={onlyB2B} onChange={(e) => setOnlyB2B(e.target.checked)} className="h-4 w-4 accent-[#FF3B30]" />
          Descuento por Volumen (B2B / Tier)
        </label>
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
        <RotateCcw className="h-3.5 w-3.5" /> Resetear filtros
      </Button>
    </div>
  );

  return (
    <div className="container py-6">
      <div className="mb-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
          <a href="/" className="hover:text-[#FF3B30] hover:underline">Inicio</a>
          <span>/</span>
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">{category.name}</span>
        </nav>
        <div className="flex items-center gap-3">
          {CatIcon && (
            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${category.color}`}>
              <CatIcon className="h-6 w-6 text-white" />
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-black">{category.name}</h1>
        </div>
        <p className="text-sm text-zinc-500 mt-1">{category.description} • {products.length} productos</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar de filtros (escritorio) */}
        <aside className="hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-lg border p-4 sticky top-24">{Filters}</div>
        </aside>

        {/* Grid de productos */}
        <div className="lg:col-span-3">
          {/* Botón filtros móvil */}
          <div className="lg:hidden mb-4">
            <Button variant="outline" className="w-full" onClick={() => setMobileOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filtros ({filtered.length})
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-lg border p-12 text-center">
              <PackageSearch className="h-12 w-12 text-zinc-300 mx-auto" />
              <p className="font-bold text-lg mt-3">No se encontraron productos</p>
              <p className="text-sm text-zinc-500 mt-1">Prueba ajustando los filtros para ver más resultados.</p>
              <Button className="mt-5" variant="starshop" onClick={resetFilters}>Resetear filtros</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-zinc-500 mb-3 hidden lg:block">{filtered.length} productos encontrados</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drawer de filtros (móvil) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[80]" onClick={() => setMobileOpen(false)} aria-hidden />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 max-w-[85%] bg-white dark:bg-zinc-900 z-[90] p-4 overflow-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filtros
                </h2>
                <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded" aria-label="Cerrar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {Filters}
              <Button className="w-full mt-5" variant="starshop" onClick={() => setMobileOpen(false)}>
                Ver {filtered.length} productos
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
