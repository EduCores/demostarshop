import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { superCategories, products } from "@/lib/mock-data";
import { CategoryView } from "@/components/modules/CategoryView";

export function generateStaticParams() {
  return superCategories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = superCategories.find((c) => c.slug === params.slug);
  const title = category ? `${category.name} | Starshop` : "Categoría | Starshop";
  const description = category?.description ?? "Explora herramientas, LED e instrumentos. Catálogo demo.";
  const url = `https://starshop.cl/categoria/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: [{ url: "/og-starshop.jpg", width: 1200, height: 630, alt: category?.name ?? "Categoría" }] },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = superCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.categoryId === category.id);

  return <CategoryView category={category} products={categoryProducts} />;
}
