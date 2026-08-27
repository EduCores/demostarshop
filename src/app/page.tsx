import { HeroSection } from "@/components/modules/HeroSection";
import { FlashSale } from "@/components/modules/FlashSale";
import { CategoryStrip } from "@/components/modules/CategoryStrip";
import { B2BBanner } from "@/components/modules/B2BBanner";
import { ProductSections } from "@/components/modules/ProductSections";
import { ProductGrid } from "@/components/modules/ProductGrid";
import { TrustBand } from "@/components/modules/TrustBand";

export default function Home() {
  return (
    <div className="pb-10 max-w-full overflow-hidden">
      <HeroSection />
      <FlashSale />
      <CategoryStrip />
      <ProductGrid />
      <B2BBanner />

      {/* Explorador por líneas: 3 secciones × (destacados + aleatorios) */}
      <ProductSections />

      {/* Trust band */}
      <TrustBand />
    </div>
  );
}
