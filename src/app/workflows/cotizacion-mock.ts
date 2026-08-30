// Demo workflow StarShop (mockup) — durable con Vercel Workflows
// Productos son mockup, no es oferta real.

export async function validarRUT(rut: string) {
  "use step";
  // Validación simple mock
  return rut.length >= 8;
}

export async function generarCotizacionPDF(data: { rut: string; empresa: string; items: any[] }) {
  "use step";
  const total = data.items.reduce((a, b) => a + (b.product.price * b.quantity), 0);
  return { total, iva: Math.round(total * 0.19), pdf: `cotizacion-${Date.now()}.txt` };
}

export async function cotizacionWorkflow(input: { rut: string; empresa: string; items: any[] }) {
  "use workflow";
  const ok = await validarRUT(input.rut);
  if (!ok) throw new Error("RUT inválido (demo)");

  // Pausa durable 48h esperando aprobación de ventas@starshop.cl (demo: sleep 10s)
  // En prod: await hook('aprobacion-ventas')
  const cotizacion = await generarCotizacionPDF(input);
  return cotizacion;
}
