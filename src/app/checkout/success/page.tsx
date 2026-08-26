"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Order, PaymentMethod } from "@/types";
import { formatCLP } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck, Download, ArrowLeft, FileText, XCircle } from "lucide-react";
import { useCart } from "@/store/cart";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  webpay: "WebPay (Transbank)",
  mercadopago: "MercadoPago",
  transferencia: "Transferencia B2B",
};

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const gateway = searchParams.get("gateway");
  const statusParam = searchParams.get("status");
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    const raw = sessionStorage.getItem("starshop-last-order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as Order);
      } catch {
        setOrder(null);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && order && gateway === "mercadopago" && statusParam !== "failure" && statusParam !== "pending") {
      clearCart();
    }
  }, [loaded, order, gateway, statusParam, clearCart]);

  const downloadReceipt = () => {
    if (!order) return;
    const lines = [
      "STASHOP — COMPROBANTE DE PEDIDO",
      "================================",
      `Orden: ${order.orderId}`,
      `Fecha: ${new Date(order.createdAt).toLocaleString("es-CL")}`,
      "",
      "CLIENTE",
      `Razón Social / Nombre: ${order.customer.nombre}`,
      `RUT: ${order.customer.rut}`,
      `Email: ${order.customer.email}`,
      `Teléfono: ${order.customer.telefono}`,
      `Dirección: ${order.customer.direccion}`,
      `Comuna: ${order.comuna} — ${order.region}`,
      "",
      "PRODUCTOS",
      ...order.items.map((i) => `- ${i.name} x${i.quantity}  ${formatCLP(i.price * i.quantity)}`),
      "",
      `Subtotal: ${formatCLP(order.subtotal)}`,
      `Envío: ${order.shippingCost === 0 ? "GRATIS" : formatCLP(order.shippingCost)}`,
      `TOTAL: ${formatCLP(order.grandTotal)}`,
      `Método de pago: ${PAYMENT_LABELS[order.paymentMethod]}`,
      `Entrega estimada: ${order.estimatedDays}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comprobante-${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return <div className="container py-24 text-center text-zinc-500">Cargando comprobante…</div>;
  }

  if (!order) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold">No hay pedido reciente</h1>
        <p className="text-zinc-500 mt-2">No encontramos información de un pedido para mostrar.</p>
        <Link href="/" className="inline-block mt-4">
          <Button variant="starshop">Volver a la tienda</Button>
        </Link>
      </div>
    );
  }

  if (gateway === "mercadopago" && statusParam === "failure") {
    return (
      <div className="container py-16 max-w-xl text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-black mt-4">Pago no completado</h1>
        <p className="text-zinc-500 mt-2">MercadoPago no aprobó el pago. Puedes reintentar o elegir otro método.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/checkout"><Button variant="starshop">Reintentar</Button></Link>
          <Link href="/"><Button variant="outline">Volver a la tienda</Button></Link>
        </div>
      </div>
    );
  }

  if (gateway === "mercadopago" && statusParam === "pending") {
    return (
      <div className="container py-16 max-w-xl text-center">
        <CheckCircle2 className="h-16 w-16 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-black mt-4">Pago pendiente</h1>
        <p className="text-zinc-500 mt-2">MercadoPago marcó el pago como pendiente. Te avisaremos por email cuando se acredite.</p>
        <p className="text-sm text-zinc-400 mt-1">Ref: {order.orderId} — Revisa tu email {order.customer.email}</p>
        <div className="flex gap-3 justify-center mt-6">
          <Link href="/"><Button variant="starshop">Volver a la tienda</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="bg-white dark:bg-zinc-900 rounded-lg border p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-black mt-4">¡Pedido confirmado!</h1>
        <p className="text-zinc-500 mt-1">
          Gracias <strong>{order.customer.nombre}</strong>. Hemos recibido tu pedido <strong>{order.orderId}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button variant="outline" onClick={downloadReceipt}>
            <Download className="h-4 w-4" /> Descargar comprobante
          </Button>
          <Link href="/">
            <Button variant="starshop">
              <ArrowLeft className="h-4 w-4" /> Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border p-6 mt-6 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4" /> Detalle del pedido
          </h2>
          <div className="divide-y">
            {order.items.map((i) => (
              <div key={i.id} className="py-3 flex items-center gap-3">
                <img src={i.image} alt={i.name} className="h-12 w-12 object-cover rounded border bg-zinc-50" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium line-clamp-2 leading-tight">{i.name}</div>
                  <div className="text-xs text-zinc-500">Cant: {i.quantity}</div>
                </div>
                <div className="text-sm font-bold">{formatCLP(i.price * i.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCLP(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío</span>
              <span className={order.shippingCost === 0 ? "text-emerald-600 font-bold" : ""}>
                {order.shippingCost === 0 ? "GRATIS" : formatCLP(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-black text-base border-t pt-2">
              <span>Total</span>
              <span className="text-[#B12704]">{formatCLP(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-bold flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4" /> Despacho y pago
            </h2>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between"><span className="text-zinc-500">Método de pago</span><span className="font-medium">{PAYMENT_LABELS[order.paymentMethod]}</span></li>
              <li className="flex justify-between"><span className="text-zinc-500">Dirección</span><span className="font-medium text-right max-w-[60%]">{order.customer.direccion}</span></li>
              <li className="flex justify-between"><span className="text-zinc-500">Comuna / Región</span><span className="font-medium text-right max-w-[60%]">{order.comuna} — {order.region}</span></li>
              <li className="flex justify-between"><span className="text-zinc-500">Entrega estimada</span><span className="font-medium">{order.estimatedDays}</span></li>
            </ul>
          </div>
          {(gateway === "transferencia" || order.paymentMethod === "transferencia") ? (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <div className="font-bold">Datos para Transferencia B2B</div>
              <div>Banco: <strong>Banco de Chile</strong> — Cuenta Corriente <strong>123-45678-90</strong></div>
              <div>RUT: <strong>76.123.456-7</strong> — Razón Social: <strong>Starshop SpA</strong></div>
              <div>Email comprobante: <strong>ventas@starshop.cl</strong> — Asunto: {order.orderId}</div>
              <div className="pt-1 text-[11px]">Envía el comprobante y emitimos factura en 24h. Tu pedido queda reservado por 48h.</div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
              Te enviaremos la confirmación y datos de seguimiento a <strong>{order.customer.email}</strong>. Para transferencia B2B, la factura se emitirá una vez acreditado el pago.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center text-zinc-500">Cargando...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
