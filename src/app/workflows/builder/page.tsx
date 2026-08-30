"use client";
import { useState, useCallback, useEffect } from "react";
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { FileText, Play, Copy, Check } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 80, y: 80 },
    data: { label: "Trigger: Carrito mock" },
    style: { border: "2px solid #FFD814", borderRadius: 12, padding: 10, background: "white", fontWeight: 600 },
  },
  {
    id: "2",
    position: { x: 320, y: 160 },
    data: { label: "Action: Generar Cotización PDF" },
    style: { border: "2px solid #ff5916", borderRadius: 12, padding: 10, background: "white", fontWeight: 600 },
  },
];

const initialEdges: Edge[] = [{ id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#232F3E" } }];

const generatedCode = `// Generado por builder visual (React Flow + Vercel Workflows) — mockup
export async function cotizacionWorkflow(input: { rut: string; empresa: string; items: any[] }) {
  "use workflow";
  const ok = await validarRUT(input.rut); // 'use step'
  const cotizacion = await generarCotizacionPDF(input); // 'use step'
  return cotizacion;
}
export async function validarRUT(rut: string) { "use step"; return rut.length >= 8; }
export async function generarCotizacionPDF(data: any) { "use step"; return { pdf: "cotizacion-"+Date.now()+".txt" }; }`;

export default function BuilderPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      // simple apply - reactflow helper not imported to avoid extra dep
      return nds;
    });
  }, []);

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-black flex items-center gap-2"><FileText className="h-6 w-6" /> Builder Visual — React Flow + Vercel Workflows (demo)</h1>
      <p className="text-sm text-zinc-500 mt-1">Arrastra los nodos. Este builder es <strong>mockup</strong> y genera TS con <code>&quot;use workflow&quot;</code> para tu repo. Productos mockup.</p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs text-amber-800">Demo local: no requiere DB. El código generado va a <code>src/app/workflows/cotizacion-mock.ts</code> y corre con <code>workflow</code> SDK.</div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-zinc-900 h-[420px]">
          {mounted ? (
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} fitView>
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-zinc-500">Cargando canvas...</div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm">Código generado</h2>
            <Button size="sm" variant="outline" onClick={copy} className="gap-1.5">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copiado" : "Copiar"}</Button>
          </div>
          <pre className="bg-zinc-950 text-zinc-100 p-4 rounded-lg text-xs overflow-auto max-h-[320px]">{generatedCode}</pre>
          <div className="flex gap-2">
            <Button onClick={() => alert("Demo: en prod haría start(cotizacionWorkflow, [carritoMock])")} className="gap-1.5"><Play className="h-4 w-4" /> Simular start()</Button>
            <a href="/cotizacion" className="inline-flex"><Button variant="outline">Ir a Cotizador mock</Button></a>
          </div>
          <p className="text-xs text-zinc-500">Para Vercel real: <code>POST /api/cotizacion/start</code> hace <code>start(cotizacionWorkflow, [body])</code> y ves el run en Dashboard → Observability → Workflows.</p>
        </div>
      </div>
    </div>
  );
}
