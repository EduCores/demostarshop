export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "como-elegir-panel-led-36w-oficina",
    title: "Cómo elegir panel LED 36W para oficina (guía 2026)",
    excerpt: "Lúmenes, temperatura de color y certificación SEC explicados. Demo con productos mockup.",
    content: `
## Resumen
Esta guía es **contenido demo (mockup)** para captar tráfico long-tail. Usa productos de ejemplo, no son oferta real.

### 1. Lúmenes y eficiencia
Un panel 36W 600x600 rinde ~3600 lm. Para oficinas busca 100-150 lux/m² y 4000K neutro.

### 2. Certificación SEC
Verifica sello SEC en ficha. En Starshop los productos demo marcados muestran el badge.

### 3. CTA
Explora la categoría Iluminación LED en el home. Este post es solo para SEO demo.
    `.trim(),
    image: "/Panel LED 36W 600x600 4000K Marco Blanco.png",
    date: "2026-03-10",
    author: "Equipo Starshop (demo)",
    tags: ["iluminacion", "led", "guia"],
  },
  {
    slug: "crimpadora-rj45-profesional-que-mirar",
    title: "Crimpadora RJ45 profesional: qué mirar antes de comprar",
    excerpt: "Matrices, trinquete y ergonomía. Artículo demo para SEO técnico.",
    content: `
## Resumen
Artículo **mockup** — orientado a contratistas que buscan "crimpadora RJ45 Chile".

### Puntos clave
- **Matrices**: RJ45/RJ11/RJ12 compatibles.
- **Trinquete**: evita falsos contactos.
- **Garantía**: productos demo muestran garantía en la ficha.

### CTA
Ver herramientas en el catálogo demo. No es cotización real.
    `.trim(),
    image: "/Crimpadora Modular RJ45RJ11 Profesional.png",
    date: "2026-04-02",
    author: "Equipo Starshop (demo)",
    tags: ["herramientas", "redes", "guia"],
  },
  {
    slug: "multimetro-digital-vs-analogico-b2b",
    title: "Multímetro digital vs analógico para B2B: cuándo conviene cada uno",
    excerpt: "Precisión, robustez y costo para compras por volumen. Post demo.",
    content: `
## Resumen
Contenido **demo** para captar búsquedas B2B "multímetro mayorista".

### Comparativa breve
- **Digital**: precisión, auto-rango, ideal para obra.
- **Analógico**: robusto, bajo costo, para stock.

### Para empresas
Si compras por volumen, usa Cotizaciones B2B (funcional con carrito mockup). Este blog es solo demostración SEO.
    `.trim(),
    image: "/Panel LED 36W 600x600 4000K Marco Blanco.png",
    date: "2026-04-18",
    author: "Equipo Starshop (demo)",
    tags: ["instrumentos", "b2b", "guia"],
  },
];
