#!/usr/bin/env node
// Agente de prueba local que usa data/productos-starshop.xlsx como DB
// Uso: npx tsx scripts/probar-agente.mjs "busca proyector LED con SEC bajo 50000"
//      npx tsx scripts/probar-agente.mjs --interactive
import ExcelJS from "exceljs";
import path from "path";
import readline from "readline";

const xlsxPath = path.resolve("data/productos-starshop.xlsx");

async function loadProducts() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet("Productos");
  const headers = ws.getRow(1).values.slice(1); // values[0] is null
  const products = [];
  ws.eachRow((row, idx) => {
    if (idx === 1) return;
    const obj = {};
    row.eachCell((cell, col) => {
      const key = headers[col - 1];
      obj[key] = cell.value;
    });
    products.push(obj);
  });
  return products;
}

function scoreProduct(p, query) {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  const haystack = [
    p["Nombre"], p["Descripción"], p["Descripción Corta"], p["Marca"], p["Categoría Nombre"], p["Subcategoría"], p["Tags"], p["Specs Texto"]
  ].join(" ").toLowerCase();

  for (const t of tokens) {
    if (haystack.includes(t)) score += 2;
    if (String(p["Nombre"]).toLowerCase().includes(t)) score += 3;
    if (String(p["Tags"]).toLowerCase().includes(t)) score += 2;
  }
  // filtros numéricos
  if (q.includes("sec") && p["Certificado SEC"] === "SÍ") score += 5;
  if (q.includes("bestseller") && p["Es BestSeller"] === "SÍ") score += 4;
  if (q.includes("flash") && p["Es Oferta Flash"] === "SÍ") score += 4;
  if (q.includes("b2b") && p["Es B2B"] === "SÍ") score += 3;
  // precio
  const mPrecio = q.match(/(?:bajo|menos de|menor|<)\s*\$?\s*([\d\.]+)/i);
  if (mPrecio) {
    const max = parseInt(mPrecio[1].replace(/\./g, ""));
    if (p["Precio Oferta (CLP)"] <= max) score += 4; else score -= 10;
  }
  const mEntre = q.match(/entre\s*\$?\s*([\d\.]+)\s*y\s*\$?\s*([\d\.]+)/i);
  if (mEntre) {
    const a = parseInt(mEntre[1].replace(/\./g, "")), b = parseInt(mEntre[2].replace(/\./g, ""));
    if (p["Precio Oferta (CLP)"] >= Math.min(a,b) && p["Precio Oferta (CLP)"] <= Math.max(a,b)) score += 4; else score -= 8;
  }
  return score;
}

function formatProduct(p) {
  return `• ${p["Nombre"]} | ${p["Marca"]} | $${Number(p["Precio Oferta (CLP)"]).toLocaleString("es-CL")} ${p["Descuento %"] ? `(-${p["Descuento %"]}%)` : ""} | ${p["Categoría Nombre"]} > ${p["Subcategoría"]} | Stock:${p["Stock"]} | SEC:${p["Certificado SEC"]} | Rating:${p["Rating (1-5)"]} | ${p["URL Producto"]}`;
}

async function queryAgent(q, products) {
  if (!q.trim()) return "Escribe algo, ej: 'busca panel LED 36W' o 'proyector IP66 bajo 50000 con SEC'";
  const scored = products.map(p => ({ p, s: scoreProduct(p, q) })).sort((a,b)=>b.s-a);
  const top = scored.filter(x=>x.s>0).slice(0,5);
  if (top.length===0) {
    return `No encontré matches para "${q}". Prueba con: "LED", "Fluke", "panel 18W", "batería 18650", "SEC", "B2B", "menos de 20000".`;
  }
  let out = `🔍 Consulta: "${q}" → ${top.length} resultados (de ${products.length})\n\n`;
  out += top.map(({p,s})=> formatProduct(p) + `  [score ${s}]`).join("\n");
  // resumen
  const best = top[0].p;
  out += `\n\n💡 Recomendado: ${best["Nombre"]} — ${best["Descripción Corta"]}. Specs: ${best["Specs Texto"] || "—"}. Precio mayorista 10+: $${Number(best["Precio Mayorista 10+ (CLP)"]).toLocaleString("es-CL")}`;
  return out;
}

async function main() {
  const products = await loadProducts();
  console.log(`✅ DB cargada: ${products.length} productos desde ${xlsxPath}\n`);

  const args = process.argv.slice(2);
  if (args.includes("--interactive") || args.includes("-i")) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () => rl.question("\n❓ Tu consulta (o 'salir'): ", async (q) => {
      if (q.toLowerCase()==="salir" || q.toLowerCase()==="exit") { rl.close(); return; }
      console.log("\n" + await queryAgent(q, products));
      ask();
    });
    console.log("Modo interactivo. Ejemplos:");
    console.log(" - busca proyector LED IP66 bajo 50000");
    console.log(" - panel LED 36W con SEC");
    console.log(" - batería 18650 Samsung");
    console.log(" - herramientas B2B");
    ask();
  } else if (args.length>0) {
    const q = args.join(" ");
    console.log(await queryAgent(q, products));
  } else {
    // demo
    const demos = [
      "proyector LED 200W SEC",
      "panel LED 36W",
      "menos de 10000",
      "batería 18650 Samsung",
      "Fluke multímetro",
      "SEC con descuento",
    ];
    for (const d of demos) {
      console.log("\n" + "=".repeat(70));
      console.log(await queryAgent(d, products));
    }
    console.log("\n\nTip: usa `npx tsx scripts/probar-agente.mjs \"tu consulta\"` o `--interactive`");
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
