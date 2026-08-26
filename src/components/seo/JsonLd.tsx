import { Product, SuperCategory } from "@/types";

const BASE_URL = "https://starshop.cl";

/**
 * Componente que inyecta datos estructurados JSON-LD para SEO:
 *  - Schema.org/Product (precio CLP, disponibilidad, certificación SEC)
 *  - Schema.org/BreadcrumbList (Inicio > Categoría > Producto)
 */
export function JsonLd({ product, category }: { product: Product; category: SuperCategory | undefined }) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/producto/${product.id}`,
      priceCurrency: "CLP",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      ...(product.originalPrice
        ? { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
        : {}),
    },
    ...(product.secCertified
      ? {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "Certificación SEC",
            value: "Sí",
          },
        }
      : {}),
  };

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
    ...(category
      ? [
          {
            "@type": "ListItem" as const,
            position: 2,
            name: category.name,
            item: `${BASE_URL}/categoria/${category.slug}`,
          },
        ]
      : []),
    {
      "@type": "ListItem",
      position: category ? 3 : 2,
      name: product.name,
      item: `${BASE_URL}/producto/${product.id}`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
