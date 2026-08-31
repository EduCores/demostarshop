import { NextRequest, NextResponse } from "next/server";
import { products, superCategories } from "@/lib/mock-data";

const catMap = Object.fromEntries(superCategories.map(c => [c.id, c.name]));

// --- Retrieval simple (keywords + filtros) - mismo que scripts/probar-agente.mjs ---
function scoreProduct(p: any, query: string) {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  const haystack = [p.name, p.description, p.shortDescription, p.brand, catMap[p.categoryId], p.subcategory, (p.tags||[]).join(" "), Object.values(p.specs||{}).join(" ")].join(" ").toLowerCase();
  for (const t of tokens) {
    if (haystack.includes(t)) score += 2;
    if (String(p.name).toLowerCase().includes(t)) score += 3;
    if ((p.tags||[]).join(" ").toLowerCase().includes(t)) score += 2;
  }
  if (q.includes("sec") && p.secCertified) score += 5;
  if (q.includes("bestseller") && p.isBestSeller) score += 4;
  if (q.includes("flash") && p.isFlashSale) score += 4;
  if (q.includes("b2b") && p.isB2B) score += 3;
  const mPrecio = q.match(/(?:bajo|menos de|menor|<)\s*\$?\s*([\d\.]+)/i);
  if (mPrecio) {
    const max = parseInt(mPrecio[1].replace(/\./g, ""));
    if (p.price <= max) score += 4; else score -= 10;
  }
  const mEntre = q.match(/entre\s*\$?\s*([\d\.]+)\s*y\s*\$?\s*([\d\.]+)/i);
  if (mEntre) {
    const a = parseInt(mEntre[1].replace(/\./g, "")), b = parseInt(mEntre[2].replace(/\./g, ""));
    if (p.price >= Math.min(a,b) && p.price <= Math.max(a,b)) score += 4; else score -= 8;
  }
  return score;
}

function getTopProducts(query: string, k = 5) {
  const scored = products.map(p => ({ p, s: scoreProduct(p, query) })).sort((a,b)=> (b.s as number) - (a.s as number));
  const top = scored.filter(x=>x.s>0).slice(0,k);
  // si nada matchea, devuelve los más vendidos como fallback
  if (top.length===0) {
    return products.filter(p=>p.isBestSeller).slice(0,3).map(p=>({p, s:1}));
  }
  return top;
}

function formatContext(top: {p:any,s:number}[]) {
  return top.map(({p,s}) => 
    `- ${p.name} | SKU:${p.sku} | Marca:${p.brand} | $${p.price.toLocaleString("es-CL")} ${p.discount?`(-${p.discount}%)`:``} | ${catMap[p.categoryId]} > ${p.subcategory} | Stock:${p.stock} | SEC:${p.secCertified?"SÍ":"NO"} | Rating:${p.rating} | URL:/producto/${p.slug} | Specs:${Object.entries(p.specs||{}).map(([k,v])=>`${k}:${v}`).join(", ")}`
  ).join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const { message, agentSlug, storeId } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Falta message" }, { status: 400 });
    }

    const top = getTopProducts(message, 5);
    const context = formatContext(top);
    const best = top[0]?.p;

    // Tool navigateTo: si el LLM no lo genera, lo inferimos si hay un match claro
    const toolCalls: any[] = [];
    if (best && scoreProduct(best, message) >= 6) {
      // No forzamos siempre, solo si el score es alto y la query pide "ver" "ir" "producto"
      const wantsNav = /ver|ir|mostrar|producto|detalle|link/i.test(message);
      if (wantsNav) {
        toolCalls.push({
          toolName: "navigateTo",
          args: { path: `/producto/${best.slug}` },
        });
      }
    }

    // Si no hay keys de LLM, responde en modo RAG mock (sin gastar tokens) - útil para probar Excel sin OpenRouter
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const apiKey = openRouterKey || openAiKey;
    const isOpenRouter = !!openRouterKey;

    if (!apiKey) {
      const mockText = `Encontré ${top.length} productos para "${message}" (modo demo sin LLM, usando RAG sobre Excel):\n\n${top.map(({p})=>`• **${p.name}** — $${p.price.toLocaleString("es-CL")} ${p.discount?`(-${p.discount}%)`:``} | ${catMap[p.categoryId]} | ${p.secCertified?"SEC ✅":""} | Stock:${p.stock} → /producto/${p.slug}`).join("\n")}\n\n¿Quieres que te lleve al detalle del recomendado **${best?.name}**?`;
      return NextResponse.json({ text: mockText, toolCalls: toolCalls.length?toolCalls:undefined, debug: { mode: "mock-rag", topIds: top.map(t=>t.p.id) } });
    }

    // --- Llamada LLM con contexto RAG ---
    const model = process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || (isOpenRouter ? "qwen/qwen3-30b-a3b" : "gpt-4o-mini");
    const systemPrompt = `Eres Star, asistente de ventas de Starshop (tienda chilena de iluminación LED, herramientas, medición, seguridad). Responde en español de Chile, conciso y útil. Usa SOLO el contexto de productos provisto. Si el usuario pide ver/detalle, sugiere el URL. Incluye siempre SKU, precio CLP, SEC y URL. Si no hay stock, dilo. No inventes productos ni precios. Si la pregunta es fuera de catálogo, di que no está en el Excel.`;

    const userPrompt = `Contexto de productos (Excel RAG - top ${top.length}):\n${context}\n\nPregunta del cliente: ${message}\n\nResponde usando solo el contexto. Si hay un producto claramente solicitado, recomienda 1-2 y da su URL /producto/[slug].`;

    const endpoint = isOpenRouter ? "https://openrouter.ai/api/v1/chat/completions" : "https://api.openai.com/v1/chat/completions";
    const headers: Record<string,string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };
    if (isOpenRouter) {
      headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_APP_URL || "https://demostarshop.vercel.app";
      headers["X-Title"] = "Starshop RAG";
    }

    const r = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("[chat] LLM error", r.status, errText);
      // Fallback a mock si falla LLM
      const fallback = `Error LLM (${r.status}). Te muestro resultados RAG directos:\n\n${top.map(({p})=>`• ${p.name} — $${p.price.toLocaleString("es-CL")} → /producto/${p.slug}`).join("\n")}`;
      return NextResponse.json({ text: fallback, toolCalls: toolCalls.length?toolCalls:undefined, error: `LLM ${r.status}: ${errText.slice(0,300)}` });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "Sin respuesta del LLM.";

    // Si el LLM menciona un producto, intenta extraer navigateTo
    if (!toolCalls.length && best) {
      const lower = text.toLowerCase();
      if (lower.includes(best.slug) || lower.includes(best.name.toLowerCase().slice(0,15))) {
        // no forzamos, solo si el texto ya recomienda ese producto
      }
    }

    return NextResponse.json({ text, toolCalls: toolCalls.length?toolCalls:undefined, debug: { model, topIds: top.map(t=>t.p.id) } });

  } catch (err: any) {
    console.error("[chat] error", err);
    return NextResponse.json({ error: err.message || "Error en chat" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY,
    model: process.env.OPENROUTER_MODEL || process.env.OPENAI_MODEL || "qwen/qwen3-30b-a3b (default)",
    products: products.length,
    example: "POST { message: 'proyector LED bajo 50000 SEC' }"
  });
}
