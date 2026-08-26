"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-24 text-center">
      <div className="text-6xl">⚠️</div>
      <h1 className="text-2xl font-bold mt-4">Algo salió mal</h1>
      <p className="text-zinc-500 mt-2 max-w-md mx-auto">
        Ocurrió un error inesperado al cargar esta página. Puedes intentar nuevamente sin recargar.
      </p>
      <Button className="mt-6 gap-2" variant="starshop" onClick={reset}>
        <RotateCcw className="h-4 w-4" /> Reintentar
      </Button>
    </div>
  );
}
