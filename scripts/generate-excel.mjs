import ExcelJS from "exceljs";
import { products, superCategories } from "../src/lib/mock-data.ts";
import fs from "fs";
import path from "path";

// Map categoria ID -> nombre
const catMap = Object.fromEntries(superCategories.map(c => [c.id, c.name]));
const catSlugMap = Object.fromEntries(superCategories.map(c => [c.id, c.slug]));

// Ensure data dir exists
const outDir = path.resolve("data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "productos-starshop.xlsx");

const wb = new ExcelJS.Workbook();
wb.creator = "StarShop";
wb.created = new Date();

// --- Hoja 1: Productos (DB principal) ---
const ws = wb.addWorksheet("Productos", {
  properties: { tabColor: { argb: "FF0EA5E9" } },
  views: [{ state: "frozen", ySplit: 1, xSplit: 2 }],
});

// Definir columnas - completas para probar agente RAG / busqueda
ws.columns = [
  { header: "ID", key: "id", width: 10 },
  { header: "SKU", key: "sku", width: 24 },
  { header: "Nombre", key: "name", width: 55 },
  { header: "Slug", key: "slug", width: 28 },
  { header: "Descripción", key: "description", width: 70 },
  { header: "Descripción Corta", key: "shortDescription", width: 45 },
  { header: "Marca", key: "brand", width: 18 },
  { header: "Categoría ID", key: "categoryId", width: 26 },
  { header: "Categoría Nombre", key: "categoryName", width: 30 },
  { header: "Categoría Slug", key: "categorySlug", width: 26 },
  { header: "Subcategoría", key: "subcategory", width: 28 },
  { header: "Precio Oferta (CLP)", key: "price", width: 16 },
  { header: "Precio Original (CLP)", key: "originalPrice", width: 18 },
  { header: "Descuento %", key: "discount", width: 12 },
  { header: "Precio Mayorista 10+ (CLP)", key: "tier10", width: 20 },
  { header: "Rating (1-5)", key: "rating", width: 11 },
  { header: "N° Reseñas", key: "reviewCount", width: 11 },
  { header: "Stock", key: "stock", width: 10 },
  { header: "Vendidos", key: "soldCount", width: 10 },
  { header: "Disponibilidad", key: "disponibilidad", width: 14 },
  { header: "Peso Kg", key: "shippingWeight", width: 10 },
  { header: "Certificado SEC", key: "secCertified", width: 14 },
  { header: "Garantía", key: "warranty", width: 12 },
  { header: "Es Oferta Flash", key: "isFlashSale", width: 13 },
  { header: "Es B2B", key: "isB2B", width: 10 },
  { header: "Es Nuevo", key: "isNew", width: 10 },
  { header: "Es Destacado", key: "isFeatured", width: 12 },
  { header: "Es BestSeller", key: "isBestSeller", width: 12 },
  { header: "Tags", key: "tags", width: 28 },
  { header: "Specs (JSON)", key: "specsJson", width: 40 },
  { header: "Specs Texto", key: "specsText", width: 45 },
  { header: "Tier Prices (JSON)", key: "tierPrices", width: 42 },
  { header: "Imagen Principal", key: "img1", width: 45 },
  { header: "Imagen Secundaria", key: "img2", width: 45 },
  { header: "URL Producto", key: "url", width: 36 },
  { header: "Precio Formateado", key: "priceFormatted", width: 16 },
];

// Estilo header
const headerRow = ws.getRow(1);
headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
headerRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
headerRow.height = 28;
headerRow.eachCell((cell, colNumber) => {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: colNumber <= 2 ? "FF0F172A" : "FF0284C7" },
  };
  cell.border = {
    top: { style: "thin", color: { argb: "FFCBD5E1" } },
    left: { style: "thin", color: { argb: "FFCBD5E1" } },
    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    right: { style: "thin", color: { argb: "FFCBD5E1" } },
  };
});

// Helpers
const fmtCLP = (v) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(v);

for (const p of products) {
  const tier10 = p.tierPrices?.find(t => t.minQty >= 10)?.price ?? (p.tierPrices ? p.tierPrices[p.tierPrices.length - 1].price : p.price);
  const specsJson = JSON.stringify(p.specs, null, 0);
  const specsText = Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(" | ");
  const row = ws.addRow({
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.shortDescription,
    brand: p.brand,
    categoryId: p.categoryId,
    categoryName: catMap[p.categoryId] ?? p.categoryId,
    categorySlug: catSlugMap[p.categoryId] ?? p.categoryId,
    subcategory: p.subcategory,
    price: p.price,
    originalPrice: p.originalPrice ?? "",
    discount: p.discount ?? (p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : ""),
    tier10: tier10,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    soldCount: p.soldCount,
    disponibilidad: p.stock > 100 ? "En Stock" : p.stock > 20 ? "Stock Medio" : p.stock > 0 ? "Pocas Unidades" : "Agotado",
    shippingWeight: p.shippingWeight,
    secCertified: p.secCertified ? "SÍ" : "NO",
    warranty: p.warranty,
    isFlashSale: p.isFlashSale ? "SÍ" : "NO",
    isB2B: p.isB2B ? "SÍ" : "NO",
    isNew: p.isNew ? "SÍ" : "NO",
    isFeatured: p.isFeatured ? "SÍ" : "NO",
    isBestSeller: p.isBestSeller ? "SÍ" : "NO",
    tags: (p.tags || []).join(", "),
    specsJson: specsJson === "{}" ? "" : specsJson,
    specsText: specsText,
    tierPrices: p.tierPrices ? JSON.stringify(p.tierPrices) : "",
    img1: p.images[0] ?? "",
    img2: p.images[1] ?? "",
    url: `/producto/${p.slug}`,
    priceFormatted: fmtCLP(p.price),
  });
  row.alignment = { vertical: "center", wrapText: true };
  row.height = 22;
  // Formato moneda
  row.getCell("price").numFmt = '"$"#,##0';
  row.getCell("originalPrice").numFmt = '"$"#,##0';
  row.getCell("tier10").numFmt = '"$"#,##0';
  // Colores condicionales simples
  if (p.discount && p.discount >= 30) {
    row.getCell("discount").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
    row.getCell("discount").font = { bold: true, color: { argb: "FFB45309" } };
  }
  if (p.secCertified) {
    row.getCell("secCertified").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } };
    row.getCell("secCertified").font = { bold: true, color: { argb: "FF166534" } };
  }
  if (p.stock < 20) {
    row.getCell("stock").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } };
    row.getCell("stock").font = { bold: true, color: { argb: "FF991B1B" } };
  }
}

// Filtros, ancho y bordes
ws.autoFilter = { from: "A1", to: `AJ1` };
ws.views = [{ state: "frozen", ySplit: 1, xSplit: 2 }];

// Ajuste ancho y wrap para descripciones
ws.getColumn("description").alignment = { wrapText: true, vertical: "center" };
ws.getColumn("shortDescription").alignment = { wrapText: true, vertical: "center" };

// Validaciones / formato
// Bordes finos a toda la tabla
for (let r = 2; r <= ws.rowCount; r++) {
  const row = ws.getRow(r);
  row.eachCell((cell) => {
    cell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };
  });
  // Alternar color
  if (r % 2 === 0) {
    row.eachCell((cell) => {
      if (!cell.fill || cell.fill.fgColor?.argb === "FFFFFFFF" || !cell.fill.fgColor) {
        // no sobrescribir fills condicionales
      }
    });
  }
}

// --- Hoja 2: Categorías ---
const ws2 = wb.addWorksheet("Categorias", { properties: { tabColor: { argb: "FF10B981" } }, views: [{ state: "frozen", ySplit: 1 }] });
ws2.columns = [
  { header: "ID Categoría", key: "id", width: 28 },
  { header: "Nombre", key: "name", width: 32 },
  { header: "Slug", key: "slug", width: 28 },
  { header: "Icono", key: "icon", width: 14 },
  { header: "Descripción", key: "description", width: 40 },
  { header: "Color", key: "color", width: 16 },
  { header: "N° Subcategorías", key: "subCount", width: 16 },
  { header: "Subcategorías (JSON)", key: "subs", width: 60 },
];
const h2 = ws2.getRow(1);
h2.font = { bold: true, color: { argb: "FFFFFFFF" } };
h2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF059669" } };
h2.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
h2.height = 24;
for (const c of superCategories) {
  ws2.addRow({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    description: c.description,
    color: c.color,
    subCount: c.subcategories.length,
    subs: JSON.stringify(c.subcategories.map(s => `${s.name} (${s.count})`).join(" | ")),
  });
}
ws2.autoFilter = { from: "A1", to: "H1" };
ws2.eachRow((row, idx) => {
  if (idx === 1) return;
  row.alignment = { vertical: "center", wrapText: true };
  row.height = 18;
  row.eachCell(c => c.border = { top: { style: "thin", color: { argb: "FFE2E8F0" } }, left: { style: "thin", color: { argb: "FFE2E8F0" } }, bottom: { style: "thin", color: { argb: "FFE2E8F0" } }, right: { style: "thin", color: { argb: "FFE2E8F0" } } });
});

// --- Hoja 3: Resumen (para el agente) ---
const ws3 = wb.addWorksheet("Resumen", { properties: { tabColor: { argb: "FFF59E0B" } } });
ws3.columns = [
  { header: "Métrica", key: "k", width: 32 },
  { header: "Valor", key: "v", width: 32 },
];
const h3 = ws3.getRow(1);
h3.font = { bold: true, color: { argb: "FFFFFFFF" } };
h3.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD97706" } };
h3.alignment = { horizontal: "center" };
const stats = [
  ["Total productos", products.length],
  ["Categorías", superCategories.length],
  ["Subcategorías totales", superCategories.reduce((a,c)=>a+c.subcategories.length,0)],
  ["Precio mínimo", fmtCLP(Math.min(...products.map(p=>p.price)))],
  ["Precio máximo", fmtCLP(Math.max(...products.map(p=>p.price)))],
  ["Precio promedio", fmtCLP(Math.round(products.reduce((a,p)=>a+p.price,0)/products.length))],
  ["Con descuento", products.filter(p=>p.discount).length],
  ["BestSellers", products.filter(p=>p.isBestSeller).length],
  ["Oferta Flash", products.filter(p=>p.isFlashSale).length],
  ["Certificados SEC", products.filter(p=>p.secCertified).length],
  ["Marcas únicas", new Set(products.map(p=>p.brand)).size],
  ["Marcas", [...new Set(products.map(p=>p.brand))].join(", ")],
  ["Fecha generación", new Date().toLocaleString("es-CL")],
];
for (const [k,v] of stats) ws3.addRow({ k, v });
ws3.getColumn("k").font = { bold: true };
for (let r=2;r<=ws3.rowCount;r++) {
  const row=ws3.getRow(r);
  row.eachCell(c=>c.border={ top:{style:"thin",color:{argb:"FFE2E8F0"}}, left:{style:"thin",color:{argb:"FFE2E8F0"}}, bottom:{style:"thin",color:{argb:"FFE2E8F0"}}, right:{style:"thin",color:{argb:"FFE2E8F0"}} });
}

// --- Hoja 4: Instrucciones para el agente ---
const ws4 = wb.addWorksheet("Agente - Instrucciones", { properties: { tabColor: { argb: "FF6366F1" } } });
ws4.columns = [
  { header: "Campo", key: "campo", width: 28 },
  { header: "Descripción / Uso para el agente", key: "desc", width: 90 },
];
const h4 = ws4.getRow(1);
h4.font = { bold: true, color: { argb: "FFFFFFFF" } };
h4.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } };
h4.alignment = { horizontal: "center" };
const instr = [
  ["ID", "Identificador interno del producto (p001..p049). Úsalo como PK para joins."],
  ["SKU", "Código único en mayúsculas para ERP / facturación."],
  ["Nombre", "Nombre largo optimizado SEO. Usa para búsqueda full-text y embeddings."],
  ["Descripción / Corta", "Texto para RAG. Descripción contiene info de despacho y garantía."],
  ["Marca", "Filtra por marca (ej: Fluke, Mean Well, UNI-T)."],
  ["Categoría / Subcategoría", "Clasificación jerárquica. Categoría ID es FK a hoja Categorias."],
  ["Precio / Original / Descuento", "Precios en CLP (integer). Descuento calculado. Para consultas tipo 'menos de $20.000' o 'con 30% off'."],
  ["Tier Prices (JSON)", "Precios por tramo mayorista. Parsear JSON: [{minQty, maxQty, price, label}]."],
  ["Rating / Reviews", "Social proof. Útil para 'mejor valorados' o 'más vendidos'."],
  ["Stock / Vendidos / Disponibilidad", "Stock para disponibilidad. Vendidos para ranking popularidad."],
  ["SEC / Garantía", "Atributo clave Chile. SEC=SÍ es certificado. Garantía en string."],
  ["Flags (Flash/B2B/Nuevo/Destacado/BestSeller)", "Booleanos para segmentar ofertas, catálogo B2B, home featured."],
  ["Tags", "Keywords separadas por coma para búsqueda semántica."],
  ["Specs (JSON/Texto)", "Specs técnicas clave-valor. Usa Specs Texto para lectura humana y JSON para filtros (ej: Potencia=200W)."],
  ["Imágenes", "URLs absolutas o /public. Imagen principal es la primera."],
  ["URL Producto", "Ruta Next.js: /producto/[slug]. Úsala para enlazar."],
  ["Uso recomendado", "1) Carga este Excel como DB vectorial o SQL. 2) Para consultas de precio filtra columnas numéricas. 3) Para filtros técnicos parsea Specs JSON."],
];
for (const [campo, desc] of instr) ws4.addRow({ campo, desc });
ws4.eachRow((row, idx) => {
  row.alignment = { vertical: "center", wrapText: true };
  row.height = idx===1? 22 : 18;
  row.eachCell(c=>c.border={ top:{style:"thin",color:{argb:"FFE2E8F0"}}, left:{style:"thin",color:{argb:"FFE2E8F0"}}, bottom:{style:"thin",color:{argb:"FFE2E8F0"}}, right:{style:"thin",color:{argb:"FFE2E8F0"}} });
});
ws4.getColumn("campo").font = { bold: true };

// Auto width y print
for (const sheet of [ws, ws2, ws3, ws4]) {
  sheet.properties.defaultRowHeight = 15;
}

await wb.xlsx.writeFile(outPath);
console.log(`✅ Excel generado: ${outPath}`);
console.log(`   Productos: ${products.length}`);
console.log(`   Categorías: ${superCategories.length}`);
console.log(`   Hojas: ${wb.worksheets.map(s=>s.name).join(", ")}`);

// También generar CSV espejo para el agente (opcional)
const csvPath = path.join(outDir, "productos-starshop.csv");
const csvWb = new ExcelJS.Workbook();
const csvWs = csvWb.addWorksheet("csv");
// copiar headers y rows de ws a csvWs
csvWs.columns = ws.columns.map(c => ({ header: c.header, key: c.key, width: c.width }));
// copiar header ya está, agregar rows
products.forEach(p => {
  const tier10 = p.tierPrices?.find(t => t.minQty >= 10)?.price ?? (p.tierPrices ? p.tierPrices[p.tierPrices.length - 1].price : p.price);
  csvWs.addRow({
    id: p.id, sku: p.sku, name: p.name, slug: p.slug, description: p.description, shortDescription: p.shortDescription,
    brand: p.brand, categoryId: p.categoryId, categoryName: catMap[p.categoryId], categorySlug: catSlugMap[p.categoryId],
    subcategory: p.subcategory, price: p.price, originalPrice: p.originalPrice ?? "", discount: p.discount ?? "",
    tier10, rating: p.rating, reviewCount: p.reviewCount, stock: p.stock, soldCount: p.soldCount,
    disponibilidad: p.stock > 100 ? "En Stock" : p.stock > 20 ? "Stock Medio" : "Pocas Unidades",
    shippingWeight: p.shippingWeight, secCertified: p.secCertified ? "SÍ" : "NO", warranty: p.warranty,
    isFlashSale: p.isFlashSale ? "SÍ" : "NO", isB2B: p.isB2B ? "SÍ" : "NO", isNew: p.isNew ? "SÍ" : "NO",
    isFeatured: p.isFeatured ? "SÍ" : "NO", isBestSeller: p.isBestSeller ? "SÍ" : "NO",
    tags: (p.tags||[]).join(", "), specsJson: JSON.stringify(p.specs), specsText: Object.entries(p.specs).map(([k,v])=>`${k}: ${v}`).join(" | "),
    tierPrices: p.tierPrices ? JSON.stringify(p.tierPrices) : "", img1: p.images[0]??"", img2: p.images[1]??"", url: `/producto/${p.slug}`, priceFormatted: fmtCLP(p.price)
  });
});
await csvWb.csv.writeFile(csvPath);
console.log(`✅ CSV espejo: ${csvPath}`);
