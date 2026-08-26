"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";

function WebpayReturnContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "failure" | "aborted">("loading");
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const tokenWs = searchParams.get("token_ws");
    const tbkToken = searchParams.get("TBK_TOKEN");
    const tbkOrden = searchParams.get("TBK_ORDEN_COMPRA");
    const tbkIdSesion = searchParams.get("TBK_ID_SESION");

    if (tbkToken && !tokenWs) {
      setStatus("aborted");
      setDetail({ TBK_TOKEN: tbkToken, TBK_ORDEN_COMPRA: tbkOrden, TBK_ID_SESION: tbkIdSesion });
      return;
    }

    if (!tokenWs) {
      setStatus("failure");
      return;
    }

    const commit = async () => {
      try {
        const res = await fetch("/api/webpay/commit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_ws: tokenWs }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error al confirmar pago");

        const isApproved = json.status === "AUTHORIZED" && json.response_code === 0;
        setDetail(json);
        if (isApproved) {
          clearCart();
          setStatus("success");
        } else {
          setStatus("failure");
        }
      } catch (err: unknown) {
        console.error(err);
        setStatus("failure");
      }
    };

    commit();
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return (
      <div className="container py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-zinc-400" />
        <p className="text-zinc-500 mt-3">Confirmando pago con Transbank...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container py-16 max-w-xl text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-black mt-4">¡Pago aprobado por Webpay!</h1>
        <p className="text-zinc-500 mt-2">Tu transacción fue autorizada. Te enviamos el comprobante por email.</p>
        {detail && (
          <pre className="text-xs text-left bg-zinc-50 border rounded p-3 mt-4 overflow-auto">{JSON.stringify(detail, null, 2)}</pre>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/checkout/success?gateway=webpay"><Button variant="starshop">Ver comprobante</Button></Link>
          <Link href="/"><Button variant="outline">Volver a la tienda</Button></Link>
        </div>
      </div>
    );
  }

  if (status === "aborted") {
    return (
      <div className="container py-16 max-w-xl text-center">
        <XCircle className="h-16 w-16 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-black mt-4">Pago cancelado</h1>
        <p className="text-zinc-500 mt-2">Cancelaste la transacción en Webpay o expiró el tiempo. Puedes reintentar.</p>
        {detail && <pre className="text-xs text-left bg-zinc-50 border rounded p-3 mt-4 overflow-auto">{JSON.stringify(detail, null, 2)}</pre>}
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/checkout"><Button variant="starshop">Volver al checkout</Button></Link>
          <Link href="/"><Button variant="outline">Ir a la tienda</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 max-w-xl text-center">
      <XCircle className="h-16 w-16 text-red-500 mx-auto" />
      <h1 className="text-2xl font-black mt-4">Pago rechazado</h1>
      <p className="text-zinc-500 mt-2">Transbank rechazó la transacción. Verifica tu tarjeta o intenta con otro medio.</p>
      {detail && <pre className="text-xs text-left bg-zinc-50 border rounded p-3 mt-4 overflow-auto">{JSON.stringify(detail, null, 2)}</pre>}
      <div className="flex gap-3 justify-center mt-6">
        <Link href="/checkout"><Button variant="starshop">Reintentar</Button></Link>
        <Link href="/"><Button variant="outline">Volver</Button></Link>
      </div>
    </div>
  );
}

export default function WebpayReturnPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center text-zinc-500">Cargando...</div>}>
      <WebpayReturnContent />
    </Suspense>
  );
}
