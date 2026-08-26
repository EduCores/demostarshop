import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/checkout/success"],
    },
    sitemap: "https://starshop.cl/sitemap.xml",
    host: "https://starshop.cl",
  };
}
