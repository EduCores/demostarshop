#!/usr/bin/env node
// Genera data/productos-embeddings.json con vectores para RAG híbrido
// Usa OPENAI_API_KEY o OPENROUTER_API_KEY + OPENROUTER_EMBED_MODEL
// Si no hay key, genera mock determinístico para probar sin gastar
import fs from "fs";
import path from "path";
import { products, superCategories } from "../src/lib/mock-data.ts";

const catMap = Object.fromEntries(superCategories.map(c => [c.id, c.name]));
function productText(p) {
  return `${p.name} ${p.shortDescription} ${p.description} ${p.brand} ${catMap[p.categoryId]} ${p.subcategory} ${(p.tags||[]).join(" ")} ${Object.entries(p.specs||{}).map(([k,v])=>`${k} ${v}`).join(" ")}`.slice(0,8000);
}

function mockEmbedding(text, dim=1536) {
  // hash determinístico simple para demo sin API
  const vec = new Array(dim).fill(0);
  let h=2166136261;
  for (let i=0;i<text.length;i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  for (let i=0;i<dim;i++) {
    const x = Math.sin(h + i*9999) * 10000;
    vec[i] = (x - Math.floor(x)) * 2 - 1;
  }
  // normaliza
  const norm = Math.sqrt(vec.reduce((a,b)=>a+b*b,0));
  return vec.map(v=>v/norm);
}

async function realEmbedding(text, apiKey, isOpenRouter) {
  const endpoint = isOpenRouter ? "https://openrouter.ai/api/v1/embeddings" : "https://api.openai.com/v1/embeddings";
  const model = isOpenRouter ? (process.env.OPENROUTER_EMBED_MODEL || "openai/text-embedding-3-small") : (process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small");
  const headers = { "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` };
  if (isOpenRouter) { headers["HTTP-Referer"]=process.env.NEXT_PUBLIC_APP_URL||"https://demostarshop.vercel.app"; headers["X-Title"]="Starshop Embeddings"; }
  const r = await fetch(endpoint, { method:"POST", headers, body: JSON.stringify({ model, input: text }) });
  if (!r.ok) throw new Error(`${r.status} ${await r.text().then(t=>t.slice(0,300))}`);
  const j = await r.json();
  return j.data[0].embedding;
}

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
const isOpenRouter = !!process.env.OPENROUTER_API_KEY;

if (!apiKey) console.log("⚠️  Sin API key — genero embeddings MOCK determinísticos (para probar híbrido sin costo). Para reales, setea OPENAI_API_KEY o OPENROUTER_API_KEY");
else console.log(`🔑 Usando ${isOpenRouter?"OpenRouter":"OpenAI"} embeddings`);

const out = {};
let ok=0, fail=0;
for (const p of products) {
  const text = productText(p);
  try {
    const vec = apiKey ? await realEmbedding(text, apiKey, isOpenRouter) : mockEmbedding(text);
    out[p.id] = vec;
    ok++;
    process.stdout.write(`\r${ok}/${products.length} ${p.id}`);
  } catch(e){
    console.error(`\nfail ${p.id}`, e.message);
    out[p.id] = mockEmbedding(text);
    fail++;
  }
}
const outPath = path.join("data","productos-embeddings.json");
fs.mkdirSync(path.dirname(outPath), { recursive:true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 0));
console.log(`\n✅ Guardado ${Object.keys(out).length} vectores (${ok} ok, ${fail} fallback) en ${outPath} (${(fs.statSync(outPath).size/1024).toFixed(1)} KB)`);
console.log(`   Dim: ${out[products[0].id].length}, ejemplo p001[0..3]=`, out["p001"].slice(0,3).map(v=>v.toFixed(4)));
