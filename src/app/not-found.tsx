import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageX, Home, Grid3X3 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <div className="text-7xl font-black text-[#FF3B30]">404</div>
      <h1 className="text-2xl font-bold mt-4">Página o producto no encontrado</h1>
      <p className="text-zinc-500 mt-2 max-w-md mx-auto">
        Lo sentimos, no pudimos encontrar lo que buscabas. El enlace puede haber expirado o el producto ya no está disponible.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link href="/">
          <Button variant="starshop" className="gap-2">
            <Home className="h-4 w-4" /> Ir a la tienda
          </Button>
        </Link>
        <Link href="/categoria/iluminacion-led-neon">
          <Button variant="outline" className="gap-2">
            <Grid3X3 className="h-4 w-4" /> Ver categorías
          </Button>
        </Link>
      </div>
      <div className="mt-8 text-zinc-300">
        <PackageX className="h-10 w-10 mx-auto" />
      </div>
    </div>
  );
}
