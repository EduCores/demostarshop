"use client";
import { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const ACS_URL = process.env.NEXT_PUBLIC_ACS_API_URL ?? "https://agentic-commerce-stack.vercel.app";

export function ACSChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; text: string }[]>([
    { role: "agent", text: "¡Hola! Soy el asistente de StarShop. Puedo buscar productos, ver stock y ayudarte a comprar. ¿Qué buscás?" },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const r = await fetch(`${ACS_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, agentSlug: "sales-assistant", storeId: "seed-store" }),
      });
      const data = await r.json();
      setMessages((m) => [...m, { role: "agent", text: data.text ?? data.error ?? "Sin respuesta" }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "agent", text: "Error: no pude conectar con ACS. Verifica OPENROUTER_API_KEY en Vercel." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#232F3E] text-white shadow-lg flex items-center justify-center hover:bg-black transition"
        aria-label="Abrir chat ACS"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[340px] max-w-[92vw] h-[420px] bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          <div className="bg-[#232F3E] text-white px-4 py-3 flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#FFD814]" />
            <span className="font-bold text-sm">Asistente ACS — qwen3-30b</span>
            <span className="ml-auto text-[10px] bg-[#FFD814] text-black px-2 py-0.5 rounded-full">demo</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-zinc-50">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={m.role === "user" ? "bg-[#232F3E] text-white px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%] text-sm" : "bg-white border px-3 py-2 rounded-2xl rounded-bl-sm max-w-[80%] text-sm shadow-sm"}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-zinc-500">Escribiendo...</div>}
          </div>
          <div className="p-2 border-t flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ej: busca silla gamer"
              className="flex-1 border rounded-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#FFD814]"
            />
            <button onClick={send} disabled={loading} className="h-9 w-9 rounded-full bg-[#FFD814] flex items-center justify-center hover:bg-[#F7CA00] disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
