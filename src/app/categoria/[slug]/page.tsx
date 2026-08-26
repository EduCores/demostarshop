import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { superCategories, products } from "@/lib/mock-data";
import { CategoryView } from "@/components/modules/CategoryView";

export function generateStaticParams() {
  return superCategories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = superCategories.find((c) => c.slug === params.slug);
  return {
    title: category ? `${category.name} | Starshop` : "Categoría | Starshop",
    description: category?.description,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = superCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  return <CategoryView category={category} products={categoryProducts} />;
}
