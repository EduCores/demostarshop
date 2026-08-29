"use client";

import { chileRegions } from "@/lib/mock-data";

export function ShippingRegionComunaSelect({
  region,
  comuna,
  onRegionChange,
  onComunaChange,
  regionLabel = "Región *",
  comunaLabel = "Comuna *",
  comunaError,
  className = "",
  comunaClassName = "",
}: {
  region: string;
  comuna: string;
  onRegionChange: (region: string) => void;
  onComunaChange: (comuna: string) => void;
  regionLabel?: string;
  comunaLabel?: string;
  comunaError?: string;
  className?: string;
  comunaClassName?: string;
}) {
  const selected = chileRegions.find((r) => r.name === region);

  return (
    <div className={className}>
      <div>
        <label className="text-sm font-medium">{regionLabel}</label>
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="mt-1 w-full border rounded-md h-9 px-3 text-sm bg-white dark:bg-zinc-900"
        >
          {chileRegions.map((r) => (
            <option key={r.name} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
      </div>
      <div className={`mt-2 ${comunaClassName}`}>
        <label className="text-sm font-medium">{comunaLabel}</label>
        <select
          value={comuna}
          onChange={(e) => onComunaChange(e.target.value)}
          className="mt-1 w-full border rounded-md h-9 px-3 text-sm bg-white dark:bg-zinc-900"
        >
          <option value="">Selecciona una comuna</option>
          {selected?.communes.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {comunaError && <p className="text-xs text-red-600 mt-1">{comunaError}</p>}
      </div>
    </div>
  );
}
